import { MeasurementProfileData } from "../validation/profile-schema";

const STORAGE_KEY = "fitmatch_universal_profile_v1";

/**
 * Retrieves the local profile from localStorage if available in browser context.
 */
export function getStoredProfile(): MeasurementProfileData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MeasurementProfileData;
  } catch (err) {
    console.error("Failed to parse stored profile", err);
    return null;
  }
}

/**
 * Saves profile to localStorage with timestamp.
 */
export function saveStoredProfile(profile: MeasurementProfileData): void {
  if (typeof window === "undefined") return;
  try {
    const enriched = {
      ...profile,
      id: profile.id || `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
  } catch (err) {
    console.error("Failed to save profile to localStorage", err);
  }
}

/**
 * Removes stored profile from localStorage.
 */
export function deleteStoredProfile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to remove profile from localStorage", err);
  }
}

