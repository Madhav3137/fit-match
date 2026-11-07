import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getStoredProfile,
  saveStoredProfile,
  deleteStoredProfile,
} from "./profile-storage";
import { MeasurementProfileData } from "../validation/profile-schema";

describe("Profile Storage (localStorage)", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    vi.stubGlobal("localStorage", mockLocalStorage);
    vi.stubGlobal("window", { localStorage: mockLocalStorage });
  });

  const testProfile: MeasurementProfileData = {
    unit: "cm",
    heightCm: 180,
    chestCm: 100,
    waistCm: 84,
    hipCm: 98,
    shoulderCm: 46,
    inseamCm: 82,
    outseamCm: 106,
    fitPreference: "regular",
    consentToStore: true,
  };

  it("saves and retrieves full profile including outseam", () => {
    saveStoredProfile(testProfile);
    const retrieved = getStoredProfile();

    expect(retrieved).not.toBeNull();
    expect(retrieved?.outseamCm).toBe(106);
    expect(retrieved?.inseamCm).toBe(82);
    expect(retrieved?.heightCm).toBe(180);
    expect(retrieved?.updatedAt).toBeDefined();
  });

  it("deletes stored profile cleanly", () => {
    saveStoredProfile(testProfile);
    expect(getStoredProfile()).not.toBeNull();

    deleteStoredProfile();
    expect(getStoredProfile()).toBeNull();
  });

  it("returns null when nothing is stored", () => {
    expect(getStoredProfile()).toBeNull();
  });
});
