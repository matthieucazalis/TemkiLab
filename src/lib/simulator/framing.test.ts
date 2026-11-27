import { describe, expect, it } from "vitest";
import {
  BLUR_FACTOR,
  focusDepthOf,
  frameToScene,
  layerBlurStd,
  sceneToFrame,
  visibleRegion,
} from "./framing";
import { findScene } from "./scenes";

describe("visibleRegion", () => {
  it("ratio de la scène à ×1 : la scène entière", () => {
    expect(visibleRegion(1200, 800, 1.5, 1)).toEqual({ x: 0, y: 0, w: 1200, h: 800 });
  });

  it("carré à ×1 : pleine hauteur, centré", () => {
    expect(visibleRegion(1200, 800, 1, 1)).toEqual({ x: 200, y: 0, w: 800, h: 800 });
  });

  it("16:9 à ×1 : pleine largeur, centré en hauteur", () => {
    const r = visibleRegion(1200, 800, 16 / 9, 1);
    expect(r.w).toBe(1200);
    expect(r.h).toBeCloseTo(675);
    expect(r.y).toBeCloseTo(62.5);
  });

  it("portrait à ×1 : pleine hauteur", () => {
    const r = visibleRegion(1200, 800, 2 / 3, 1);
    expect(r.h).toBe(800);
    expect(r.w).toBeCloseTo(533.33, 1);
  });

  it("le zoom ×2 divise la zone par deux, toujours au centre", () => {
    expect(visibleRegion(1200, 800, 1.5, 2)).toEqual({ x: 300, y: 200, w: 600, h: 400 });
  });

  it("refuse une valeur nulle ou invalide", () => {
    expect(() => visibleRegion(1200, 800, 0, 1)).toThrow(RangeError);
    expect(() => visibleRegion(1200, 800, 1.5, Number.NaN)).toThrow(RangeError);
  });
});

describe("layerBlurStd", () => {
  const base = { focalEq: 100, apertureEq: 2, depth: 1, focusDepth: 0, regionHeight: 800 };

  it("une couche au plan net n'est pas floue", () => {
    expect(layerBlurStd({ ...base, depth: 0 })).toBe(0);
  });

  it("(focale / ouverture) × écart × facteur × hauteur du cadre", () => {
    expect(layerBlurStd(base)).toBeCloseTo(50 * BLUR_FACTOR * 800);
  });

  it("proportionnel à la hauteur du cadre (le flou suit le zoom)", () => {
    expect(layerBlurStd({ ...base, regionHeight: 400 })).toBeCloseTo(
      layerBlurStd(base) / 2,
    );
  });

  it("plus flou quand on ouvre le diaphragme", () => {
    expect(layerBlurStd({ ...base, apertureEq: 1 }) > layerBlurStd(base)).toBe(true);
  });
});

describe("focusDepthOf", () => {
  const sport = findScene("sport");
  if (!sport) throw new Error("scène sport introuvable");

  it("sans choix : la profondeur du sujet", () => {
    expect(focusDepthOf(sport)).toBe(0.3);
  });

  it("avec un point : la profondeur de ce qui s'y trouve", () => {
    expect(focusDepthOf(sport, sport.focusTargets.near)).toBe(0.12);
    expect(focusDepthOf(sport, sport.focusTargets.far)).toBe(1);
  });
});

describe("sceneToFrame et frameToScene", () => {
  const scene = { width: 1200, height: 800 };
  const region = { x: 300, y: 200, w: 600, h: 400 }; // zoom ×2 au centre

  it("le centre de la scène est le centre du cadre", () => {
    expect(sceneToFrame(scene, region, { x: 0.5, y: 0.5 })).toEqual({ x: 0.5, y: 0.5 });
  });

  it("un point hors de la zone visible donne null", () => {
    expect(sceneToFrame(scene, region, { x: 0.05, y: 0.5 })).toBeNull();
    expect(sceneToFrame(scene, region, { x: 0.5, y: 0.95 })).toBeNull();
  });

  it("les coins de la zone visible sont les coins du cadre", () => {
    expect(sceneToFrame(scene, region, { x: 0.25, y: 0.25 })).toEqual({ x: 0, y: 0 });
    expect(sceneToFrame(scene, region, { x: 0.75, y: 0.75 })).toEqual({ x: 1, y: 1 });
  });

  it("frameToScene est l'inverse de sceneToFrame", () => {
    const p = { x: 0.6, y: 0.4 };
    const frame = sceneToFrame(scene, region, p);
    expect(frame).not.toBeNull();
    const back = frameToScene(scene, region, frame ?? { x: 0, y: 0 });
    expect(back.x).toBeCloseTo(p.x);
    expect(back.y).toBeCloseTo(p.y);
  });

  it("un clic au centre du cadre vise le centre de la scène, quel que soit le zoom", () => {
    expect(frameToScene(scene, region, { x: 0.5, y: 0.5 })).toEqual({ x: 0.5, y: 0.5 });
  });
});
