import dns from "dns/promises";
import net from "net";

export interface SafeFetchResult {
  ok: boolean;
  status: number;
  url: string;
  html?: string;
  contentType?: string;
  error?: string;
}

/**
 * Checks if an IPv4 address is within private, loopback, or link-local ranges.
 */
export function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // invalid ip is treated as unsafe
  }

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;

  // 10.0.0.0/8 (Private RFC 1918)
  if (parts[0] === 10) return true;

  // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 - 172.31.255.255)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  // 192.168.0.0/16 (Private RFC 1918)
  if (parts[0] === 192 && parts[1] === 168) return true;

  // 169.254.0.0/16 (Link-Local)
  if (parts[0] === 169 && parts[1] === 254) return true;

  // 0.0.0.0/8 (Current network)
  if (parts[0] === 0) return true;

  // 224.0.0.0/4 (Multicast) or 240.0.0.0/4 (Reserved)
  if (parts[0] >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is private or loopback.
 */
export function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  // ::1 (Loopback)
  if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
  // :: (Unspecified)
  if (normalized === "::" || normalized === "0:0:0:0:0:0:0:0") return true;
  // Unique local addresses (fc00::/7)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  // Link-local unicast (fe80::/10)
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) return true;

  return false;
}

/**
 * Validates a target URL against SSRF attack vectors.
 */
export async function validateSafeUrl(urlString: string): Promise<{ safe: boolean; url?: URL; error?: string }> {
  let parsed: URL;

  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { safe: false, error: "Malformed URL syntax." };
  }

  // 1. Strict Protocol Enforcement
  if (parsed.protocol !== "https:") {
    return {
      safe: false,
      error: "Insecure protocol. Only HTTPS URLs are permitted.",
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Hostname blocklist
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".corp") ||
    hostname.endsWith(".onion")
  ) {
    return { safe: false, error: "Access to local or private hostnames is forbidden." };
  }

  // 3. If hostname is directly an IP literal
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname) && isPrivateIPv4(hostname)) {
      return { safe: false, error: "Access to private IP ranges is forbidden." };
    }
    if (net.isIPv6(hostname) && isPrivateIPv6(hostname)) {
      return { safe: false, error: "Access to private IPv6 addresses is forbidden." };
    }
  }

  // 4. DNS Resolution Check (prevent DNS rebinding / internal routing)
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { safe: false, error: "Unable to resolve target domain." };
    }

    for (const record of addresses) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        return { safe: false, error: "Domain resolved to a prohibited private network address." };
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        return { safe: false, error: "Domain resolved to a prohibited private IPv6 address." };
      }
    }
  } catch (err: any) {
    return { safe: false, error: `DNS resolution failed: ${err.message}` };
  }

  return { safe: true, url: parsed };
}

/**
 * Safely fetches an external URL with timeout, size capping, and redirect re-validation.
 */
export async function safeFetchHtml(
  targetUrl: string,
  options: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number } = {}
): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxBytes = options.maxBytes ?? 2 * 1024 * 1024; // 2 MB cap
  const maxRedirects = options.maxRedirects ?? 3;

  let currentUrl = targetUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    const validation = await validateSafeUrl(currentUrl);
    if (!validation.safe || !validation.url) {
      return {
        ok: false,
        status: 400,
        url: currentUrl,
        error: validation.error || "Prohibited target destination.",
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        method: "GET",
        signal: controller.signal,
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; FITMATCH-Engine/1.0)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      clearTimeout(timeoutId);

      // Handle redirect safely
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) {
          return { ok: false, status: response.status, url: currentUrl, error: "Redirect header missing." };
        }
        const resolvedRedirect = new URL(location, currentUrl).toString();
        currentUrl = resolvedRedirect;
        redirectsCount++;
        continue;
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          url: currentUrl,
          error: `Retailer server returned status ${response.status}`,
        };
      }

      const contentType = response.headers.get("content-type") || "";

      // Stream with size cap
      const reader = response.body?.getReader();
      if (!reader) {
        const text = await response.text();
        return { ok: true, status: response.status, url: currentUrl, html: text, contentType };
      }

      let receivedBytes = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.length;
          if (receivedBytes > maxBytes) {
            reader.cancel();
            return {
              ok: false,
              status: 413,
              url: currentUrl,
              error: "Response payload exceeded maximum allowable size (2MB).",
            };
          }
          chunks.push(value);
        }
      }

      const merged = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }

      const html = new TextDecoder("utf-8").decode(merged);
      return { ok: true, status: response.status, url: currentUrl, html, contentType };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        return { ok: false, status: 504, url: currentUrl, error: "Request timed out after 8 seconds." };
      }
      return { ok: false, status: 500, url: currentUrl, error: err.message || "Failed to fetch retailer page." };
    }
  }

  return { ok: false, status: 508, url: currentUrl, error: "Exceeded maximum allowable redirects." };
}
