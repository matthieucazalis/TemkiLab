// ratios d'image
// fonctions pures

export const ALL_RATIOS = [
  "3:2",
  "4:3",
  "1:1",
  "16:9",
  "3:5",
  "4:5",
  "5:7",
] as const;

export type RatioValue = (typeof ALL_RATIOS)[number];
export type Orientation = "landscape" | "portrait";

export function isKnownRatio(value: string): value is RatioValue {
  return (ALL_RATIOS as readonly string[]).includes(value);
}

//proportion
export function aspectRatio(value: string, orientation: Orientation): number {
  if (!isKnownRatio(value)) {
    throw new RangeError(`ratio inconnu : ${value}`);
  }

  const [a, b] = value.split(":").map(Number);
  const long = Math.max(a, b);
  const short = Math.min(a, b);

  return orientation === "landscape" ? long / short : short / long;
}

//bouton inversion paysage portrait
export function flipOrientation(orientation: Orientation): Orientation {
  return orientation === "landscape" ? "portrait" : "landscape";
}

// simul sait
export type RatioContext =
  | { mode: "GENERAL" }
  | {
      mode: "PROFILE";
      nativeRatio: string;
      unlockedRatios: readonly string[];
    };

export type RatioGroups = {
  native: RatioValue[];
  numeric: RatioValue[];
};

// affiche panneau controle avec les deux
export function availableRatios(context: RatioContext): RatioGroups {
  if (context.mode === "GENERAL") {
    return { native: [], numeric: [...ALL_RATIOS] };
  }

  const { nativeRatio, unlockedRatios } = context;
  if (!isKnownRatio(nativeRatio)) {
    throw new RangeError(`Ration natif inconnu : ${nativeRatio}`);
  }

  // filtre ALL_RATIOS
  const numeric = ALL_RATIOS.filter(
    (ratio) => ratio !== nativeRatio && unlockedRatios.includes(ratio),
  );
  return { native: [nativeRatio], numeric };
}

export function isRatioAllowed(value: string, context: RatioContext): boolean {
  const { native, numeric } = availableRatios(context);
  const allowed: readonly string[] = [...native, ...numeric];
  return allowed.includes(value);
}

export function defaultRatio(context: RatioContext): RatioValue {
  if (context.mode === "GENERAL") return "3:2";
  const { native } = availableRatios(context);
  return native[0];
}
