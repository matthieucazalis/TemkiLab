import { describe, expect, it } from "vitest";
import {
    blurAmount,
    equivalentAperture,
    equivalentFocal,
    isBelowReference,
    minShutterSeconds,
    zoomFactor,
} from "./formulas";

describe("equivalentFocal", () => {
    it("ne change rien en plein format (1x1)", () => {
        expect(equivalentFocal(50, 1)).toBe(50);
    });

    it("multiplie par le facteur de recadrage (APS-C x1.5)", () => {
        expect(equivalentFocal(50, 1.5)).toBe(75);
    });

    it("double en Micro 4/3 (x2)", () => {
        expect(equivalentFocal(24, 2)).toBe(48);
    });

    it("donne une focale plus courte en moyen format (x0.79)", () => {
        expect(equivalentFocal(50, 0.79)).toBeCloseTo(39.5);
    });
    
    it("refuse une focale ou un facteur nul, négatif ou invalide", () => {
        expect(() => equivalentFocal(0, 1)).toThrow(RangeError);
        expect(() => equivalentFocal(-5, 1)).toThrow(RangeError);
        expect(() => equivalentFocal(50, 0)).toThrow(RangeError);
        expect(() => equivalentFocal(Number.NaN, 1)).toThrow(RangeError);
    });
});

describe("equivalentAperture", () => {
    it("convertit f/1.8 en APS-C en environ f/2.7", () => {
        expect(equivalentAperture(1.8, 1.5)).toBeCloseTo(2.7);
    });

    it("refuse une ouverture invalide", () => {
        expect(() => equivalentAperture(0, 1)).toThrow(RangeError);
    });
});

describe("zoomFactor", () => {
    it("vaut 2 quand la focale demandée est le double de la référence", () => {
      expect(zoomFactor(100, 50)).toBe(2);
    });
  
    it("ne descend jamais sous x1", () => {
      expect(zoomFactor(35, 50)).toBe(1);
    });
  
    it("vaut exactement x1 à la focale de référence", () => {
      expect(zoomFactor(50, 50)).toBe(1);
    });
  
    it("refuse une focale de référence nulle", () => {
      expect(() => zoomFactor(50, 0)).toThrow(RangeError);
    });
  });
  

  describe("isBelowReference", () => {
    it("détecte une focale plus large que la photo", () => {
      expect(isBelowReference(24, 35)).toBe(true);
    });
  
    it("accepte la focale de référence et au-delà", () => {
      expect(isBelowReference(35, 35)).toBe(false);
      expect(isBelowReference(50, 35)).toBe(false);
    });
  });
  
  describe("blurAmount", () => {
    const base = { focalEq: 100, apertureEq: 2, depth: 1, focusDepth: 0 };
  
    it("vaut 0 à la profondeur de mise au point", () => {
      expect(blurAmount({ ...base, depth: 0 })).toBe(0);
    });
  
    it("calcule (focale / ouverture) x écart de profondeur", () => {
      expect(blurAmount(base)).toBe(50);
    });
  
    it("est symétrique : devant ou derrière le plan net, même flou", () => {
      const devant = blurAmount({ ...base, depth: 0.2, focusDepth: 0.7 });
      const derriere = blurAmount({ ...base, depth: 0.7, focusDepth: 0.2 });
      expect(devant).toBeCloseTo(derriere);
    });
  
    it("double quand la focale double", () => {
      expect(blurAmount({ ...base, focalEq: 200 })).toBe(2 * blurAmount(base));
    });
  
    it("diminue quand on ferme le diaphragme", () => {
      expect(blurAmount({ ...base, apertureEq: 4 })).toBe(blurAmount(base) / 2);
    });
  
    it("refuse une profondeur hors de [0, 1]", () => {
      expect(() => blurAmount({ ...base, depth: 1.2 })).toThrow(RangeError);
      expect(() => blurAmount({ ...base, focusDepth: -0.1 })).toThrow(RangeError);
    });
  });
  
  describe("minShutterSeconds", () => {
    it("applique la règle du 1/focale sans stabilisation", () => {
      expect(minShutterSeconds(100)).toBe(0.01);
    });
  
    it("gagne un facteur 2 par IL de stabilisation", () => {
      expect(minShutterSeconds(50, 1)).toBeCloseTo(2 * minShutterSeconds(50));
    });
  
    it("donne environ 0,43 s pour 75 mm eq. avec 5 IL", () => {
      expect(minShutterSeconds(75, 5)).toBeCloseTo(32 / 75);
    });
  
    it("refuse un gain de stabilisation négatif ou infini", () => {
      expect(() => minShutterSeconds(50, -1)).toThrow(RangeError);
      expect(() => minShutterSeconds(50, Number.POSITIVE_INFINITY)).toThrow(RangeError);
    });
  });
