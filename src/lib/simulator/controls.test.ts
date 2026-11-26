import { describe, expect, it } from "vitest";
import {
  apertureFloor,
  availableApertures,
  focalRange,
  GENERAL_FOCAL_RANGE,
  STANDARD_APERTURES,
} from "./controls";

const tele = { focalMin: 70, focalMax: 200, maxAperture: 2.8 };
const prime = { focalMin: 85, focalMax: 85, maxAperture: 1.4 };

describe("focalRange", () => {
  it("mode Général : plage large, jamais verrouillée", () => {
    expect(focalRange("GENERAL", null)).toEqual({
      ...GENERAL_FOCAL_RANGE,
      locked: false,
    });
  });

  it("mode Général : l'objectif choisi n'impose rien", () => {
    expect(focalRange("GENERAL", tele).min).toBe(GENERAL_FOCAL_RANGE.min);
  });

  it("mode Profil sans objectif : plage large", () => {
    expect(focalRange("PROFILE", null).max).toBe(GENERAL_FOCAL_RANGE.max);
  });

  it("mode Profil avec un zoom : la plage de l'objectif", () => {
    expect(focalRange("PROFILE", tele)).toEqual({
      min: 70,
      max: 200,
      locked: false,
    });
  });

  it("mode Profil avec une focale fixe : curseur verrouillé", () => {
    expect(focalRange("PROFILE", prime)).toEqual({
      min: 85,
      max: 85,
      locked: true,
    });
  });
});

describe("apertureFloor", () => {
  it("n'a de limite qu'en mode Profil avec un objectif", () => {
    expect(apertureFloor("GENERAL", tele)).toBeNull();
    expect(apertureFloor("PROFILE", null)).toBeNull();
    expect(apertureFloor("PROFILE", tele)).toBe(2.8);
  });
});

describe("availableApertures", () => {
  it("sans limite : toutes les ouvertures usuelles", () => {
    expect(availableApertures(null)).toEqual([...STANDARD_APERTURES]);
  });

  it("ne propose rien de plus ouvert que l'objectif", () => {
    expect(availableApertures(2.8)).toEqual([2.8, 4, 5.6, 8, 11, 16, 22]);
  });

  it("ajoute l'ouverture exacte d'un objectif hors valeurs usuelles", () => {
    expect(availableApertures(4.5)).toEqual([4.5, 5.6, 8, 11, 16, 22]);
  });

  it("ne répète pas une ouverture déjà présente", () => {
    const list = availableApertures(1.4);
    expect(list.filter((value) => value === 1.4)).toHaveLength(1);
  });

  it("garde la valeur courante dans le menu, même inhabituelle", () => {
    expect(availableApertures(null, 3.5)).toContain(3.5);
    expect(availableApertures(null, 3.5)).toEqual(
      [...STANDARD_APERTURES, 3.5].sort((a, b) => a - b),
    );
  });

  it("renvoie toujours une liste croissante", () => {
    const list = availableApertures(2, 3.5);
    expect(list).toEqual([...list].sort((a, b) => a - b));
  });
});
