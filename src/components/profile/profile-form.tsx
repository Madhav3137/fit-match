"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MeasurementDiagram } from "../ui/measurement-diagram";
import { UnitToggle } from "./unit-toggle";
import { FitPreferenceSelector } from "./fit-preference-selector";
import { MeasurementInput } from "./measurement-input";
import { Button } from "../ui/button";
import {
  MeasurementUnit,
  cmToInches,
  inchesToCm,
  normalizeToCm,
  displayFromCm,
} from "@/lib/units/converter";
import {
  PLAUSIBLE_RANGES_CM,
  MeasurementProfileData,
  MeasurementProfileSchema,
} from "@/lib/validation/profile-schema";
import {
  getStoredProfile,
  saveStoredProfile,
  deleteStoredProfile,
} from "@/lib/storage/profile-storage";
import { Check, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TRANSITION_EASE } from "@/lib/motion/variants";

type DimensionKey = "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam";

export function ProfileForm() {
  const router = useRouter();

  // Active highlighted dimension on SVG diagram
  const [activeDimension, setActiveDimension] = React.useState<DimensionKey | null>(null);

  // Unit mode: "cm" | "in"
  const [unit, setUnit] = React.useState<MeasurementUnit>("cm");

  // Form states (stored in current unit for display)
  const [height, setHeight] = React.useState<string>("");
  const [chest, setChest] = React.useState<string>("");
  const [waist, setWaist] = React.useState<string>("");
  const [hip, setHip] = React.useState<string>("");
  const [shoulder, setShoulder] = React.useState<string>("");
  const [inseam, setInseam] = React.useState<string>("");
  const [fitPreference, setFitPreference] = React.useState<"slim" | "regular" | "relaxed">("regular");
  const [consent, setConsent] = React.useState<boolean>(true);

  // Status & Validation
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [hasExistingProfile, setHasExistingProfile] = React.useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<boolean>(false);

  // Load existing profile from storage on mount
  React.useEffect(() => {
    const existing = getStoredProfile();
    if (existing) {
      setHasExistingProfile(true);
      setFitPreference(existing.fitPreference || "regular");
      setConsent(existing.consentToStore ?? true);
      setUnit(existing.unit || "cm");

      const currUnit = existing.unit || "cm";
      if (existing.heightCm) setHeight(String(displayFromCm(existing.heightCm, currUnit)));
      if (existing.chestCm) setChest(String(displayFromCm(existing.chestCm, currUnit)));
      if (existing.waistCm) setWaist(String(displayFromCm(existing.waistCm, currUnit)));
      if (existing.hipCm) setHip(String(displayFromCm(existing.hipCm, currUnit)));
      if (existing.shoulderCm) setShoulder(String(displayFromCm(existing.shoulderCm, currUnit)));
      if (existing.inseamCm) setInseam(String(displayFromCm(existing.inseamCm, currUnit)));
    }
  }, []);

  // Bidirectional unit toggle converter
  const handleUnitChange = (nextUnit: MeasurementUnit) => {
    if (nextUnit === unit) return;

    const convertVal = (valStr: string) => {
      if (!valStr || isNaN(Number(valStr))) return "";
      const num = Number(valStr);
      if (nextUnit === "in") {
        return String(cmToInches(num));
      } else {
        return String(inchesToCm(num));
      }
    };

    setHeight(convertVal(height));
    setChest(convertVal(chest));
    setWaist(convertVal(waist));
    setHip(convertVal(hip));
    setShoulder(convertVal(shoulder));
    setInseam(convertVal(inseam));
    setUnit(nextUnit);
    setErrors({});
  };

  // Convert input value to guideline display bounds
  const getGuideBounds = (key: DimensionKey) => {
    const r = PLAUSIBLE_RANGES_CM[key];
    if (unit === "in") {
      return {
        min: cmToInches(r.min),
        max: cmToInches(r.max),
      };
    }
    return { min: r.min, max: r.max };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // 1. Convert display values to normalized centimeters
    const norm = (val: string) => (val ? normalizeToCm(Number(val), unit) : undefined);

    const payloadCandidate: Partial<MeasurementProfileData> = {
      unit,
      heightCm: height ? norm(height) : (NaN as any),
      chestCm: chest ? norm(chest) : (NaN as any),
      waistCm: waist ? norm(waist) : (NaN as any),
      hipCm: hip ? norm(hip) : null,
      shoulderCm: shoulder ? norm(shoulder) : null,
      inseamCm: inseam ? norm(inseam) : null,
      fitPreference,
      consentToStore: consent,
    };

    // 2. Client-side Zod validation
    const result = MeasurementProfileSchema.safeParse(payloadCandidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const validData = result.data;

    // 3. Save to localStorage
    saveStoredProfile(validData);

    // 4. Send to server-side Route Handler
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validData),
      });
    } catch (err) {
      console.warn("Server sync skipped, saved locally", err);
    }

    setIsSubmitting(false);
    setIsSaved(true);
    setHasExistingProfile(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 3500);
  };

  const handleDelete = async () => {
    deleteStoredProfile();
    try {
      await fetch("/api/profile", { method: "DELETE" });
    } catch (e) {
      console.warn("Server delete skipped", e);
    }
    setHeight("");
    setChest("");
    setWaist("");
    setHip("");
    setShoulder("");
    setInseam("");
    setHasExistingProfile(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* Left Column: Interactive Measurement Graphic with synchronized guide */}
      <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
        <div className="p-6 rounded-2xl border border-[#262626] bg-[#0c0c0c]">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#202020]">
            <div>
              <span className="text-[10px] font-mono tracking-technical text-[#888] uppercase block">
                ANATOMICAL TARGET
              </span>
              <span className="text-xs font-semibold text-white">
                {activeDimension
                  ? PLAUSIBLE_RANGES_CM[activeDimension].label.toUpperCase()
                  : "SELECT A FIELD"}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#666]">
              ACTIVE CALIPER
            </span>
          </div>

          <MeasurementDiagram
            activeDimension={activeDimension}
            interactive={true}
            onSelectDimension={(dim) => setActiveDimension(dim)}
          />

          <div className="mt-4 pt-3 border-t border-[#1a1a1a] text-[10px] font-mono text-[#666] flex items-center justify-between">
            <span>HOVER FIELD TO HIGHLIGHT</span>
            <span className="text-white">UNITS: {unit.toUpperCase()}</span>
          </div>
        </div>

        {/* Existing Profile Indicator */}
        {hasExistingProfile && (
          <div className="p-4 rounded-xl border border-[#262626] bg-[#101010] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-neutral-300">
                ACTIVE PROFILE STORED
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1 font-mono"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>DELETE</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Form Matrix */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Top Bar with Unit Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white uppercase">
                Body Dimensions
              </h2>
              <p className="text-xs text-[#888] font-mono mt-0.5">
                Measurements are normalized and encrypted.
              </p>
            </div>
            <UnitToggle unit={unit} onChange={handleUnitChange} />
          </div>

          {/* Required Fields Section */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
              // REQUIRED MEASUREMENTS
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Height */}
              <MeasurementInput
                id="height"
                label="Height"
                required={true}
                unit={unit}
                value={height}
                error={errors.heightCm}
                tip="Stand barefoot with heels flat against a wall. Measure vertically from floor to top of head."
                guideMin={getGuideBounds("height").min}
                guideMax={getGuideBounds("height").max}
                onFocusDimension={() => setActiveDimension("height")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setHeight(val);
                  setErrors((prev) => ({ ...prev, heightCm: "" }));
                }}
              />

              {/* Chest */}
              <MeasurementInput
                id="chest"
                label="Chest / Bust"
                required={true}
                unit={unit}
                value={chest}
                error={errors.chestCm}
                tip="Measure around the fullest part of your chest/bust, keeping the tape level across the shoulder blades."
                guideMin={getGuideBounds("chest").min}
                guideMax={getGuideBounds("chest").max}
                onFocusDimension={() => setActiveDimension("chest")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setChest(val);
                  setErrors((prev) => ({ ...prev, chestCm: "" }));
                }}
              />

              {/* Waist */}
              <MeasurementInput
                id="waist"
                label="Waist"
                required={true}
                unit={unit}
                value={waist}
                error={errors.waistCm}
                tip="Measure around your natural waistline, typically located just above the navel. Keep tape comfortably snug."
                guideMin={getGuideBounds("waist").min}
                guideMax={getGuideBounds("waist").max}
                onFocusDimension={() => setActiveDimension("waist")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setWaist(val);
                  setErrors((prev) => ({ ...prev, waistCm: "" }));
                }}
              />
            </div>
          </div>

          {/* Optional Fields Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-technical text-[#888] uppercase">
                // OPTIONAL PRECISION ATTRIBUTES
              </span>
              <span className="text-[10px] font-mono text-[#555]">
                ENHANCES TROUSER & OUTERWEAR MATCHING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Shoulders */}
              <MeasurementInput
                id="shoulder"
                label="Shoulders"
                unit={unit}
                value={shoulder}
                error={errors.shoulderCm}
                tip="Measure horizontally across your upper back from the tip of one shoulder bone to the tip of the other."
                guideMin={getGuideBounds("shoulder").min}
                guideMax={getGuideBounds("shoulder").max}
                onFocusDimension={() => setActiveDimension("shoulder")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setShoulder(val);
                  setErrors((prev) => ({ ...prev, shoulderCm: "" }));
                }}
              />

              {/* Hips */}
              <MeasurementInput
                id="hip"
                label="Hips"
                unit={unit}
                value={hip}
                error={errors.hipCm}
                tip="Measure around the fullest part of your hips and buttocks with feet placed shoulder-width apart."
                guideMin={getGuideBounds("hip").min}
                guideMax={getGuideBounds("hip").max}
                onFocusDimension={() => setActiveDimension("hip")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setHip(val);
                  setErrors((prev) => ({ ...prev, hipCm: "" }));
                }}
              />

              {/* Inseam */}
              <MeasurementInput
                id="inseam"
                label="Inseam"
                unit={unit}
                value={inseam}
                error={errors.inseamCm}
                tip="Measure vertically from the crotch seam along the inside leg to the bottom of the ankle."
                guideMin={getGuideBounds("inseam").min}
                guideMax={getGuideBounds("inseam").max}
                onFocusDimension={() => setActiveDimension("inseam")}
                onBlurDimension={() => setActiveDimension(null)}
                onChange={(val) => {
                  setInseam(val);
                  setErrors((prev) => ({ ...prev, inseamCm: "" }));
                }}
              />
            </div>
          </div>

          {/* Fit Preference Selection */}
          <div className="pt-2">
            <FitPreferenceSelector
              value={fitPreference}
              onChange={(pref) => setFitPreference(pref)}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-xl border border-[#242424] bg-[#111111] space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setErrors((prev) => ({ ...prev, consentToStore: "" }));
                }}
                className="mt-1 accent-white h-4 w-4 rounded cursor-pointer"
              />
              <div className="text-xs text-[#999] leading-relaxed">
                <span className="text-white font-medium">Consent to Store:</span> I consent
                to store my body measurements in this browser session to translate sizes
                across fashion brands. FITMATCH will never sell or share biometric data.
              </div>
            </label>
            {errors.consentToStore && (
              <span className="text-[10px] font-mono text-red-400 block pl-7">
                {errors.consentToStore}
              </span>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#666]">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <span>DETERMINISTIC // ENCRYPTED STORAGE</span>
            </div>

            <div className="flex items-center gap-3">
              <AnimatePresence>
                {isSaved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-2 rounded-lg"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>PROFILE SAVED</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="min-w-[170px]"
              >
                {isSubmitting ? "Saving..." : hasExistingProfile ? "Update Profile" : "Save Profile"}
              </Button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl border border-[#303030] bg-[#121212] space-y-4">
              <h3 className="text-base font-bold uppercase text-white">
                Delete Measurement Profile?
              </h3>
              <p className="text-xs text-[#999] leading-relaxed">
                This will delete your universal body profile from both your browser and session
                storage. You will need to re-enter your dimensions to receive size guidance.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white border-none"
                  onClick={handleDelete}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
