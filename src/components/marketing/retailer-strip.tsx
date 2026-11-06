"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { TRANSITION_EASE } from "@/lib/motion/variants";
import { MaskedHeading } from "../motion/masked-text";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

interface RetailerItem {
  name: string;
  domain: string;
  status: "beta" | "manual" | "planned";
  category: string;
  notes: string;
}

const RETAILERS: RetailerItem[] = [
  {
    name: "ZARA",
    domain: "zara.com",
    status: "beta",
    category: "High Street",
    notes: "Direct size table DOM adapter",
  },
  {
    name: "H&M",
    domain: "hm.com",
    status: "beta",
    category: "Apparel",
    notes: "Automated table & JSON extraction",
  },
  {
    name: "COS",
    domain: "cos.com",
    status: "manual",
    category: "Contemporary",
    notes: "Curated grade rules & manual entry",
  },
  {
    name: "UNIQLO",
    domain: "uniqlo.com",
    status: "manual",
    category: "Essentials",
    notes: "Garment spec chart fallback",
  },
  {
    name: "ARKET",
    domain: "arket.com",
    status: "manual",
    category: "Nordic",
    notes: "Verified centimeter matrix",
  },
  {
    name: "MANGO",
    domain: "mango.com",
    status: "manual",
    category: "Tailored",
    notes: "Manual dimensional calibration",
  },
  {
    name: "SSENSE",
    domain: "ssense.com",
    status: "planned",
    category: "Luxury",
    notes: "Adapter under engineering development",
  },
  {
    name: "ASOS",
    domain: "asos.com",
    status: "planned",
    category: "Multi-Brand",
    notes: "Catalog schema indexing in progress",
  },
];

function RetailerCard({ retailer, index }: { retailer: RetailerItem; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isPlanned = retailer.status === "planned";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.05, ease: TRANSITION_EASE } },
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isPlanned
          ? "border-[#1c1c1c] bg-[#0a0a0a]/60 opacity-60 hover:opacity-90"
          : "border-[#222222] bg-[#0d0d0d] hover:border-neutral-400 shadow-lg"
      }`}
    >
      {/* Subtle top border traveling sheen */}
      {!isPlanned && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Internal subtle spotlight follow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Card Header: Category & Badge */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[10px] font-mono text-[#666] tracking-wider uppercase group-hover:text-[#999] transition-colors">
          {retailer.category}
        </span>
        <Badge
          variant={
            retailer.status === "beta"
              ? "beta"
              : retailer.status === "manual"
              ? "outline"
              : "subtle"
          }
        >
          {retailer.status === "beta"
            ? "BETA ADAPTER"
            : retailer.status === "manual"
            ? "MANUAL FALLBACK"
            : "ROADMAP // PLANNED"}
        </Badge>
      </div>

      {/* Brand Name & Domain */}
      <div className="relative z-10 space-y-1 my-3">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display flex items-center justify-between">
          <span>{retailer.name}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#555] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="text-[11px] font-mono text-[#666] group-hover:text-[#aaa] transition-colors">
          {retailer.domain}
        </div>
      </div>

      {/* Integration Note */}
      <div className="pt-3 border-t border-[#1a1a1a] text-[10px] font-mono text-[#555] group-hover:text-[#888] transition-colors relative z-10">
        {retailer.notes}
      </div>
    </motion.div>
  );
}

export function RetailerStrip() {
  const marqueeText =
    "// PROTOCOLS: HIGH-STREET • CONTEMPORARY • NORDIC DESIGN • LUXURY SILHOUETTES // SSRF SAFE PROTOCOL // DETERMINISTIC CM/IN CALIBRATION // ZERO FABRICATED SIZING DATA // ";

  return (
    <section id="retailers" className="py-20 sm:py-28 bg-transparent relative overflow-hidden border-t border-[#181818]">
      {/* Continuous Kinetic Telemetry Marquee */}
      <div className="w-full overflow-hidden border-y border-[#1c1c1c] bg-[#0a0a0a]/60 py-3 mb-16 select-none">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap text-xs font-mono tracking-widest text-[#666]"
        >
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </motion.div>
      </div>

      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                ECOSYSTEM & COMPATIBILITY
              </span>
            </div>
            <MaskedHeading as="h2" className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase">
              Supported Retailers & Brands
            </MaskedHeading>
          </div>
          <p className="text-xs sm:text-sm text-[#8a8a8a] max-w-md leading-relaxed font-normal">
            Transparent integration tiers. Automated extraction is explicitly labeled by live adapter status;
            other brands seamlessly support direct published chart entry.
          </p>
        </div>

        {/* Retailer Grid with Spatial 3D Tilt */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative"
        >
          {RETAILERS.map((retailer, i) => (
            <RetailerCard key={retailer.name} retailer={retailer} index={i} />
          ))}
        </motion.div>

        {/* Security & Integrity Footnote */}
        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#666] gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>SSRF PROTECTED // ONLY HTTPS SERVER-SIDE FETCH</span>
          </div>
          <span>NEVER PASSWORDS OR SCRAPED ACCOUNTS</span>
        </div>
      </Container>
    </section>
  );
}
