"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { ArrowRight, Compass, Sliders, Shield, RotateCcw } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

type DimensionKey = "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam";

interface DimensionConfig {
  key: DimensionKey;
  label: string;
  sublabel: string;
  min: number;
  max: number;
  defaultVal: number;
}

const DIMENSIONS: DimensionConfig[] = [
  { key: "height", label: "Full Stature", sublabel: "Vertex to Floor", min: 145, max: 210, defaultVal: 178 },
  { key: "shoulder", label: "Shoulder Breadth", sublabel: "Biacromial Span", min: 36, max: 58, defaultVal: 46 },
  { key: "chest", label: "Chest Circumference", sublabel: "Fullest Bust Line", min: 78, max: 130, defaultVal: 98 },
  { key: "waist", label: "Natural Waist", sublabel: "Narrowest Torso Point", min: 62, max: 120, defaultVal: 84 },
  { key: "hip", label: "Hip & Seat", sublabel: "Fullest Pelvic Width", min: 82, max: 135, defaultVal: 102 },
  { key: "inseam", label: "Inner Inseam", sublabel: "Crotch to Ankle Bone", min: 68, max: 96, defaultVal: 82 },
];

export function Chapter01Profile() {
  const [unit, setUnit] = React.useState<"cm" | "in">("cm");
  const [activeDim, setActiveDim] = React.useState<DimensionKey>("chest");

  // Normalized measurements in CM
  const [measurements, setMeasurements] = React.useState<Record<DimensionKey, number>>({
    height: 178,
    shoulder: 46,
    chest: 98,
    waist: 84,
    hip: 102,
    inseam: 82,
  });

  React.useEffect(() => {
    const handleSelectDim = (e: Event) => {
      const customEvent = e as CustomEvent<{ dimension: DimensionKey }>;
      if (customEvent.detail?.dimension) {
        setActiveDim(customEvent.detail.dimension);
      }
    };
    window.addEventListener("fitmatch:select_dimension", handleSelectDim);
    return () => window.removeEventListener("fitmatch:select_dimension", handleSelectDim);
  }, []);

  const updateVal = (key: DimensionKey, val: number) => {
    setMeasurements((prev) => ({ ...prev, [key]: val }));
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("fitmatch:dimension_change", {
          detail: { dimension: key, value: val },
        })
      );
    }
  };

  const toDisplay = (cmVal: number) => {
    if (unit === "in") {
      return (cmVal / 2.54).toFixed(1);
    }
    return cmVal.toString();
  };

  return (
    <section id="chapter-profile" className="py-20 sm:py-28 bg-transparent relative overflow-hidden border-t border-[#181818]">
      <div id="how-it-works" className="absolute -top-24 opacity-0 pointer-events-none" />
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                CHAPTER 01 // UNIVERSAL BODY PROFILE
              </span>
            </div>
            <MaskedHeading
              as="h2"
              className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase"
            >
              The Measurement Laboratory
            </MaskedHeading>
          </div>
          <p className="text-xs sm:text-sm text-[#8a8a8a] max-w-md leading-relaxed font-normal">
            Calibrate six anatomical coordinates once. FITMATCH normalizes physical ease across all
            tailored and casual silhouettes with zero gender assumptions.
          </p>
        </div>

        {/* Two-Column Composition: Luxury Calibrator & Genuine 3D Mannequin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Premium Hardware-Style Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0c0c0c] shadow-2xl relative overflow-hidden">
            {/* Top Bar with Unit Toggle */}
            <div className="flex items-center justify-between pb-5 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-mono uppercase text-white font-semibold tracking-wide">
                  Calibrated Coordinates
                </span>
              </div>

              {/* Segmented Unit Pill */}
              <div className="flex items-center gap-1 p-1 rounded-xl border border-[#242424] bg-[#141414]">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1 text-[10px] font-mono uppercase rounded-lg transition-all ${
                    unit === "cm"
                      ? "bg-white text-black font-bold shadow"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  Metric (CM)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-3 py-1 text-[10px] font-mono uppercase rounded-lg transition-all ${
                    unit === "in"
                      ? "bg-white text-black font-bold shadow"
                      : "text-[#777] hover:text-white"
                  }`}
                >
                  Imperial (IN)
                </button>
              </div>
            </div>

            {/* 6 Anatomical Calibrators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-6">
              {DIMENSIONS.map((dim) => {
                const isActive = activeDim === dim.key;
                const currentVal = measurements[dim.key];

                return (
                  <div
                    key={dim.key}
                    onMouseEnter={() => setActiveDim(dim.key)}
                    onClick={() => setActiveDim(dim.key)}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-neutral-400 bg-[#161616] shadow-lg"
                        : "border-[#1c1c1c] bg-[#101010]/60 hover:border-[#2a2a2a] hover:bg-[#121212]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="text-[11px] font-mono font-medium text-white tracking-tight">
                          {dim.label}
                        </div>
                        <div className="text-[9px] font-mono text-[#666]">
                          {dim.sublabel}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-white">
                          {toDisplay(currentVal)}
                        </span>
                        <span className="text-[10px] font-mono text-[#777] ml-1">
                          {unit}
                        </span>
                      </div>
                    </div>

                    {/* Custom Styled Slider */}
                    <div className="pt-2">
                      <input
                        type="range"
                        min={dim.min}
                        max={dim.max}
                        value={currentVal}
                        onChange={(e) => updateVal(dim.key, Number(e.target.value))}
                        className="w-full accent-white bg-neutral-800 cursor-pointer h-1 rounded-lg"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-[#555] mt-1">
                        <span>{toDisplay(dim.min)}</span>
                        <span>{toDisplay(dim.max)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-[#1c1c1c] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                <Shield className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>STORED LOCALLY // ZERO SERVER LOGGING</span>
              </div>
              <Link href="/profile" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto flex items-center justify-center gap-2 px-5">
                  <span>Save Universal Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Architectural 3D Observation Aperture */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c0d12]/30 backdrop-blur-[2px] shadow-2xl relative overflow-hidden min-h-[460px]">
            {/* Top Calibrator Readout */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-mono text-[#888]">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span className="uppercase text-white font-medium">MEASUREMENT RIG // VIEWPORT</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("fitmatch:reset_view"));
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET VIEW</span>
              </button>
            </div>

            {/* Central Spatial Aperture Frame */}
            <div className="relative my-auto py-8 flex flex-col items-center justify-center pointer-events-none">
              {/* Corner aperture crosshairs */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/40" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/40" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/40" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/40" />

              {/* Active Datum Badge */}
              <div className="px-5 py-3 rounded-2xl bg-[#0c0d12]/90 border border-white/20 text-center space-y-1 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#888] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE COORDINATE // {activeDim}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                  {toDisplay(measurements[activeDim])} {unit.toUpperCase()}
                </div>
                <div className="text-[10px] font-mono text-[#777]">
                  LASER SCANNING TOLERANCE: ±0.8MM
                </div>
              </div>
            </div>

            {/* Bottom HUD Coordinate Tag with Quick Selection Chips */}
            <div className="w-full pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                {(["shoulder", "chest", "waist", "hip", "inseam"] as DimensionKey[]).map((dim) => (
                  <button
                    key={dim}
                    type="button"
                    onClick={() => {
                      setActiveDim(dim);
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("fitmatch:select_dimension", { detail: { dimension: dim } }));
                      }
                    }}
                    className={`px-2.5 py-1 rounded transition-colors uppercase font-medium ${
                      activeDim === dim
                        ? "bg-white text-black font-bold"
                        : "bg-white/5 text-[#888] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
              <span className="text-emerald-400 font-semibold uppercase">
                CALIBRATED
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
