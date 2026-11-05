"use client";

import { motion } from "framer-motion";
import { FitBreakdownItem } from "@/lib/sizing/types";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface FitBreakdownBarsProps {
  breakdowns: FitBreakdownItem[];
}

export function FitBreakdownBars({ breakdowns }: FitBreakdownBarsProps) {
  if (!breakdowns || breakdowns.length === 0) return null;

  return (
    <div className="p-8 rounded-3xl border border-[#262626] bg-[#0d0d0d] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
        <div>
          <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase block">
            DIMENSIONAL AUDIT
          </span>
          <h3 className="text-base font-semibold text-white uppercase tracking-tight mt-0.5">
            Measurement vs. Garment Bounds
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#666]">
          VALUES IN CM
        </span>
      </div>

      <div className="space-y-6">
        {breakdowns.map((item, idx) => {
          // Calculate percentage position of user's value relative to a centered window around min/max
          const rangeSpan = Math.max(1, item.rangeMaxCm - item.rangeMinCm);
          const lowerMargin = item.rangeMinCm - rangeSpan * 0.5;
          const upperMargin = item.rangeMaxCm + rangeSpan * 0.5;
          const totalWindow = upperMargin - lowerMargin;

          const barPercentage = Math.min(
            100,
            Math.max(10, ((item.userValueCm - lowerMargin) / totalWindow) * 100)
          );

          const getStatusBadge = () => {
            if (item.status === "ideal") {
              return (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                  Ideal Alignment
                </span>
              );
            }
            if (item.status === "snug") {
              return (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  Snug (+{item.deltaCm} cm)
                </span>
              );
            }
            return (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/60 text-blue-300 border border-blue-800/60">
                Loose ({item.deltaCm} cm)
              </span>
            );
          };

          return (
            <div key={item.dimension} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold uppercase">{item.label}</span>
                  <span className="text-[#888]">({item.userValueCm} cm)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#666] hidden sm:inline-block">
                    Target: {item.rangeMinCm}–{item.rangeMaxCm} cm
                  </span>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Graphical Alignment Bar */}
              <div className="h-2.5 w-full bg-[#181818] rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: TRANSITION_EASE }}
                  className={`h-full rounded-full ${
                    item.status === "ideal"
                      ? "bg-white"
                      : item.status === "snug"
                      ? "bg-amber-400"
                      : "bg-neutral-400"
                  }`}
                />
              </div>

              <p className="text-[11px] text-[#888] leading-relaxed">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

