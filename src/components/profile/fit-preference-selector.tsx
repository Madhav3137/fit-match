"use client";

import { motion } from "framer-motion";

interface FitPreferenceSelectorProps {
  value: "slim" | "regular" | "relaxed";
  onChange: (val: "slim" | "regular" | "relaxed") => void;
}

const OPTIONS = [
  {
    key: "slim" as const,
    title: "SLIM FIT",
    desc: "Closer silhouette with minimal fabric ease across chest and waist.",
  },
  {
    key: "regular" as const,
    title: "REGULAR FIT",
    desc: "Standard balanced ease matching designer's intended garment drape.",
  },
  {
    key: "relaxed" as const,
    title: "RELAXED FIT",
    desc: "Generous drape with extra allowance for mobility or layering.",
  },
];

export function FitPreferenceSelector({ value, onChange }: FitPreferenceSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono tracking-technical uppercase text-[#929292]">
          Fit Preference
        </label>
        <span className="text-[10px] font-mono text-[#666]">INFLUENCES RANGE BOUNDS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = value === opt.key;
          return (
            <motion.button
              key={opt.key}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(opt.key)}
              className={`relative p-5 rounded-2xl border text-left transition-colors duration-200 overflow-hidden ${
                isSelected
                  ? "border-white bg-[#151515] text-white shadow-lg"
                  : "border-[#242424] bg-[#0f0f0f] text-[#888] hover:border-[#444] hover:text-[#ccc]"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="fit-preference-glow"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-white/[0.04] pointer-events-none -z-10"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold tracking-wider">
                  {opt.title}
                </span>
                <span
                  className={`h-2 w-2 rounded-full transition-colors ${
                    isSelected ? "bg-white ring-2 ring-white/30" : "bg-transparent border border-[#444]"
                  }`}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-[#888]">
                {opt.desc}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
