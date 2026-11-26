// Du réglage au rendu : quelle partie de la scène est visible, et de combien
// chaque couche est floue. Fonctions pures, sans React.
import { blurAmount } from "@/lib/optics/formulas";
import { depthAt, type Point, type Scene } from "./scenes";

export type Region = { x: number; y: number; w: number; h: number };

// Zone de la scène que le cadre laisse voir. À ×1, c'est la plus grande zone
// qui a le ratio du cadre et tient dans la scène ; le zoom la réduit autour
// du centre.
export function visibleRegion(
  sceneWidth: number,
  sceneHeight: number,
  aspect: number,
  zoom: number,
): Region {
  if (
    ![sceneWidth, sceneHeight, aspect, zoom].every(
      (v) => Number.isFinite(v) && v > 0,
    )
  ) {
    throw new RangeError(
      "visibleRegion attend des nombres strictement positifs",
    );
  }
  let w: number;
  let h: number;
  if (aspect >= sceneWidth / sceneHeight) {
    w = sceneWidth;
    h = sceneWidth / aspect;
  } else {
    h = sceneHeight;
    w = sceneHeight * aspect;
  }
  w /= zoom;
  h /= zoom;
  return { x: (sceneWidth - w) / 2, y: (sceneHeight - h) / 2, w, h };
}

// Constante de réglage (pédagogique, pas physique) : transforme l'intensité
// de flou de blurAmount en écart-type du flou, rapporté à la hauteur du cadre.
// Ainsi le flou garde la même taille VISIBLE quel que soit le zoom.
export const BLUR_FACTOR = 0.0005;

// En dessous de ce rapport (écart-type / hauteur du cadre), le flou ne se voit
// pas : on n'applique aucun filtre.
export const MIN_VISIBLE_BLUR_RATIO = 0.0004;

export function layerBlurStd(input: {
  focalEq: number;
  apertureEq: number;
  depth: number;
  focusDepth: number;
  regionHeight: number;
}): number {
  const { regionHeight, ...optics } = input;
  return blurAmount(optics) * BLUR_FACTOR * regionHeight;
}

// Profondeur du plan net : celle de ce qui se trouve au point de mise au point
// (le sujet de la scène tant que l'utilisateur n'a rien choisi).
export function focusDepthOf(scene: Scene, focusPoint?: Point): number {
  const point = focusPoint ?? scene.focusTargets.subject;
  return depthAt(scene, point.x * scene.width, point.y * scene.height);
}
