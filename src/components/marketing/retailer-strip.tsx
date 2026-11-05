"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Container } from "../layout/container";
import { TRANSITION_EASE } from "@/lib/motion/variants";
import { MaskedHeading } from "../motion/masked-text";

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
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: TRANSITION_EASE },
    },
  };

  return (
    <section id="retailers" className="py-24 sm:py-28 bg-transparent relative overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // ECOSYSTEM REPOSITORIES
            </div>
            <MaskedHeading as="h2" className="font-display text-2xl sm:text-4xl font-medium tracking-tight text-white uppercase">
              Supported Retailers & Brands
            </MaskedHeading>
          </div>
          <p className="text-xs text-[#888] max-w-md font-mono leading-relaxed">
            Integrity-first integrations. Automatic extraction is labeled by live testing status;
            unsupported stores smoothly fall back to manual chart calibration.
          </p>
        </div>

        {/* Retailer Grid with Staggered Entrance */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4"
        >
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
              <motion.div
                key={retailer.name}
                variants={item}
                whileHover={{ y: -3 }}
                className="group relative p-6 rounded-2xl border border-[#222222] bg-[#0e0e0e] hover:border-neutral-400 transition-all duration-200 overflow-hidden"
              >
                {/* Subtle border sheen accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#555] tracking-wider uppercase">
                    {retailer.category}
                  </span>
                  <Badge variant={getBadgeVariant(retailer.status)}>
                    {getStatusLabel(retailer.status)}
                  </Badge>
                </div>

                <div className="text-lg font-bold tracking-wider text-white group-hover:tracking-widest transition-all duration-200">
                  {retailer.name}
                </div>
                <div className="text-[11px] font-mono text-[#666] mt-0.5">
                  {retailer.domain}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footnote on Scraping & Integrity */}
        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#666] gap-2">
          <span>SSRF PROTECTED // ONLY HTTPS SERVER-SIDE FETCH</span>
          <span>NEVER PASSWORDS OR SCRAPED ACCOUNTS</span>
        </div>
      </Container>
    </section>
  );
}
