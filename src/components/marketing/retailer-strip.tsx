"use client";

import { Badge } from "../ui/badge";
import { Container } from "../layout/container";

interface RetailerItem {
  name: string;
  domain: string;
  status: "active" | "beta" | "manual" | "planned";
  category: string;
}

const RETAILERS: RetailerItem[] = [
  { name: "ZARA", domain: "zara.com", status: "beta", category: "High Street" },
  { name: "H&M", domain: "hm.com", status: "beta", category: "Apparel" },
  { name: "COS", domain: "cos.com", status: "manual", category: "Contemporary" },
  { name: "UNIQLO", domain: "uniqlo.com", status: "manual", category: "Essentials" },
  { name: "ARKET", domain: "arket.com", status: "manual", category: "Nordic" },
  { name: "MANGO", domain: "mango.com", status: "manual", category: "Tailored" },
  { name: "SSENSE", domain: "ssense.com", status: "planned", category: "Luxury" },
  { name: "ASOS", domain: "asos.com", status: "planned", category: "Multi-Brand" },
];

export function RetailerStrip() {
  return (
    <section id="retailers" className="py-20 border-y border-[#202020] bg-[#0c0c0c]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // ECOSYSTEM REPOSITORIES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              Supported Retailers & Brands
            </h2>
          </div>
          <p className="text-xs text-[#888] max-w-md font-mono">
            Integrity-first integrations. Automatic extraction is labeled by live testing status;
            unsupported stores smoothly fall back to manual chart calibration.
          </p>
        </div>

        {/* Retailer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {RETAILERS.map((retailer) => {
            const getBadgeVariant = (s: string) => {
              if (s === "active") return "active";
              if (s === "beta") return "beta";
              if (s === "manual") return "outline";
              return "subtle";
            };

            const getStatusLabel = (s: string) => {
              if (s === "beta") return "BETA ADAPTER";
              if (s === "manual") return "MANUAL FALLBACK";
              if (s === "planned") return "PLANNED";
              return "ACTIVE";
            };

            return (
              <div
                key={retailer.name}
                className="group relative p-5 rounded-xl border border-[#262626] bg-[#111111] hover:border-[#555] transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-[#555]">
                    {retailer.category}
                  </span>
                  <Badge variant={getBadgeVariant(retailer.status)}>
                    {getStatusLabel(retailer.status)}
                  </Badge>
                </div>

                <div className="text-lg font-bold tracking-wider text-white">
                  {retailer.name}
                </div>
                <div className="text-[11px] font-mono text-[#666] mt-0.5">
                  {retailer.domain}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote on Scraping & Integrity */}
        <div className="mt-8 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#666] gap-2">
          <span>SSRF PROTECTED // ONLY HTTPS SERVER-SIDE FETCH</span>
          <span>NEVER PASSWORDS OR SCRAPED ACCOUNTS</span>
        </div>
      </Container>
    </section>
  );
}
