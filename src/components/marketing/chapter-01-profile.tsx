"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { MaskedHeading } from "../motion/masked-text";
import { BodyMesh3D } from "../ui/body-mesh-3d";
import { ArrowRight, Compass, Sliders, Shield } from "lucide-react";
import { getStoredProfile } from "@/lib/storage/profile-storage";

type DimensionKey = "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | "outseam";

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
  { key: "inseam", label: "Inner Inseam", sublabel: "Crotch Seam to Bottom Hem (Inner)", min: 68, max: 96, defaultVal: 82 },
  { key: "outseam", label: "Outer Outseam", sublabel: "Waistband to Bottom Hem (Outer)", min: 92, max: 124, defaultVal: 106 },
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
    outseam: 106,
  });

  // Load real saved user profile if present
  React.useEffect(() => {
    const stored = getStoredProfile();
    if (stored) {
      setMeasurements({
        height: stored.heightCm || 178,
        shoulder: stored.shoulderCm || 46,
        chest: stored.chestCm || 98,
        waist: stored.waistCm || 84,
        hip: stored.hipCm || 102,
        inseam: stored.inseamCm || 82,
        outseam: stored.outseamCm || (stored.inseamCm ? stored.inseamCm + 24 : 106),
      });
      if (stored.unit) setUnit(stored.unit);
    }
  }, []);

  const updateVal = (key: DimensionKey, val: number) => {
    setMeasurements((prev) => {
      const next = { ...prev, [key]: val };
      // If user adjusts inseam and outseam hasn't been manually detached, keep them anatomically aligned
      if (key === "inseam" && prev.outseam === prev.inseam + 24) {
        next.outseam = val + 24;
      }
      return next;
    });
  };

  const toDisplay = (cmVal: number) => {
    if (unit === "in") {
      return (cmVal / 2.54).toFixed(1);
    }
    return cmVal.toString();
  };

  return (
    <section id="chapter-profile" className="py-20 sm:py-28 bg-transparent relative overflow-hidden border-t border-neutral-800/80">
      <div id="how-it-works" className="absolute -top-24 opacity-0 pointer-events-none" />
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-neutral-400 uppercase">
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
          <p className="text-sm sm:text-base text-neutral-300 max-w-md leading-relaxed font-normal">
            Calibrate seven anatomical coordinates once. FITMATCH normalizes physical ease across all
            tailored and casual silhouettes with zero gender assumptions.
          </p>
        </div>

        {/* Two-Column Composition: Luxury Calibrator & Genuine 3D Mannequin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Premium Hardware-Style Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-[#0c0c0e] shadow-2xl relative overflow-hidden">
            {/* Top Bar with Unit Toggle */}
            <div className="flex items-center justify-between pb-5 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-white" />
                <span className="text-xs font-mono uppercase text-white font-semibold tracking-wide">
                  Calibrated Coordinates
                </span>
              </div>

              {/* Segmented Unit Pill */}
              <div className="flex items-center gap-1 p-1 rounded-xl border border-neutral-800 bg-[#141416]">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-3 py-1 text-[10px] font-mono uppercase rounded-lg transition-all ${
                    unit === "cm"
                      ? "bg-white text-black font-bold shadow"
                      : "text-neutral-400 hover:text-white"
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
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Imperial (IN)
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-3.5 py-6">
              {DIMENSIONS.map((dim) => {
                const isActive = activeDim === dim.key;
                const currentVal = measurements[dim.key];

                return (
                  <div
                    key={dim.key}
                    onMouseEnter={() => setActiveDim(dim.key)}
                    onClick={() => setActiveDim(dim.key)}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-neutral-400 bg-[#161618] shadow-lg ring-1 ring-white/10"
                        : "border-neutral-800/80 bg-[#101012]/60 hover:border-neutral-700 hover:bg-[#121214]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="text-[11px] font-mono font-medium text-white tracking-tight flex items-center gap-2">
                          <span>{dim.label}</span>
                          {dim.key === "inseam" && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                              INNER SEAM
                            </span>
                          )}
                          {dim.key === "outseam" && (
                            <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800/60 text-amber-300">
                              OUTER SEAM
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-neutral-400">
                          {dim.sublabel}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-white">
                          {toDisplay(currentVal)}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 ml-1">
                          {unit}
                        </span>
                      </div>
                    </div>

                    {/* Custom Styled Slider */}
                    <div className="pt-1.5">
                      <input
                        type="range"
                        min={dim.min}
                        max={dim.max}
                        value={currentVal}
                        onChange={(e) => updateVal(dim.key, Number(e.target.value))}
                        className="w-full accent-white bg-neutral-800 cursor-pointer h-1 rounded-lg"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-neutral-500 mt-1">
                        <span>{toDisplay(dim.min)}</span>
                        <span>{toDisplay(dim.max)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
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
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-800 bg-[#0c0c0e] shadow-2xl relative overflow-hidden">
            {/* Top Calibrator Readout */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-800/80 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-white" />
                <span className="uppercase text-white font-medium">3D SPATIAL RIG</span>
              </div>
              <span className="uppercase text-neutral-300">DRAG 360° TURNTABLE</span>
            </div>

            {/* 3D Mannequin Rig */}
            <div className="relative my-auto py-2">
              <BodyMesh3D
                interactive={true}
                activeDimension={activeDim}
                onSelectDimension={(dim) => setActiveDim(dim)}
                currentValues={measurements}
                unit={unit}
                className="w-full min-h-[480px] sm:min-h-[540px]"
              />
            </div>

            {/* Bottom HUD Coordinate Tag */}
            <div className="w-full pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className="text-neutral-400">
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
