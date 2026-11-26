// Les scènes du simulateur : des illustrations découpées en COUCHES de
// profondeur (0 = tout près, 1 = très loin). Chaque couche est une liste de
// formes simples. Pas de fichier image : la profondeur est connue exactement,
// c'est elle qui sert à calculer le flou.
// Fonctions pures, sans React.
import { SCENES } from "./scene-data";

export const SCENE_IDS = ["paysage", "rue", "portrait"] as const;
export type SceneId = (typeof SCENE_IDS)[number];

// Coordonnées normalisées dans la scène : x et y entre 0 et 1.
export type Point = { x: number; y: number };

export type Shape =
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      opacity?: number;
    }
  | {
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      fill: string;
      opacity?: number;
    }
  | {
      kind: "polygon";
      points: readonly (readonly [number, number])[];
      fill: string;
      opacity?: number;
    };

export type Layer = {
  depth: number; // 0 (proche) à 1 (loin)
  shapes: readonly Shape[];
};

// Trois points de mise au point proposés pour chaque scène. Le sujet sert de
// point de départ.
export type FocusTargets = { near: Point; subject: Point; far: Point };

export type Scene = {
  id: SceneId;
  width: number; // taille du dessin, en unités du SVG
  height: number;
  // Rangées du plus loin au plus proche : c'est l'ordre de dessin.
  layers: readonly Layer[];
  focusTargets: FocusTargets;
};

function pointInPolygon(
  points: readonly (readonly [number, number])[],
  x: number,
  y: number,
): boolean {
  // Lancer de rayon : on compte combien de côtés le rayon horizontal traverse.
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function containsPoint(shape: Shape, x: number, y: number): boolean {
  switch (shape.kind) {
    case "rect":
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    case "circle":
      return (x - shape.cx) ** 2 + (y - shape.cy) ** 2 <= shape.r ** 2;
    case "polygon":
      return pointInPolygon(shape.points, x, y);
  }
}

// Profondeur de ce qu'on voit en (x, y), en unités de la scène : celle de la
// couche la plus proche qui recouvre le point. Rien ne le recouvre : l'infini (1).
export function depthAt(scene: Scene, x: number, y: number): number {
  let nearest = 1;
  for (const layer of scene.layers) {
    if (
      layer.depth < nearest &&
      layer.shapes.some((s) => containsPoint(s, x, y))
    ) {
      nearest = layer.depth;
    }
  }
  return nearest;
}

// Un identifiant inconnu (ancien preset, valeur de départ « default »)
// retombe sur la première scène au lieu de planter.
export function findScene(id: string): Scene {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}

export { SCENES };
