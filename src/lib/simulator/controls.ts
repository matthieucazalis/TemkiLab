// Ce que les commandes du panneau proposent : plage de focale, ouvertures
// disponibles. Fonctions pures, testées à part de l'interface.
import type { LensConstraint } from "./reducer";
import type { SimulatorState } from "@/lib/validators/simulator";

// Largeur de la scène de référence du rendu de test, en mm équivalent 24x36.
// En dessous, on ne peut pas être plus large que la « photo » : le zoom reste ×1.
export const REFERENCE_FOCAL_EQ = 24;

// Plage du curseur quand aucun objectif ne la limite (mode Général).
export const GENERAL_FOCAL_RANGE = { min: 10, max: 600 } as const;

// Ouvertures usuelles (pleins diaphragmes, plus 1,2 et 1,8).
export const STANDARD_APERTURES = [
  1, 1.2, 1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22,
] as const;

type Mode = SimulatorState["mode"];

export type FocalRange = { min: number; max: number; locked: boolean };

// En mode Profil avec un objectif choisi, c'est sa plage qui compte.
// Une focale fixe (min = max) verrouille le curseur.
export function focalRange(
  mode: Mode,
  lens: LensConstraint | null,
): FocalRange {
  if (mode === "PROFILE" && lens) {
    return {
      min: lens.focalMin,
      max: lens.focalMax,
      locked: lens.focalMin === lens.focalMax,
    };
  }
  return { ...GENERAL_FOCAL_RANGE, locked: false };
}

// Ouverture la plus grande permise : celle de l'objectif en mode Profil,
// aucune limite sinon.
export function apertureFloor(
  mode: Mode,
  lens: LensConstraint | null,
): number | null {
  return mode === "PROFILE" && lens ? lens.maxAperture : null;
}

// Liste croissante des ouvertures proposées. `floor` ajoute l'ouverture exacte
// de l'objectif (ex. f/4.5) même si ce n'est pas une valeur usuelle, et
// `current` garantit que la valeur affichée existe toujours dans le menu.
export function availableApertures(
  floor: number | null,
  current?: number,
): number[] {
  const values = new Set<number>(
    STANDARD_APERTURES.filter((value) => floor === null || value >= floor),
  );
  if (floor !== null) values.add(floor);
  if (current !== undefined) values.add(current);
  return [...values].sort((a, b) => a - b);
}
