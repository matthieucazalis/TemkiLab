import {
  equivalentAperture,
  equivalentFocal,
  minShutterSeconds,
} from "@/lib/optics/formulas";
import type { SimulatorState } from "@/lib/validators/simulator";

export type SensorKind = "MICRO_43" | "APS_C" | "FULL_FRAME" | "MEDIUM_FORMAT";

// Du plus petit au plus grand capteur
const SENSOR_RANK: Record<SensorKind, number> = {
  MICRO_43: 0,
  APS_C: 1,
  FULL_FRAME: 2,
  MEDIUM_FORMAT: 3,
};

// coverage

export function lensCoversSensor(
  coverage: SensorKind | null,
  sensor: SensorKind,
): boolean {
  if (coverage === null) return true;
  return SENSOR_RANK[sensor] <= SENSOR_RANK[coverage];
}

export type ReadoutProfile = {
  cropFactor: number;
  stabilizationStops: number;
};

export type Readout = {
  focalEq: number; // mm, équivalent 24x36
  apertureEq: number; // f/ équivalent
  minShutterSeconds: number; // temps de pose maximal avant bougé
};

export function computeReadout(
  state: Pick<SimulatorState, "mode" | "focal" | "aperture">,
  profile: ReadoutProfile | null,
): Readout {
  const { cropFactor, stabilizationStops } =
    state.mode === "PROFILE" && profile
      ? profile
      : { cropFactor: 1, stabilizationStops: 0 };

  const focalEq = equivalentFocal(state.focal, cropFactor);
  return {
    focalEq,
    apertureEq: equivalentAperture(state.aperture, cropFactor),
    minShutterSeconds: minShutterSeconds(focalEq, stabilizationStops),
  };
}

//temps de pose

export function formatShutter(seconds: number, locale = "fr"): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new RangeError(
      `seconds doit être un nombre strictement positif (reçu : ${seconds})`,
    );
  }
  if (seconds >= 0.3) {
    const value = seconds.toLocaleString(locale, { maximumFractionDigits: 1 });
    return `${value} s`;
  }
  return `1/${Math.round(1 / seconds)} s`;
}
