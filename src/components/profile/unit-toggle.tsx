"use client";

import { motion } from "framer-motion";
import { MeasurementUnit } from "@/lib/units/converter";

interface UnitToggleProps {
  unit: MeasurementUnit;
  onChange: (unit: MeasurementUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="inline-flex items-center p-1 rounded-lg border border-[#303030] bg-[#121212] relative select-none">
      <button
        type="button"
        onClick={() => onChange("cm")}
        className={`relative z-10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
          unit === "cm" ? "text-black font-semibold" : "text-[#888] hover:text-white"
        }`}
      >
        Centimeters (cm)
      </button>

      <button
        type="button"
        onClick={() => onChange("in")}
        className={`relative z-10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
          unit === "in" ? "text-black font-semibold" : "text-[#888] hover:text-white"
        }`}
      >
        Inches (in)
      </button>

      {/* Sliding background pill */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 450, damping: 35 }}
        className={`absolute top-1 bottom-1 rounded-md bg-white ${
          unit === "cm" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%)] w-[calc(50%-4px)]"
        }`}
      />
    </div>
  );
}
