"use client";

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
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-white bg-[#1a1a1a] text-white shadow-sm"
                  : "border-[#262626] bg-[#111111] text-[#888] hover:border-[#444] hover:text-[#ccc]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold tracking-wider">
                  {opt.title}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? "bg-white" : "bg-transparent border border-[#444]"
                  }`}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-[#888]">
                {opt.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
