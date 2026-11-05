"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "../layout/container";
import { Badge } from "../ui/badge";
import { Check, Info } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

export function ProductPreviewDemo() {
  // Interactive sample state
  const [chestInput, setChestInput] = React.useState<number>(98);
  const [waistInput, setWaistInput] = React.useState<number>(82);
  const [preference, setPreference] = React.useState<"slim" | "regular" | "relaxed">("regular");

  // Real size chart for reference demonstration: Heavyweight Minimal Tee
  // S: Chest [88-94], Waist [74-80]
  // M: Chest [95-101], Waist [81-87]
  // L: Chest [102-108], Waist [88-94]
  const calculation = React.useMemo(() => {
    // Penalty calculation for each size
    const sizes = [
      { label: "S", chestMin: 88, chestMax: 94, waistMin: 74, waistMax: 80 },
      { label: "M", chestMin: 95, chestMax: 101, waistMin: 81, waistMax: 87 },
      { label: "L", chestMin: 102, chestMax: 108, waistMin: 88, waistMax: 94 },
    ];

    const scored = sizes.map((s) => {
      let chestPenalty = 0;
      if (chestInput < s.chestMin) chestPenalty = (s.chestMin - chestInput) / 6.0;
      else if (chestInput > s.chestMax) chestPenalty = (chestInput - s.chestMax) / 6.0;

      let waistPenalty = 0;
      if (waistInput < s.waistMin) waistPenalty = (s.waistMin - waistInput) / 5.0;
      else if (waistInput > s.waistMax) waistPenalty = (waistInput - s.waistMax) / 5.0;

      // Top weighting: Chest 0.65, Waist 0.35
      let totalPenalty = chestPenalty * 0.65 + waistPenalty * 0.35;

      // Preference bias
      if (preference === "slim" && s.label === "S") totalPenalty -= 0.15;
      if (preference === "relaxed" && s.label === "L") totalPenalty -= 0.15;

      return {
        ...s,
        totalPenalty: Math.max(0, totalPenalty),
      };
    });

    scored.sort((a, b) => a.totalPenalty - b.totalPenalty);
    const best = scored[0];
    const runnerUp = scored[1];

    let confidence: "high" | "medium" | "low" = "high";
    if (best.totalPenalty > 0.5) confidence = "low";
    else if (best.totalPenalty > 0.1 || runnerUp.totalPenalty - best.totalPenalty < 0.2)
      confidence = "medium";

    let reasons = [
      `Size ${best.label} aligns with your ${chestInput}cm chest (range: ${best.chestMin}-${best.chestMax}cm).`,
      `Waist fit provides comfortable ease for your ${waistInput}cm circumference.`,
    ];

    let tradeoff = `Size ${runnerUp.label} offers alternative fit (${runnerUp.totalPenalty > best.totalPenalty ? "more room" : "closer silhouette"}).`;

    return {
      recommendedSize: best.label,
      confidence,
      reasons,
      tradeoff,
      activeBounds: best,
    };
  }, [chestInput, waistInput, preference]);

  return (
    <section id="demo" className="py-24 bg-[#0a0a0a] border-y border-[#202020]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase mb-1">
              // INTERACTIVE SIZING TERMINAL
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase">
              Live Mathematical Calibration
            </h2>
          </div>
          <p className="text-xs text-[#888] font-mono max-w-md">
            Test the range-penalty scoring engine below. As you adjust your measurements, observe
            the deterministic recalculation of size and trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-[#262626] bg-[#101010] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
              <span className="text-xs font-mono uppercase text-white font-semibold">
                Simulated User Profile
              </span>
              <span className="text-[10px] font-mono text-[#666]">UNITS: CM</span>
            </div>

            {/* Chest Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#999]">CHEST CIRCUMFERENCE</span>
                <span className="text-white font-bold">{chestInput} cm</span>
              </div>
              <input
                type="range"
                min="84"
                max="112"
                value={chestInput}
                onChange={(e) => setChestInput(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#555]">
                <span>84 cm</span>
                <span>98 cm (Avg)</span>
                <span>112 cm</span>
              </div>
            </div>

            {/* Waist Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#999]">WAIST CIRCUMFERENCE</span>
                <span className="text-white font-bold">{waistInput} cm</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={waistInput}
                onChange={(e) => setWaistInput(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 cursor-pointer h-1.5 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#555]">
                <span>70 cm</span>
                <span>85 cm (Avg)</span>
                <span>100 cm</span>
              </div>
            </div>

            {/* Fit Preference */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono text-[#999] block">FIT PREFERENCE</span>
              <div className="grid grid-cols-3 gap-2">
                {(["slim", "regular", "relaxed"] as const).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setPreference(pref)}
                    className={`py-2 text-[11px] font-mono uppercase rounded-lg border transition-all ${
                      preference === pref
                        ? "bg-white text-black border-white font-bold"
                        : "border-[#303030] text-[#888] hover:border-[#666] hover:text-white"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e1e1e] flex items-center gap-2 text-[10px] font-mono text-[#666]">
              <Info className="w-3.5 h-3.5 text-[#888]" />
              <span>GARMENT: RAW OVERSIZED ORGANIC TEE // BODY-RANGE SPEC</span>
            </div>
          </div>

          {/* Result Output Column */}
          <div className="lg:col-span-7 p-8 rounded-2xl border border-[#303030] bg-[#121212] space-y-6 relative overflow-hidden">
            {/* Technical Sub-bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
                  ACTIVE RECOMMENDATION RESULT
                </span>
              </div>
              <Badge variant={calculation.confidence === "high" ? "active" : "beta"}>
                {calculation.confidence.toUpperCase()} CONFIDENCE
              </Badge>
            </div>

            {/* Dominant Recommended Size Display */}
            <div className="flex items-baseline justify-between py-2">
              <div>
                <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase block mb-1">
                  RECOMMENDED SIZE
                </span>
                <div className="text-6xl sm:text-7xl font-bold font-mono tracking-tighter text-white">
                  {calculation.recommendedSize}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#666] block">TARGET GARMENT</span>
                <span className="text-xs font-semibold text-white">Boxy Heavyweight Top</span>
                <span className="text-[10px] font-mono text-[#888] block mt-0.5">
                  SOURCE: VERIFIED PRODUCT CHART
                </span>
              </div>
            </div>

            {/* Animated Comparison Bars */}
            <div className="space-y-4 pt-4 border-t border-[#202020]">
              <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase block">
                METRIC RANGE ALIGNMENT (CM)
              </span>

              {/* Chest bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#999]">Chest ({chestInput} cm)</span>
                  <span className="text-white">
                    Range: {calculation.activeBounds.chestMin}–{calculation.activeBounds.chestMax} cm
                  </span>
                </div>
                <div className="h-2 w-full bg-[#1e1e1e] rounded-full overflow-hidden relative">
                  <motion.div
                    key={`${chestInput}-${calculation.recommendedSize}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.max(15, ((chestInput - 80) / 35) * 100))}%`,
                    }}
                    transition={{ duration: 0.6, ease: TRANSITION_EASE }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>

              {/* Waist bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#999]">Waist ({waistInput} cm)</span>
                  <span className="text-white">
                    Range: {calculation.activeBounds.waistMin}–{calculation.activeBounds.waistMax} cm
                  </span>
                </div>
                <div className="h-2 w-full bg-[#1e1e1e] rounded-full overflow-hidden relative">
                  <motion.div
                    key={`${waistInput}-${calculation.recommendedSize}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.max(15, ((waistInput - 65) / 40) * 100))}%`,
                    }}
                    transition={{ duration: 0.6, ease: TRANSITION_EASE }}
                    className="h-full bg-neutral-300 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Explanatory Reasons */}
            <div className="pt-4 border-t border-[#202020] space-y-2">
              <div className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
                ENGINE REASONING & TRADE-OFF
              </div>
              {calculation.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#ccc]">
                  <Check className="w-3.5 h-3.5 text-white mt-0.5 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
              <div className="text-xs text-[#888] italic pt-1">
                {calculation.tradeoff}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
