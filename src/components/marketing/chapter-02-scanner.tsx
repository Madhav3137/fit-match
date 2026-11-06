"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MaskedHeading } from "../motion/masked-text";
import { Link2, ShieldCheck, Check, Sparkles, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface ProductPreset {
  brand: string;
  title: string;
  category: string;
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

    setTimeout(() => setScanStep(2), 350);
    setTimeout(() => setScanStep(3), 700);
    setTimeout(() => {
      setScanStep(4);
      setIsScanning(false);
    }, 1100);
  };

  return (
    <section id="chapter-scanner" className="py-24 sm:py-32 bg-transparent relative overflow-hidden border-t border-[#181818]">
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                CHAPTER 02 // GARMENT / PRODUCT SCANNER
              </span>
            </div>
            <MaskedHeading
              as="h2"
              className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase"
            >
              Optical Link Ingestion & Ingestion Engine
            </MaskedHeading>
          </div>
          <p className="text-xs sm:text-sm text-[#8a8a8a] max-w-md leading-relaxed font-normal">
            Paste any clothing link. FITMATCH extracts live size specifications, verifies security,
            and parses category-aware dimensions with zero third-party tracking cookies.
          </p>
        </div>

        {/* Preset Selector Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[11px] font-mono text-[#666] uppercase mr-2">SAMPLE WORKLOADS:</span>
          {PRESETS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleTriggerScan(i)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
                selectedIdx === i
                  ? "border-white bg-white text-black font-bold shadow-md"
                  : "border-[#222] bg-[#101010] text-[#888] hover:border-neutral-500 hover:text-white"
              }`}
            >
              {p.brand} — {p.title}
            </button>
          ))}
        </div>

        {/* Main Scanner Chamber */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive URL Submission & Ingestion Pipeline */}
          <div className="lg:col-span-6 space-y-6 p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0d0d0d] shadow-2xl">
            {/* Simulated Live URL Input Box */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#999] uppercase block">
                Target Garment URL
              </span>
              <div className="flex items-center gap-2 p-3 rounded-xl border border-neutral-700 bg-[#141414] font-mono text-xs text-white">
                <Link2 className="w-4 h-4 text-[#888] shrink-0" />
                <span className="truncate">{currentProduct.url}</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                  HTTPS
                </span>
              </div>
            </div>

            {/* 4 Extraction Pipeline Stages */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono tracking-technical text-[#777] uppercase block">
                Extraction Pipeline Sequence
              </span>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { step: 1, title: "Anti-SSRF IP Validation", desc: "Private subnets & local addresses blocked." },
                  { step: 2, title: `Adapter Identification: ${currentProduct.brand}`, desc: "Direct schema mapping active." },
                  { step: 3, title: "DOM & JSON-LD Size Chart Parsing", desc: "Found structured dimensional tables." },
                  { step: 4, title: "Metric Normalization", desc: "Normalized to verified chest/waist centimeters." },
                ].map((s) => {
                  const isDone = scanStep >= s.step;
                  return (
                    <div
                      key={s.step}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        isDone ? "border-[#2a2a2a] bg-[#121212] text-white" : "border-[#181818] bg-transparent text-[#555]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${isDone ? "bg-white" : "bg-[#333]"}`} />
                        <div>
                          <span className="font-semibold block">{s.title}</span>
                          <span className="text-[10px] text-[#777] block">{s.desc}</span>
                        </div>
                      </div>
                      {isDone && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ingestion Action */}
            <div className="pt-2 flex items-center justify-between">
              <Link href="/analyze">
                <Button size="md" className="flex items-center gap-2">
                  <span>Analyze Custom URL</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleTriggerScan(selectedIdx)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888] hover:text-white transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? "animate-spin" : ""}`} />
                <span>Re-run Ingestion</span>
              </button>
            </div>
          </div>

          {/* Right Column: Garment Silhouette & Extracted Size Specifications */}
          <div className="lg:col-span-6 space-y-6 p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0d0d0d] shadow-2xl relative overflow-hidden">
            {/* Header with Verified Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
              <div>
                <span className="text-[10px] font-mono text-[#666] uppercase block">
                  {currentProduct.brand}
                </span>
                <h4 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {currentProduct.title}
                </h4>
              </div>

              <Badge variant={currentProduct.chartStatus === "auto_extracted" ? "active" : "beta"}>
                {currentProduct.chartStatus === "auto_extracted" ? "AUTO-EXTRACTED" : "MANUAL FALLBACK"}
              </Badge>
            </div>

            {/* Garment Silhouette with Optical Laser Scanning Bar */}
            <div className="relative h-44 rounded-2xl border border-[#1e1e1e] bg-[#080808] flex items-center justify-center overflow-hidden">
              {/* Garment Vector Graphic */}
              <svg viewBox="0 0 200 160" fill="none" className="h-36 w-auto stroke-[#444] stroke-[1.5]">
                {/* Architectural overshirt/tee outline */}
                <path d="M 75 25 Q 100 35 125 25 L 175 50 L 155 85 L 140 75 L 140 145 L 60 145 L 60 75 L 45 85 L 25 50 Z" />
                <line x1="100" y1="33" x2="100" y2="145" strokeDasharray="3 3" stroke="#333" strokeWidth="1" />
                <line x1="60" y1="75" x2="140" y2="75" strokeDasharray="2 3" stroke="#555" strokeWidth="0.8" />
              </svg>

              {/* Optical Laser Scanner Beam */}
              <motion.div
                animate={{ y: [-70, 70, -70] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
              />

              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-[#555]">
                SPECTRAL CALIBRATION: {currentProduct.category.toUpperCase()}
              </div>
            </div>

            {/* Extracted Size Specification Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-technical text-[#777] uppercase block">
                Extracted Garment Sizing Matrix (CM)
              </span>

              <div className="divide-y divide-[#1c1c1c] rounded-xl border border-[#1e1e1e] bg-[#121212] overflow-hidden">
                {currentProduct.sizes.map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-2.5 text-xs font-mono">
                    <span className="text-white font-bold px-2 py-0.5 rounded bg-white/10">
                      SIZE {s.label}
                    </span>
                    <div className="flex items-center gap-6 text-[#999]">
                      <span>CHEST: {s.chestMin}–{s.chestMax} cm</span>
                      <span>WAIST: {s.waistMin}–{s.waistMax} cm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
