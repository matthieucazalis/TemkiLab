import { describe, expect, it } from "vitest";
import {
  DEFAULT_SIMULATOR_STATE,
  simulatorStateSchema,
} from "./simulator";

const accepts = (value: unknown) => simulatorStateSchema.safeParse(value).success;

const withChange = (change: Record<string, unknown>) => ({
  ...DEFAULT_SIMULATOR_STATE,
  ...change,
});

describe("simulatorStateSchema", () => {
  it("accepte l'état par défaut", () => {
    expect(accepts(DEFAULT_SIMULATOR_STATE)).toBe(true);
  });

  it("accepte un point de mise au point", () => {
    expect(accepts(withChange({ focusPoint: { x: 0.4, y: 0.6 } }))).toBe(true);
  });

  it("refuse un champ inconnu", () => {
    expect(accepts(withChange({ pirate: "x".repeat(1000) }))).toBe(false);
  });

  it("refuse une autre version que 1", () => {
    expect(accepts(withChange({ version: 2 }))).toBe(false);
  });

  it("refuse un champ obligatoire manquant", () => {
    const { focal, ...sansFocale } = DEFAULT_SIMULATOR_STATE;
    void focal;
    expect(accepts(sansFocale)).toBe(false);
  });

  it("refuse un mode inconnu", () => {
    expect(accepts(withChange({ mode: "EXPERT" }))).toBe(false);
  });

  describe("sceneId", () => {
    it.each(["local", "stickman", "paysage-urbain-1"])("accepte %s", (id) => {
      expect(accepts(withChange({ sceneId: id }))).toBe(true);
    });

    it.each(["", "Local", "a b", "../secret", "-debut"])(
      "refuse %j",
      (id) => {
        expect(accepts(withChange({ sceneId: id }))).toBe(false);
      },
    );
  });

  describe("bornes numériques", () => {
    it.each([0, 0.5, 2001, -10, Number.NaN])("refuse la focale %s", (focal) => {
      expect(accepts(withChange({ focal }))).toBe(false);
    });

    it.each([0.1, 100])("refuse l'ouverture f/%s", (aperture) => {
      expect(accepts(withChange({ aperture }))).toBe(false);
    });

    it("accepte les bornes exactes", () => {
      expect(accepts(withChange({ focal: 1, aperture: 0.7, tilt: -45 }))).toBe(
        true,
      );
      expect(accepts(withChange({ focal: 2000, aperture: 64, tilt: 45 }))).toBe(
        true,
      );
    });

    it("refuse une inclinaison de 90°", () => {
      expect(accepts(withChange({ tilt: 90 }))).toBe(false);
    });

    it("refuse un point de mise au point hors de l'image", () => {
      expect(accepts(withChange({ focusPoint: { x: 1.5, y: 0.5 } }))).toBe(
        false,
      );
      expect(accepts(withChange({ focusPoint: { x: 0.5, y: -0.1 } }))).toBe(
        false,
      );
    });
  });

  describe("ratio", () => {
    it.each(["1:1", "3:2", "16:9", "5:7"])("accepte %s", (value) => {
      const ratio = { value, orientation: "portrait" };
      expect(accepts(withChange({ ratio }))).toBe(true);
    });

    it.each(["abc", "3-2", "0:5", "3:", "100:1"])("refuse %j", (value) => {
      const ratio = { value, orientation: "landscape" };
      expect(accepts(withChange({ ratio }))).toBe(false);
    });

    it("refuse une orientation inconnue", () => {
      const ratio = { value: "3:2", orientation: "carre" };
      expect(accepts(withChange({ ratio }))).toBe(false);
    });
  });
});