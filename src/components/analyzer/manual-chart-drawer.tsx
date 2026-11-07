"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { GarmentCategory } from "@/lib/retailers/types";
import { X, Plus, Trash2, Sparkles } from "lucide-react";
import { getStoredProfile } from "@/lib/storage/profile-storage";

interface ManualSizeRow {
  label: string;
  chestMin?: number;
  chestMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipMin?: number;
  hipMax?: number;
  inseamMin?: number;
  inseamMax?: number;
  outseamMin?: number;
  outseamMax?: number;
}

interface ManualChartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  brand: string;
  initialCategory?: GarmentCategory;
  onChartSubmitted: (result: any) => void;
}

const DEFAULT_TOP_SIZES: ManualSizeRow[] = [
  { label: "S", chestMin: 88, chestMax: 94, waistMin: 74, waistMax: 80 },
  { label: "M", chestMin: 95, chestMax: 101, waistMin: 81, waistMax: 87 },
  { label: "L", chestMin: 102, chestMax: 108, waistMin: 88, waistMax: 94 },
  { label: "XL", chestMin: 109, chestMax: 115, waistMin: 95, waistMax: 101 },
];

const DEFAULT_TROUSER_SIZES: ManualSizeRow[] = [
  { label: "30", waistMin: 75, waistMax: 78, hipMin: 90, hipMax: 94, inseamMin: 78, inseamMax: 81, outseamMin: 102, outseamMax: 105 },
  { label: "32", waistMin: 80, waistMax: 83, hipMin: 95, hipMax: 99, inseamMin: 80, inseamMax: 83, outseamMin: 104, outseamMax: 107 },
  { label: "34", waistMin: 85, waistMax: 88, hipMin: 100, hipMax: 104, inseamMin: 81, inseamMax: 84, outseamMin: 105, outseamMax: 108 },
  { label: "36", waistMin: 90, waistMax: 93, hipMin: 105, hipMax: 109, inseamMin: 82, inseamMax: 85, outseamMin: 106, outseamMax: 109 },
];

