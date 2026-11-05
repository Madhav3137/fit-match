export type MeasurementUnit = "cm" | "in";

const CM_PER_INCH = 2.54;

/**
 * Converts centimeters to inches rounded to 1 decimal place.
 */
export function cmToInches(cm: number): number {
  if (isNaN(cm) || cm <= 0) return 0;
  return Math.round((cm / CM_PER_INCH) * 10) / 10;
}

/**
 * Converts inches to centimeters rounded to 1 decimal place.
 */
export function inchesToCm(inches: number): number {
  if (isNaN(inches) || inches <= 0) return 0;
  return Math.round(inches * CM_PER_INCH * 10) / 10;
}

/**
 * Formats a measurement stored in centimeters into the display unit.
 */
export function formatMeasurement(cm: number | undefined | null, unit: MeasurementUnit): string {
  if (cm === undefined || cm === null || isNaN(cm) || cm <= 0) {
    return "—";
  }
  if (unit === "in") {
    return `${cmToInches(cm)} in`;
  }
  return `${Math.round(cm * 10) / 10} cm`;
}

/**
 * Normalizes input value in given unit into canonical centimeters.
 */
export function normalizeToCm(value: number, unit: MeasurementUnit): number {
  if (unit === "in") {
    return inchesToCm(value);
  }
  return Math.round(value * 10) / 10;
}

/**
 * Displays a value from stored cm into the current input unit.
 */
export function displayFromCm(cm: number | undefined, unit: MeasurementUnit): number | string {
  if (cm === undefined || cm === null || isNaN(cm) || cm <= 0) return "";
  if (unit === "in") {
    return cmToInches(cm);
  }
  return Math.round(cm * 10) / 10;
}

