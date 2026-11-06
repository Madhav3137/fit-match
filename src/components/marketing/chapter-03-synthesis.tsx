"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../layout/container";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MaskedHeading } from "../motion/masked-text";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

type FitPreference = "slim" | "regular" | "relaxed";

interface DimensionEase {
  name: string;
  bodyCm: number;
  garmentCm: number;
  easeCm: number;
  status: "optimal" | "snug" | "loose";
  deltaText: string;
}

export function Chapter03Synthesis() {
  const [preference, setPreference] = React.useState<FitPreference>("regular");

  const handleSelectPreference = (pref: FitPreference) => {
    setPreference(pref);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("fitmatch:fit_preference", {
          detail: { preference: pref },
        })
      );
    }
  };

  // Dynamic calculations based on fit preference
  const preferenceData = React.useMemo(() => {
    switch (preference) {
      case "slim":
        return {
          recommendedSize: "S",
          secondarySize: "M",
          confidenceScore: 94,
          verdict: "High Precision Fit — Tailored silhouette with minimal ease.",
          chestEase: 4.2,
          waistEase: 5.0,
          shoulderEase: 1.2,
          alternativeTradeoff: {
            larger: {
              size: "M",
              note: "Regular drape (+6.8cm chest ease). Choose if you wear over thicker knitwear.",
            },
            smaller: {
              size: "XS",
              note: "Restricted chest circumference (-3cm below comfort minimum).",
            },
          },
          explanation:
            "Your 98cm chest matches COS 46/S (102.2cm aperture), yielding 4.2cm of controlled ease with a clean vertical torso drop.",
        };
      case "relaxed":
        return {
          recommendedSize: "L",
          secondarySize: "M",
          confidenceScore: 96,
          verdict: "Contemporary Boxy Silhouette — Relaxed shoulder drop.",
          chestEase: 11.5,
          waistEase: 12.8,
          shoulderEase: 3.5,
          alternativeTradeoff: {
            larger: {
              size: "XL",
              note: "Oversized (+16.5cm chest ease). Sleeve extends 3.8cm past wrist crease.",
            },
            smaller: {
              size: "M",
              note: "Standard tailored fit. Loses the intended oversized architectural drape.",
            },
          },
          explanation:
            "Size L provides 11.5cm chest ease and a +3.5cm shoulder offset, creating an intentional relaxed silhouette with unrestricted arm articulation.",
        };
      case "regular":
      default:
        return {
          recommendedSize: "M",
          secondarySize: "L",
          confidenceScore: 98,
          verdict: "Harmonic Match — True-to-garment designer silhouette.",
          chestEase: 7.4,
          waistEase: 8.2,
          shoulderEase: 2.1,
          alternativeTradeoff: {
            larger: {
              size: "L",
              note: "Relaxed drape (+11.5cm ease). Casual silhouette with slightly lower collar stance.",
            },
            smaller: {
              size: "S",
              note: "Slim aesthetic (+4.2cm ease). Snug across the chest when seated or driving.",
            },
          },
          explanation:
            "Size M achieves 7.4cm chest ease and 2.1cm shoulder tolerance relative to your 98cm chest and 46cm shoulders, matching COS's designed proportions.",
        };
    }
  }, [preference]);

  const dimensions: DimensionEase[] = [
    {
      name: "Chest Circumference",
      bodyCm: 98,
      garmentCm: 98 + preferenceData.chestEase,
      easeCm: preferenceData.chestEase,
      status: "optimal",
      deltaText: `+${preferenceData.chestEase.toFixed(1)} cm ease`,
    },
    {
      name: "Waist Aperture",
      bodyCm: 84,
      garmentCm: 84 + preferenceData.waistEase,
      easeCm: preferenceData.waistEase,
      status: "optimal",
      deltaText: `+${preferenceData.waistEase.toFixed(1)} cm ease`,
    },
    {
      name: "Shoulder Breadth",
      bodyCm: 46,
      garmentCm: 46 + preferenceData.shoulderEase,
      easeCm: preferenceData.shoulderEase,
      status: "optimal",
      deltaText: `+${preferenceData.shoulderEase.toFixed(1)} cm ease`,
    },
  ];

  return (
    <section id="chapter-synthesis" className="py-20 sm:py-28 bg-transparent relative overflow-hidden border-t border-[#181818]">
      <div id="engine" className="absolute -top-24 opacity-0 pointer-events-none" />
      <Container>
        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                CHAPTER 03 // FIT SYNTHESIS & RESOLUTION
              </span>
            </div>
            <MaskedHeading
              as="h2"
              className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-white uppercase"
            >
              The Climax Recommendation
            </MaskedHeading>
          </div>
          <p className="text-xs sm:text-sm text-[#8a8a8a] max-w-md leading-relaxed font-normal">
            FITMATCH synthesizes your calibrated body coordinates with brand-specific grade rules
            and your personal drape preference to output an incontrovertible sizing verdict.
          </p>
        </div>

        {/* Synthesis Dashboard Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Interactive Drape Preference & Dimensional Ease Mapping */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#222222] bg-[#0c0c0c] shadow-2xl space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-white" />
                  <span className="text-xs font-mono uppercase text-white font-semibold tracking-wide">
                    Drape Preference Calibration
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-[#777]">
                  ADAPTIVE EASING
                </span>
              </div>

              {/* 3-State Segmented Control */}
              <div className="grid grid-cols-3 gap-2 p-1.5 mt-5 rounded-2xl bg-[#141414] border border-[#242424]">
                {(["slim", "regular", "relaxed"] as FitPreference[]).map((pref) => {
                  const isActive = preference === pref;
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => handleSelectPreference(pref)}
                      className={`relative py-3 rounded-xl text-xs font-mono uppercase transition-all duration-300 font-medium ${
                        isActive ? "text-black font-semibold" : "text-[#777] hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-preference-pill"
                          transition={{ duration: 0.3, ease: TRANSITION_EASE }}
                          className="absolute inset-0 bg-white rounded-xl shadow-lg"
                        />
                      )}
                      <span className="relative z-10 flex flex-col items-center gap-0.5">
                        <span className="font-bold">{pref}</span>
                        <span className="text-[9px] opacity-75">
                          {pref === "slim" ? "+4cm EASE" : pref === "regular" ? "+7cm EASE" : "+11cm EASE"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dimensional Convergence Range Bars */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#777]">
                  <span>Dimensional Ease Mapping</span>
                  <span>Target Bounds</span>
                </div>

                {dimensions.map((dim) => {
                  const barWidth = Math.min(Math.max((dim.easeCm / 15) * 100, 20), 92);
                  return (
                    <div key={dim.name} className="p-3.5 rounded-2xl border border-[#1c1c1c] bg-[#121212]/70 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-medium">{dim.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#777]">{dim.bodyCm}cm body</span>
                          <span className="text-white font-bold">{dim.deltaText}</span>
                        </div>
                      </div>

                      {/* Visual Ease Meter Bar */}
                      <div className="relative h-2 w-full rounded-full bg-[#1e1e1e] overflow-hidden">
                        <div className="absolute left-[30%] right-[30%] inset-y-0 bg-[#2d2d2d] rounded-full" />
                        <motion.div
                          initial={false}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.45, ease: TRANSITION_EASE }}
                          className="absolute left-0 inset-y-0 bg-gradient-to-r from-neutral-400 to-white rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#555]">
                        <span>Zero Ease</span>
                        <span className="text-[#888]">Target Zone</span>
                        <span>Loose Drape</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-Validation Guarantees */}
            <div className="pt-4 border-t border-[#1c1c1c] flex items-center justify-between text-xs font-mono text-[#777]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span className="text-[#aaa]">Statistical Fit Threshold</span>
              </div>
              <span className="text-white font-semibold font-mono">P &gt; 0.95 CONFIRMED</span>
            </div>
          </div>

          {/* Right Column: Monumental Recommendation Verdict Card */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-[#2a2a2a] bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#090909] shadow-2xl relative overflow-hidden space-y-6">
            {/* Topline Status */}
            <div className="flex items-center justify-between relative z-10 pb-4 border-b border-[#1c1c1c]">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white font-mono text-[10px]">
                  COS TAILORED OVERSHIRT
                </Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                <span className="font-bold tracking-wider">{preferenceData.confidenceScore}% CONFIDENCE</span>
              </div>
            </div>

            {/* Monumental Bodoni Size Typography */}
            <AnimatePresence mode="wait">
              <motion.div
                key={preference}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: TRANSITION_EASE }}
                className="py-2 text-center relative z-10"
              >
                <span className="text-[11px] font-mono tracking-technical text-[#777] uppercase block mb-1">
                  RECOMMENDED SIZE
                </span>
                <div className="font-display text-8xl sm:text-9xl font-semibold tracking-tighter text-white">
                  {preferenceData.recommendedSize}
                </div>
                <div className="text-xs font-mono text-[#999] tracking-wider uppercase mt-1">
                  EU 48 EQUIVALENT // TRUE TO GRADE
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Verdict & Concise Explanation */}
            <div className="space-y-2 relative z-10 p-4 rounded-2xl border border-[#222] bg-[#121212]/90">
              <div className="text-xs sm:text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{preferenceData.verdict}</span>
              </div>
              <p className="text-xs text-[#888] leading-relaxed font-normal">
                {preferenceData.explanation}
              </p>
            </div>

            {/* Adjacent Size Trade-Offs */}
            <div className="space-y-2 relative z-10">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#666]">
                Adjacent Sizing Trade-Offs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-[#202020] bg-[#141414] text-xs space-y-1">
                  <div className="flex items-center justify-between text-white font-mono font-medium">
                    <span>Size {preferenceData.alternativeTradeoff.larger.size}</span>
                    <span className="text-[10px] text-[#777]">Larger</span>
                  </div>
                  <p className="text-[11px] text-[#888] leading-tight">
                    {preferenceData.alternativeTradeoff.larger.note}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[#202020] bg-[#141414] text-xs space-y-1">
                  <div className="flex items-center justify-between text-white font-mono font-medium">
                    <span>Size {preferenceData.alternativeTradeoff.smaller.size}</span>
                    <span className="text-[10px] text-[#777]">Smaller</span>
                  </div>
                  <p className="text-[11px] text-[#888] leading-tight">
                    {preferenceData.alternativeTradeoff.smaller.note}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 relative z-10">
              <Link href="/analyze" className="w-full sm:w-auto flex-1">
                <Button size="sm" className="w-full flex items-center justify-center gap-2 text-xs font-mono py-2.5">
                  <span>Analyze Any Product Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/profile" className="w-full sm:w-auto">
                <Button variant="secondary" size="sm" className="w-full text-xs font-mono py-2.5">
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