export function ManualChartDrawer({
  isOpen,
  onClose,
  productTitle,
  brand,
  initialCategory = "top",
  onChartSubmitted,
}: ManualChartDrawerProps) {
  const [category, setCategory] = React.useState<GarmentCategory>(initialCategory);
  const [sizes, setSizes] = React.useState<ManualSizeRow[]>(
    initialCategory === "trousers" ? DEFAULT_TROUSER_SIZES : DEFAULT_TOP_SIZES
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Update sizes when category flips
  const handleCategoryChange = (cat: GarmentCategory) => {
    setCategory(cat);
    if (cat === "trousers") {
      setSizes(DEFAULT_TROUSER_SIZES);
    } else {
      setSizes(DEFAULT_TOP_SIZES);
    }
  };

  const addRow = () => {
    setSizes((prev) => [
      ...prev,
      { label: `Size ${prev.length + 1}`, chestMin: 100, chestMax: 106, waistMin: 85, waistMax: 91 },
    ]);
  };

  const removeRow = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof ManualSizeRow, value: any) => {
    setSizes((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate min/max ranges
    for (const s of sizes) {
      const pairs = [
        { name: "Chest", min: s.chestMin, max: s.chestMax },
        { name: "Waist", min: s.waistMin, max: s.waistMax },
        { name: "Hips", min: s.hipMin, max: s.hipMax },
        { name: "Inseam", min: s.inseamMin, max: s.inseamMax },
        { name: "Outseam", min: s.outseamMin, max: s.outseamMax },
      ];

      let hasRange = false;
      for (const p of pairs) {
        const hasMin = p.min !== undefined && p.min !== null && !isNaN(p.min) && p.min > 0;
        const hasMax = p.max !== undefined && p.max !== null && !isNaN(p.max) && p.max > 0;

        if (hasMin !== hasMax) {
          alert(`Incomplete ${p.name} range for size "${s.label}". Please provide both minimum and maximum bounds.`);
          return;
        }
        if (hasMin && hasMax) {
          if (p.min! > p.max!) {
            alert(`Reversed ${p.name} range for size "${s.label}": minimum (${p.min}) cannot exceed maximum (${p.max}).`);
            return;
          }
          hasRange = true;
        }
      }

      if (!hasRange) {
        alert(`Size "${s.label}" must include at least one valid measurement range.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const storedProf = getStoredProfile();
      const res = await fetch("/api/analyze/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productTitle,
          brand,
          category,
          chartType: "body_ranges",
          profileData: storedProf || undefined,
          fitPreference: storedProf?.fitPreference || "regular",
          sizes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onChartSubmitted(data);
        onClose();
      } else {
        alert(data.error?.message || "Failed to submit manual chart.");
      }
    } catch (err: any) {
      alert("Error submitting manual chart: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isTrouser = category === "trousers";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#303030] bg-[#101010] p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div>
            <div className="text-[10px] font-mono tracking-technical text-[#888] uppercase">
              // MANUAL CHART CALIBRATION
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white uppercase mt-0.5">
              Input Size Chart for {brand}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-mono tracking-technical uppercase text-[#888]">
            Garment Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["top", "trousers", "outerwear", "dress"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`py-2 px-3 text-xs font-mono uppercase rounded-lg border transition-all ${
                  category === cat
                    ? "border-white bg-[#1a1a1a] text-white font-bold"
                    : "border-[#262626] bg-[#121212] text-[#888] hover:border-[#444] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Size Table Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-technical uppercase text-[#888]">
              Size Bounds (Centimeters)
            </span>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Size Row</span>
            </button>
          </div>

          <div className="border border-[#262626] rounded-xl overflow-hidden bg-[#0c0c0c]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141414] text-[#888] border-b border-[#222]">
                <tr>
                  <th className="p-3 w-20">Size</th>
                  {!isTrouser ? (
                    <>
                      <th className="p-3">Chest Range (Min - Max)</th>
                      <th className="p-3">Waist Range (Min - Max)</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3">Waist Range (Min - Max)</th>
                      <th className="p-3">Hips Range (Min - Max)</th>
                      <th className="p-3">Inseam [Inner Leg: Crotch to Hem] (Min - Max)</th>
                      <th className="p-3">Outseam [Waistband to Hem] (Min - Max)</th>
                    </>
                  )}
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {sizes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#121212] transition-colors">
                    {/* Size Label */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateRow(idx, "label", e.target.value)}
                        className="w-16 bg-[#181818] border border-[#303030] rounded px-2 py-1 text-white font-bold text-center focus:border-white focus:outline-none"
                      />
                    </td>

                    {!isTrouser ? (
                      <>
                        {/* Chest Range */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.chestMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "chestMin", Number(e.target.value))}
                              className="w-16 bg-[#181818] border border-[#303030] rounded px-2 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.chestMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "chestMax", Number(e.target.value))}
                              className="w-16 bg-[#181818] border border-[#303030] rounded px-2 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[10px] text-[#555]">cm</span>
                          </div>
                        </td>

                        {/* Waist Range */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.waistMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "waistMin", Number(e.target.value))}
                              className="w-16 bg-[#181818] border border-[#303030] rounded px-2 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.waistMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "waistMax", Number(e.target.value))}
                              className="w-16 bg-[#181818] border border-[#303030] rounded px-2 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[10px] text-[#555]">cm</span>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Trouser Waist */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.waistMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "waistMin", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.waistMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "waistMax", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Trouser Hips */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.hipMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "hipMin", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.hipMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "hipMax", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Trouser Inseam */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.inseamMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "inseamMin", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.inseamMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "inseamMax", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Trouser Outseam */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={row.outseamMin || ""}
                              placeholder="Min"
                              onChange={(e) => updateRow(idx, "outseamMin", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                            <span className="text-[#555]">-</span>
                            <input
                              type="number"
                              value={row.outseamMax || ""}
                              placeholder="Max"
                              onChange={(e) => updateRow(idx, "outseamMax", Number(e.target.value))}
                              className="w-14 bg-[#181818] border border-[#303030] rounded px-1.5 py-1 text-white text-center focus:border-white focus:outline-none"
                            />
                          </div>
                        </td>
                      </>
                    )}

                    <td className="p-2.5 text-center">
                      {sizes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          className="text-[#555] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isTrouser && (
            <p className="text-[11px] font-mono text-[#888] pt-1">
              NOTE: Enter true <span className="text-white font-medium">Inseam</span> (crotch seam to bottom hem) and <span className="text-white font-medium">Outseam</span> (waistband to bottom hem). Both are evaluated independently.
            </p>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222]">
          <span className="text-[10px] font-mono text-[#666]">
            CHART SAVED AS MANUAL PROVENANCE
          </span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Apply Size Chart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

