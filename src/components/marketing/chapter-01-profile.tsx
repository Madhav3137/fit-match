"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { BodyMesh3D } from "../ui/body-mesh-3d";
import { ArrowRight, Compass, Sliders, Shield } from "lucide-react";
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

          {/* Right Column: High-Presence 3D Mannequin Instrument */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0c0c0c] shadow-2xl relative overflow-hidden">
            {/* Top Calibrator Readout */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-[#1c1c1c] text-[10px] font-mono text-[#777]">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span className="uppercase text-white font-medium">3D SPATIAL RIG</span>
              </div>
              <span className="uppercase text-[#888]">DRAG 360° TURNTABLE</span>
            </div>

            {/* 3D Mannequin Rig */}
            <div className="relative my-auto py-2">
              <BodyMesh3D
                interactive={true}
                activeDimension={activeDim}
                onSelectDimension={(dim) => setActiveDim(dim)}
                currentValues={measurements}
                unit={unit}
                className="w-full min-h-[380px] sm:min-h-[420px]"
              />
            </div>

            {/* Bottom HUD Coordinate Tag */}
            <div className="w-full pt-4 border-t border-[#1c1c1c] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#666]">
                ACTIVE NODE: <span className="text-white uppercase font-bold">{activeDim}</span>
              </span>
              <span className="text-white font-semibold">
                {toDisplay(measurements[activeDim])} {unit} CALIBRATED
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
