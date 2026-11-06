"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MaskedHeading } from "../motion/masked-text";
import {
  Link2,
  Check,
  RefreshCw,
  ArrowRight,
  Scan,
  Database,
  Lock,
} from "lucide-react";

interface ProductPreset {
  brand: string;
  title: string;
  category: "tops" | "outerwear" | "bottoms";
  url: string;
  chartStatus: "auto_extracted" | "fallback_manual";
  sizes: { label: string; chestMin: number; chestMax: number; waistMin: number; waistMax: number }[];
}

const PRESETS: ProductPreset[] = [
  {
    brand: "ZARA",
    title: "Heavyweight Boxy Tee",
    category: "tops",
    url: "https://zara.com/us/en/heavyweight-boxy-tee-p01.html",
    chartStatus: "auto_extracted",
    sizes: [
      { label: "S", chestMin: 88, chestMax: 94, waistMin: 74, waistMax: 80 },
      { label: "M", chestMin: 95, chestMax: 101, waistMin: 81, waistMax: 87 },
      { label: "L", chestMin: 102, chestMax: 108, waistMin: 88, waistMax: 94 },
      { label: "XL", chestMin: 109, chestMax: 115, waistMin: 95, waistMax: 101 },
    ],
  },
  {
    brand: "COS",
    title: "Tailored Wool Overshirt",
    category: "outerwear",
    url: "https://cos.com/en_usd/tailored-wool-overshirt-p02.html",
    chartStatus: "auto_extracted",
    sizes: [
      { label: "46 (S)", chestMin: 90, chestMax: 94, waistMin: 78, waistMax: 82 },
      { label: "48 (M)", chestMin: 96, chestMax: 100, waistMin: 84, waistMax: 88 },
      { label: "50 (L)", chestMin: 102, chestMax: 106, waistMin: 90, waistMax: 94 },
      { label: "52 (XL)", chestMin: 108, chestMax: 112, waistMin: 96, waistMax: 100 },
    ],
  },
  {
    brand: "INDEPENDENT BOUTIQUE",
    title: "Raw Denim Work Jacket",
    category: "outerwear",
    url: "https://independent-store.com/work-jacket.html",
    chartStatus: "fallback_manual",
    sizes: [
      { label: "1 (S)", chestMin: 92, chestMax: 96, waistMin: 80, waistMax: 84 },
      { label: "2 (M)", chestMin: 98, chestMax: 102, waistMin: 86, waistMax: 90 },
      { label: "3 (L)", chestMin: 104, chestMax: 108, waistMin: 92, waistMax: 96 },
    ],
  },
];

