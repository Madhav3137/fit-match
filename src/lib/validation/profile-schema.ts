import { z } from "zod";

export const PLAUSIBLE_RANGES_CM = {
  height: { min: 120, max: 240, label: "Height" },
  chest: { min: 65, max: 165, label: "Chest / Bust" },
  waist: { min: 55, max: 150, label: "Waist" },
  hip: { min: 65, max: 170, label: "Hips" },
  shoulder: { min: 30, max: 65, label: "Shoulder Width" },
  inseam: { min: 55, max: 105, label: "Inseam" },
  outseam: { min: 75, max: 135, label: "Outseam" },
} as const;

export const MeasurementProfileSchema = z.object({
  id: z.string().optional(),
  unit: z.enum(["cm", "in"]).default("cm"),
  heightCm: z
    .number({ message: "Height is required and must be a number" })
    .min(PLAUSIBLE_RANGES_CM.height.min, `Height must be at least ${PLAUSIBLE_RANGES_CM.height.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.height.max, `Height must not exceed ${PLAUSIBLE_RANGES_CM.height.max} cm`),
  chestCm: z
    .number({ message: "Chest/Bust is required and must be a number" })
    .min(PLAUSIBLE_RANGES_CM.chest.min, `Chest must be at least ${PLAUSIBLE_RANGES_CM.chest.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.chest.max, `Chest must not exceed ${PLAUSIBLE_RANGES_CM.chest.max} cm`),
  waistCm: z
    .number({ message: "Waist is required and must be a number" })
    .min(PLAUSIBLE_RANGES_CM.waist.min, `Waist must be at least ${PLAUSIBLE_RANGES_CM.waist.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.waist.max, `Waist must not exceed ${PLAUSIBLE_RANGES_CM.waist.max} cm`),
  hipCm: z
    .number({ message: "Hip measurement must be a number" })
    .min(PLAUSIBLE_RANGES_CM.hip.min, `Hip must be at least ${PLAUSIBLE_RANGES_CM.hip.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.hip.max, `Hip must not exceed ${PLAUSIBLE_RANGES_CM.hip.max} cm`)
    .nullable()
    .optional(),
  shoulderCm: z
    .number({ message: "Shoulder width must be a number" })
    .min(PLAUSIBLE_RANGES_CM.shoulder.min, `Shoulder width must be at least ${PLAUSIBLE_RANGES_CM.shoulder.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.shoulder.max, `Shoulder width must not exceed ${PLAUSIBLE_RANGES_CM.shoulder.max} cm`)
    .nullable()
    .optional(),
  inseamCm: z
    .number({ message: "Inseam must be a number" })
    .min(PLAUSIBLE_RANGES_CM.inseam.min, `Inseam must be at least ${PLAUSIBLE_RANGES_CM.inseam.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.inseam.max, `Inseam must not exceed ${PLAUSIBLE_RANGES_CM.inseam.max} cm`)
    .nullable()
    .optional(),
  outseamCm: z
    .number({ message: "Outseam must be a number" })
    .min(PLAUSIBLE_RANGES_CM.outseam.min, `Outseam must be at least ${PLAUSIBLE_RANGES_CM.outseam.min} cm`)
    .max(PLAUSIBLE_RANGES_CM.outseam.max, `Outseam must not exceed ${PLAUSIBLE_RANGES_CM.outseam.max} cm`)
    .nullable()
    .optional(),
  fitPreference: z.enum(["slim", "regular", "relaxed"]).default("regular"),
  consentToStore: z.boolean().refine((val) => val === true, {
    message: "You must confirm consent to store your sizing measurements.",
  }),
});

export type MeasurementProfileData = z.infer<typeof MeasurementProfileSchema>;

export interface ProfileFormValues {
  unit: "cm" | "in";
  height: number | string;
  chest: number | string;
  waist: number | string;
  hip?: number | string;
  shoulder?: number | string;
  inseam?: number | string;
  outseam?: number | string;
  fitPreference: "slim" | "regular" | "relaxed";
  consentToStore: boolean;
}
