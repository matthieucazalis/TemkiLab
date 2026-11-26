import { describe, expect, it } from "vitest";
import {
  BLUR_FACTOR,
  focusDepthOf,
  layerBlurStd,
  visibleRegion,
} from "./framing";
import { findScene } from "./scenes";

describe("visibleRegion", () => {
  it("ratio de la scène à ×1 : la scène entière", () => {
    expect(visibleRegion(1200, 800, 1.5, 1)).toEqual({
      x: 0,
      y: 0,
      w: 1200,
      h: 800,
    });
  });

  it("carré à ×1 : pleine hauteur, centré", () => {
    expect(visibleRegion(1200, 800, 1, 1)).toEqual({
      x: 200,
      y: 0,
      w: 800,
      h: 800,
    });
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
    expect(visibleRegion(1200, 800, 1.5, 2)).toEqual({
      x: 300,
      y: 200,
      w: 600,
      h: 400,
    });
  });

  it("refuse une valeur nulle ou invalide", () => {
    expect(() => visibleRegion(1200, 800, 0, 1)).toThrow(RangeError);
    expect(() => visibleRegion(1200, 800, 1.5, Number.NaN)).toThrow(RangeError);
  });
});

describe("layerBlurStd", () => {
  const base = {
    focalEq: 100,
    apertureEq: 2,
    depth: 1,
    focusDepth: 0,
    regionHeight: 800,
  };

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
    expect(layerBlurStd({ ...base, apertureEq: 1 }) > layerBlurStd(base)).toBe(
      true,
    );
  });
});

describe("focusDepthOf", () => {
  const rue = findScene("rue");

  it("sans choix : la profondeur du sujet", () => {
    expect(focusDepthOf(rue)).toBe(0.3);
  });

  it("avec un point : la profondeur de ce qui s'y trouve", () => {
    expect(focusDepthOf(rue, rue.focusTargets.near)).toBe(0.15);
    expect(focusDepthOf(rue, rue.focusTargets.far)).toBe(1);
  });
});