export function Chapter02Scanner() {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(4);

  const currentProduct = PRESETS[selectedIdx];

  const handleTriggerScan = (idx: number) => {
    setSelectedIdx(idx);
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => setScanStep(2), 280);
    setTimeout(() => setScanStep(3), 560);
    setTimeout(() => {
      setScanStep(4);
      setIsScanning(false);
    }, 900);
  };

  return (
    <section id="chapter-scanner" className="py-20 sm:py-28 bg-transparent relative overflow-hidden border-t border-[#181818]">
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                CHAPTER 02 // REAL-TIME INGESTION
              </span>
            </div>
            <MaskedHeading
              as="h2"
              className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase"
            >
              Garment Link Ingestion Engine
            </MaskedHeading>
          </div>
          <p className="text-xs sm:text-sm text-[#8a8a8a] max-w-md leading-relaxed font-normal">
            Paste any garment URL. FITMATCH automatically resolves retailer DOM structures,
            extracts dimensional size charts, and isolates metric tolerance rules.
          </p>
        </div>

        {/* Preset Selector Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[11px] font-mono text-[#777] uppercase mr-2 flex items-center gap-1.5">
            <Scan className="w-3.5 h-3.5 text-white" />
            SAMPLE WORKLOADS:
          </span>
          {PRESETS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleTriggerScan(i)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
                selectedIdx === i
                  ? "border-white bg-white text-black font-bold shadow-md"
                  : "border-[#242424] bg-[#101010] text-[#888] hover:border-neutral-500 hover:text-white"
              }`}
            >
              {p.brand} — {p.title}
            </button>
          ))}
        </div>

        {/* Main Scanner Chamber */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Connected Pipeline Workflow */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0c0c0c] shadow-2xl space-y-6">
            {/* Target URL Input Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium uppercase tracking-wide">
                  Ingestion Endpoint
                </span>
                <span className="text-[#666] text-[10px]">SSR SAFE FETCH</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-neutral-700 bg-[#141414] font-mono text-xs text-white">
                <Link2 className="w-4 h-4 text-[#888] shrink-0" />
                <span className="truncate text-white font-medium">{currentProduct.url}</span>
                <span className="ml-auto flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white shrink-0 font-mono">
                  <Lock className="w-2.5 h-2.5" />
                  HTTPS
                </span>
              </div>
            </div>

            {/* Connected Step Pipeline */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-technical text-[#777] uppercase block">
                Sequential Verification Sequence
              </span>

              <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[1.5px] before:bg-[#202020]">
                {[
                  {
                    step: 1,
                    title: "Anti-SSRF Security Validation",
                    desc: "Blocks loopback, RFC1918 private subnets and internal addresses.",
                  },
                  {
                    step: 2,
                    title: `Adapter Detection: ${currentProduct.brand}`,
                    desc: currentProduct.chartStatus === "auto_extracted"
                      ? "Official retailer extraction schema active."
                      : "Direct parser unavailable; manual fallback active.",
                  },
                  {
                    step: 3,
                    title: "DOM & JSON-LD Size Chart Extraction",
                    desc: "Parsed HTML table coordinates and manufacturer grade specs.",
                  },
                  {
                    step: 4,
                    title: "Dimensional Normalization",
                    desc: "Normalized to verified physical chest and waist centimeters.",
                  },
                ].map((s) => {
                  const isDone = scanStep >= s.step;
                  const isCurrent = scanStep === s.step && isScanning;

                  return (
                    <motion.div
                      key={s.step}
                      initial={false}
                      animate={{ opacity: isDone ? 1 : 0.4 }}
                      className="relative flex items-start justify-between gap-3 font-mono text-xs"
                    >
                      {/* Step Circle Node on the vertical rail */}
                      <span
                        className={`absolute -left-[18.5px] top-1 h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isDone
                            ? "border-white bg-white text-black"
                            : "border-[#333] bg-[#0c0c0c] text-transparent"
                        }`}
                      >
                        {isDone && <Check className="w-2 h-2 stroke-[3]" />}
                      </span>

                      <div>
                        <div className="font-semibold text-white tracking-tight flex items-center gap-2">
                          <span>{s.title}</span>
                          {isCurrent && (
                            <RefreshCw className="w-3 h-3 text-white animate-spin" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#777] mt-0.5 leading-normal">
                          {s.desc}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#666]">
                STATUS: <span className="text-white font-bold">{currentProduct.chartStatus.toUpperCase()}</span>
              </span>
              <Link href="/analyze">
                <Button size="sm" variant="secondary" className="flex items-center gap-2 text-xs font-mono">
                  <span>Paste Custom URL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Laser Silhouette & Sizing Matrix */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0c0c0c] shadow-2xl relative overflow-hidden">
            {/* Header Readout */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-mono uppercase text-white font-semibold">
                  Extracted Dimensional Matrix
                </span>
              </div>
              <Badge variant={currentProduct.chartStatus === "auto_extracted" ? "active" : "outline"}>
                {currentProduct.chartStatus === "auto_extracted" ? "PARSED DIRECTLY" : "FALLBACK READY"}
              </Badge>
            </div>

            {/* Optical Laser Garment Silhouette */}
            <div className="relative py-6 flex items-center justify-center">
              {/* Silhouette SVG */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <svg
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full stroke-neutral-500 fill-white/[0.02]"
                >
                  {/* Overshirt / Jacket Outline */}
                  <path
                    d="M 60 30 Q 100 45 140 30 L 175 65 L 155 85 L 140 75 L 140 175 L 60 175 L 60 75 L 45 85 L 25 65 Z"
                    strokeWidth="1.5"
                  />
                  {/* Center Placket Line */}
                  <line x1="100" y1="40" x2="100" y2="175" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Caliper Measuring Lines */}
                  <line x1="60" y1="90" x2="140" y2="90" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="60" cy="90" r="2.5" fill="#ffffff" />
                  <circle cx="140" cy="90" r="2.5" fill="#ffffff" />
                </svg>

                {/* Animated Optical Laser Sweep Line */}
                <motion.div
                  animate={{ y: [0, 180, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />

                <div className="absolute top-[42%] -right-2 sm:-right-8 text-[9px] font-mono text-white bg-black/80 px-2 py-0.5 rounded border border-[#333]">
                  CHEST APERTURE
                </div>
              </div>
            </div>

            {/* Extracted Sizing Matrix Table */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono text-[#666] uppercase flex justify-between px-3">
                <span>SIZE LABEL</span>
                <span>CHEST RANGE</span>
                <span>WAIST RANGE</span>
              </div>
              <div className="space-y-1.5 font-mono text-xs">
                {currentProduct.sizes.map((sz, idx) => (
                  <div
                    key={sz.label}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      idx === 1
                        ? "border-neutral-400 bg-[#161616] text-white font-semibold"
                        : "border-[#1c1c1c] bg-[#101010]/80 text-[#888]"
                    }`}
                  >
                    <span className="text-white font-bold">{sz.label}</span>
                    <span>
                      {sz.chestMin} - {sz.chestMax} cm
                    </span>
                    <span>
                      {sz.waistMin} - {sz.waistMax} cm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Proof Note */}
            <div className="pt-4 mt-2 border-t border-[#1c1c1c] flex items-center justify-between text-[10px] font-mono text-[#666]">
              <span>GRADE TOLERANCE: ±1.2 CM</span>
              <span>NO FABRICATED LABELS</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
