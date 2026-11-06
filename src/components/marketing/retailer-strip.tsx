"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
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

function RetailerCard({ retailer, index }: { retailer: RetailerItem; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 20 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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

  // Alternate entry direction (left/right stagger)
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: isEven ? -25 : 25, y: 20 },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.7, ease: TRANSITION_EASE } },
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 rounded-2xl border border-[#222222] bg-[#0e0e0e]/90 backdrop-blur-sm hover:border-neutral-400 transition-colors duration-300 overflow-hidden shadow-lg cursor-pointer"
    >
      {/* Subtle border sheen accent traveling on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Internal subtle spotlight follow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[10px] font-mono text-[#555] tracking-wider uppercase group-hover:text-[#888] transition-colors">
          {retailer.category}
        </span>
        <Badge variant={getBadgeVariant(retailer.status)}>
          {getStatusLabel(retailer.status)}
        </Badge>
      </div>

      <div className="text-xl font-bold tracking-wider text-white group-hover:tracking-widest transition-all duration-300 relative z-10 font-display">
        {retailer.name}
      </div>
      <div className="text-[11px] font-mono text-[#666] mt-0.5 group-hover:text-[#aaa] transition-colors relative z-10">
        {retailer.domain}
      </div>
    </motion.div>
  );
}

export function RetailerStrip() {
  const marqueeText =
    "// ACTIVE ADAPTERS: ZARA • H&M • COS • UNIQLO • ARKET • MANGO • SSENSE • ASOS // ANTI-SSRF GUARD // ZERO FABRICATED MEASUREMENTS // REVERSIBLE CM/INCH CALIBRATION // ";

  return (
    <section id="retailers" className="py-24 sm:py-28 bg-transparent relative overflow-hidden">
      {/* Visual Experimentation: Continuous Kinetic Telemetry Marquee */}
      <div className="w-full overflow-hidden border-y border-[#1c1c1c] bg-[#0a0a0a]/60 py-3 mb-16 select-none">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap text-xs font-mono tracking-widest text-[#666]"
        >
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </motion.div>
      </div>

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

        {/* Retailer Grid with Spatial Entrance & 3D Tilt */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 relative"
        >
          {RETAILERS.map((retailer, i) => (
            <RetailerCard key={retailer.name} retailer={retailer} index={i} />
          ))}
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
