// Cœur du simulateur : fonctions PURES, sans React ni base de données.
// L'interface web, les presets et la télécommande mobile passeront tous par ici.
import {
  defaultRatio,
  flipOrientation,
  isRatioAllowed,
  type RatioContext,
} from "@/lib/optics/ratios";
import {
  SIMULATOR_LIMITS,
  type SimulatorState,
} from "@/lib/validators/simulator";

export const STICKMAN_SCENE_ID = "stickman";

export type ProfileConstraint = {
  cropFactor: number;
  nativeRatio: string;
  unlockedRatios: readonly string[];
};

export type LensConstraint = {
  focalMin: number;
  focalMax: number;
  maxAperture: number;
};

export type SimulatorConstraints = {
  profile: ProfileConstraint | null;
  lens: LensConstraint | null;
};

export const NO_CONSTRAINTS: SimulatorConstraints = {
  profile: null,
  lens: null,
};

export type SimulatorAction =
  | { type: "setScene"; sceneId: string }
  | { type: "setMode"; mode: SimulatorState["mode"] }
  | { type: "setFocal"; focal: number }
  | { type: "setAperture"; aperture: number }
  | { type: "setRatio"; value: string }
  | { type: "flipOrientation" }
  | { type: "setTilt"; tilt: number }
  | { type: "setFocusPoint"; point: SimulatorState["focusPoint"] }
  | { type: "applyPatch"; patch: SimulatorPatch };

type SimulatorPatch = Partial<SimulatorState>;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function ratioContext(
  mode: SimulatorState["mode"],
  constraints: SimulatorConstraints,
): RatioContext {
  const { profile } = constraints;
  if (mode === "PROFILE" && profile) {
    return {
      mode: "PROFILE",
      nativeRatio: profile.nativeRatio,
      unlockedRatios: profile.unlockedRatios,
    };
  }
  return { mode: "GENERAL" };
}

export function normalizeState(
  state: SimulatorState,
  constraints: SimulatorConstraints = NO_CONSTRAINTS,
): SimulatorState {
  const lens = state.mode === "PROFILE" ? constraints.lens : null;
  const { focal, aperture, tilt } = SIMULATOR_LIMITS;

  const context = ratioContext(state.mode, constraints);
  const ratioValue = isRatioAllowed(state.ratio.value, context)
    ? state.ratio.value
    : defaultRatio(context);

  return {
    ...state,
    focal: clamp(
      state.focal,
      lens ? Math.max(focal.min, lens.focalMin) : focal.min,
      lens ? Math.min(focal.max, lens.focalMax) : focal.max,
    ),
    aperture: clamp(
      state.aperture,
      lens ? Math.max(aperture.min, lens.maxAperture) : aperture.min,
      aperture.max,
    ),
    ratio: { ...state.ratio, value: ratioValue },
    tilt:
      state.sceneId === STICKMAN_SCENE_ID
        ? clamp(state.tilt, tilt.min, tilt.max)
        : 0,
    focusPoint: state.focusPoint && {
      x: clamp(state.focusPoint.x, 0, 1),
      y: clamp(state.focusPoint.y, 0, 1),
    },
  };
}

export function applyAction(
  state: SimulatorState,
  action: SimulatorAction,
  constraints: SimulatorConstraints = NO_CONSTRAINTS,
): SimulatorState {
  switch (action.type) {
    case "setScene":
      return normalizeState({ ...state, sceneId: action.sceneId }, constraints);

    case "setMode":
      return normalizeState({ ...state, mode: action.mode }, constraints);

    case "setFocal":
      if (!Number.isFinite(action.focal)) return state;
      return normalizeState({ ...state, focal: action.focal }, constraints);

    case "setAperture":
      if (!Number.isFinite(action.aperture)) return state;
      return normalizeState(
        { ...state, aperture: action.aperture },
        constraints,
      );

    case "setRatio": {
      const context = ratioContext(state.mode, constraints);
      if (!isRatioAllowed(action.value, context)) return state;
      return normalizeState(
        { ...state, ratio: { ...state.ratio, value: action.value } },
        constraints,
      );
    }

    case "flipOrientation":
      return {
        ...state,
        ratio: {
          ...state.ratio,
          orientation: flipOrientation(state.ratio.orientation),
        },
      };

    case "setTilt":
      if (!Number.isFinite(action.tilt)) return state;
      return normalizeState({ ...state, tilt: action.tilt }, constraints);

    case "setFocusPoint":
      return normalizeState(
        { ...state, focusPoint: action.point },
        constraints,
      );

    case "applyPatch":
      return normalizeState({ ...state, ...action.patch }, constraints);
  }
}
