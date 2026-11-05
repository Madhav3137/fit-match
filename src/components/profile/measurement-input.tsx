"use client";

import * as React from "react";
import { HelpCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MeasurementUnit } from "@/lib/units/converter";

interface MeasurementInputProps {
  id: string;
  label: string;
  required?: boolean;
  unit: MeasurementUnit;
  value: number | string;
  error?: string;
  tip: string;
  guideMin: number;
  guideMax: number;
  onFocusDimension: () => void;
  onBlurDimension: () => void;
  onChange: (val: string) => void;
}

export function MeasurementInput({
  id,
  label,
  required = false,
  unit,
  value,
  error,
  tip,
  guideMin,
  guideMax,
  onFocusDimension,
  onBlurDimension,
  onChange,
}: MeasurementInputProps) {
  const [showTip, setShowTip] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const numVal = typeof value === "number" ? value : Number(value);
  const isValid = !error && !isNaN(numVal) && numVal >= guideMin && numVal <= guideMax;

  return (
    <div
      className={`relative group rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
        error
          ? "border-red-500/80 bg-[#140a0a]"
          : isFocused
          ? "border-white bg-[#141414] shadow-lg shadow-white/[0.02]"
          : "border-[#242424] bg-[#0f0f0f] hover:border-[#383838]"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-white">
            {label}
          </label>
          <span
            className={`text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border transition-colors ${
              required
                ? "border-neutral-700 bg-white/5 text-neutral-300"
                : "border-transparent text-[#666]"
            }`}
          >
            {required ? "REQUIRED" : "OPTIONAL"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isValid && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-emerald-400"
            >
              <Check className="w-3.5 h-3.5" />
            </motion.span>
          )}

          <button
            type="button"
            onClick={() => setShowTip(!showTip)}
            className="text-[#666] hover:text-white transition-colors"
            title="Measurement guide"
            aria-label={`Measurement guide for ${label}`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          id={id}
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocusDimension();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlurDimension();
          }}
          placeholder={`e.g. ${Math.round((guideMin + guideMax) / 2)}`}
          className={`w-full bg-[#181818] border text-white font-mono text-base px-4 py-2.5 rounded-xl focus:outline-none transition-colors ${
            error
              ? "border-red-500/80 focus:border-red-500"
              : isFocused
              ? "border-white"
              : "border-[#2a2a2a]"
          }`}
        />
        <span className="absolute right-3.5 text-xs font-mono text-[#666] pointer-events-none uppercase">
          {unit}
        </span>
      </div>

      {/* Helper Guide / Pointers with AnimatePresence */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] text-[11px] text-[#999] leading-relaxed">
              {tip}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error or guideline with smooth transition */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono min-h-[16px]">
        {error ? (
          <motion.span
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 font-medium"
          >
            {error}
          </motion.span>
        ) : (
          <span className="text-[#555]">
            Plausible: {guideMin}–{guideMax} {unit}
          </span>
        )}
      </div>
    </div>
  );
}
