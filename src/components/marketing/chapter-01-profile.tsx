"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { BodyMesh3D } from "../ui/body-mesh-3d";
import { ArrowRight, Check } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function Chapter01Profile() {
  const [unit, setUnit] = React.useState<"cm" | "in">("cm");
  const [activeDim, setActiveDim] = React.useState<"height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | null>("chest");

  // Normalized measurements in CM
  const [measurements, setMeasurements] = React.useState({
    height: 178,
    shoulder: 46,
    chest: 98,
    waist: 84,
    hip: 102,
    inseam: 82,
  });

  const updateVal = (key: keyof typeof measurements, val: number) => {
    setMeasurements((prev) => ({ ...prev, [key]: val }));
  };

  const toDisplay = (cmVal: number) => {
    if (unit === "in") {
      return (cmVal / 2.54).toFixed(1);
    }
    return cmVal.toString();
  };

  return (
    <section id="chapter-profile" className="py-24 sm:py-32 bg-transparent relative overflow-hidden border-t border-[#181818]">
      <div id="how-it-works" className="absolute -top-24 opacity-0 pointer-events-none" />
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
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

        {/* Two-Column Composition: Controls & Interactive 3D Mannequin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Premium Hardware-Style Controls */}
          <div className="lg:col-span-6 space-y-6 p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0d0d0d] shadow-2xl">
            {/* Header Bar with Unit Toggle */}
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
              <span className="text-xs font-mono uppercase text-white font-semibold">
                Anatomical Dimensions
              </span>
              <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[#262626] bg-[#141414]">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-colors ${
                    unit === "cm" ? "bg-white text-black font-bold" : "text-[#777] hover:text-white"
                  }`}
                >
                  Metric (CM)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase rounded transition-colors ${
                    unit === "in" ? "bg-white text-black font-bold" : "text-[#777] hover:text-white"
                  }`}
                >
                  Imperial (IN)
                </button>
              </div>
            </div>

            {/* Dimensional Sliders */}
            <div className="space-y-4">
              {/* Chest */}
              <div
                onMouseEnter={() => setActiveDim("chest")}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeDim === "chest" ? "border-neutral-500 bg-[#141414]" : "border-[#1e1e1e] bg-transparent"
                }`}
              >
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#999]">CHEST / BUST CIRCUMFERENCE</span>
                  <span className="text-white font-bold">{toDisplay(measurements.chest)} {unit}</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="125"
                  value={measurements.chest}
                  onChange={(e) => updateVal("chest", Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

              {/* Waist */}
              <div
                onMouseEnter={() => setActiveDim("waist")}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeDim === "waist" ? "border-neutral-500 bg-[#141414]" : "border-[#1e1e1e] bg-transparent"
                }`}
              >
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#999]">NATURAL WAIST</span>
                  <span className="text-white font-bold">{toDisplay(measurements.waist)} {unit}</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="115"
                  value={measurements.waist}
                  onChange={(e) => updateVal("waist", Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

              {/* Shoulders */}
              <div
                onMouseEnter={() => setActiveDim("shoulder")}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeDim === "shoulder" ? "border-neutral-500 bg-[#141414]" : "border-[#1e1e1e] bg-transparent"
                }`}
              >
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#999]">BIACROMIAL SHOULDERS</span>
                  <span className="text-white font-bold">{toDisplay(measurements.shoulder)} {unit}</span>
                </div>
                <input
                  type="range"
                  min="38"
                  max="56"
                  value={measurements.shoulder}
                  onChange={(e) => updateVal("shoulder", Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

              {/* Hips */}
              <div
                onMouseEnter={() => setActiveDim("hip")}
                className={`p-3.5 rounded-xl border transition-all duration-200 ${
                  activeDim === "hip" ? "border-neutral-500 bg-[#141414]" : "border-[#1e1e1e] bg-transparent"
                }`}
              >
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#999]">HIP SEAT WIDTH</span>
                  <span className="text-white font-bold">{toDisplay(measurements.hip)} {unit}</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="130"
                  value={measurements.hip}
                  onChange={(e) => updateVal("hip", Number(e.target.value))}
                  className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between gap-4">
              <span className="text-[11px] font-mono text-[#666]">
                PROFILE READY // LOCAL STORAGE COMPATIBLE
              </span>
              <Link href="/profile">
                <Button size="sm" className="flex items-center gap-2">
                  <span>Save Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Mannequin Visualization */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0a0a0a] shadow-2xl">
            <div className="w-full flex items-center justify-between pb-4 mb-2 border-b border-[#1a1a1a] text-[10px] font-mono text-[#666]">
              <span>3D SENSING INSTRUMENT</span>
              <span className="text-white">AZIMUTH: 360° INTERACTIVE</span>
            </div>

            <BodyMesh3D
              interactive={true}
              activeDimension={activeDim}
              onSelectDimension={(dim) => setActiveDim(dim)}
              currentValues={measurements}
              unit={unit}
              className="w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
