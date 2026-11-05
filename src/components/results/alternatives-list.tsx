"use client";

import { motion } from "framer-motion";
import { AlternativeSize } from "@/lib/sizing/types";
import { ArrowUpDown } from "lucide-react";
import { TRANSITION_EASE } from "@/lib/motion/variants";

interface AlternativesListProps {
  alternatives: AlternativeSize[];
}

export function AlternativesList({ alternatives }: AlternativesListProps) {
  if (!alternatives || alternatives.length === 0) return null;

  return (
    <div className="p-8 rounded-3xl border border-[#262626] bg-[#0d0d0d] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
        <div>
          <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase block">
            ADJACENT CANDIDATES
          </span>
          <h3 className="text-base font-semibold text-white uppercase tracking-tight mt-0.5">
            Alternative Sizes & Trade-Offs
          </h3>
        </div>
        <ArrowUpDown className="w-4 h-4 text-[#666]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {alternatives.map((alt, idx) => (
          <motion.div
            key={alt.size}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + idx * 0.12, ease: TRANSITION_EASE }}
            className="p-5 rounded-2xl border border-[#222] bg-[#121212] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                Size {alt.size}
              </span>
              <span className="text-[10px] font-mono text-[#666] uppercase px-2 py-0.5 rounded bg-white/5 border border-[#282828]">
                Δ Score: +{alt.scoreDifference}
              </span>
            </div>

            <p className="text-xs text-[#999] leading-relaxed">
              {alt.tradeoff}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
