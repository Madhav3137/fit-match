"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
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

  return (
    <div className="group rounded-xl border border-[#242424] bg-[#111111] p-4 transition-colors focus-within:border-neutral-400">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-white">
            {label}
          </label>
          <span
            className={`text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.2 rounded border ${
              required
                ? "border-neutral-700 bg-white/5 text-neutral-300"
                : "border-transparent text-[#666]"
            }`}
          >
            {required ? "REQUIRED" : "OPTIONAL"}
          </span>
        </div>

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

      <div className="relative flex items-center">
        <input
          id={id}
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocusDimension}
          onBlur={onBlurDimension}
          placeholder={`e.g. ${Math.round((guideMin + guideMax) / 2)}`}
          className={`w-full bg-[#181818] border text-white font-mono text-base px-3.5 py-2.5 rounded-lg focus:outline-none transition-colors ${
            error
              ? "border-red-500/80 focus:border-red-500"
              : "border-[#303030] focus:border-white"
          }`}
        />
        <span className="absolute right-3.5 text-xs font-mono text-[#666] pointer-events-none uppercase">
          {unit}
        </span>
      </div>

      {/* Helper Guide / Pointers */}
      {showTip && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-[#181818] border border-[#282828] text-[11px] text-[#999] leading-relaxed">
          {tip}
        </div>
      )}

      {/* Error or plausible guideline */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : (
          <span className="text-[#555]">
            Plausible: {guideMin}–{guideMax} {unit}
          </span>
        )}
      </div>
    </div>
  );
}

