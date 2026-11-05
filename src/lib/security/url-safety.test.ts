import { describe, it, expect } from "vitest";
import { isPrivateIPv4, isPrivateIPv6, validateSafeUrl } from "./url-safety";

describe("URL Safety & SSRF Guard", () => {
  it("correctly identifies private and loopback IPv4 addresses", () => {
    expect(isPrivateIPv4("127.0.0.1")).toBe(true);
    expect(isPrivateIPv4("127.255.255.255")).toBe(true);
    expect(isPrivateIPv4("10.0.0.5")).toBe(true);
    expect(isPrivateIPv4("172.16.0.1")).toBe(true);
    expect(isPrivateIPv4("172.31.255.254")).toBe(true);
    expect(isPrivateIPv4("192.168.1.100")).toBe(true);
    expect(isPrivateIPv4("169.254.169.254")).toBe(true); // AWS/cloud metadata IP
    expect(isPrivateIPv4("0.0.0.0")).toBe(true);
  });

  it("permits public routable IPv4 addresses", () => {
    expect(isPrivateIPv4("8.8.8.8")).toBe(false);
    expect(isPrivateIPv4("1.1.1.1")).toBe(false);
    expect(isPrivateIPv4("104.16.132.229")).toBe(false);
  });

  it("correctly identifies loopback and private IPv6 addresses", () => {
    expect(isPrivateIPv6("::1")).toBe(true);
    expect(isPrivateIPv6("0:0:0:0:0:0:0:1")).toBe(true);
    expect(isPrivateIPv6("fc00::1")).toBe(true);
    expect(isPrivateIPv6("fe80::1")).toBe(true);
  });

  it("rejects non-HTTPS URLs", async () => {
    const res = await validateSafeUrl("http://example.com/product");
    expect(res.safe).toBe(false);
    expect(res.error).toContain("Only HTTPS URLs are permitted");
  });

  it("rejects localhost and internal hostnames", async () => {
    const resLocal = await validateSafeUrl("https://localhost/item");
    expect(resLocal.safe).toBe(false);

    const resInternal = await validateSafeUrl("https://api.internal/item");
    expect(resInternal.safe).toBe(false);
  });
});

