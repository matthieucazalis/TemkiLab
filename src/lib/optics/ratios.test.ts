import { describe, expect, it } from "vitest";
import {
  ALL_RATIOS,
  aspectRatio,
  availableRatios,
  defaultRatio,
  flipOrientation,
  isKnownRatio,
  isRatioAllowed,
  type RatioContext,
} from "./ratios";

const general: RatioContext = { mode: "GENERAL" };

const reflexApsc: RatioContext = {
  mode: "PROFILE",
  nativeRatio: "3:2",
  unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
};

const micro43: RatioContext = {
  mode: "PROFILE",
  nativeRatio: "4:3",
  unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "3:2"],
};

describe("isKnownRatio", () => {
  it("reconnaît tous les ratios de la liste", () => {
    for (const ratio of ALL_RATIOS) expect(isKnownRatio(ratio)).toBe(true);
  });

  it.each(["7:3", "3-2", "", "abc"])("refuse %j", (value) => {
    expect(isKnownRatio(value)).toBe(false);
  });
});

describe("aspectRatio", () => {
  it.each([
    ["3:2", "landscape", 1.5],
    ["3:2", "portrait", 2 / 3],
    ["16:9", "landscape", 16 / 9],
    ["16:9", "portrait", 9 / 16],
    ["1:1", "landscape", 1],
    ["1:1", "portrait", 1],
    ["3:5", "landscape", 5 / 3],
    ["3:5", "portrait", 3 / 5],
    ["5:7", "portrait", 5 / 7],
  ] as const)("%s en %s vaut %s", (value, orientation, expected) => {
    expect(aspectRatio(value, orientation)).toBeCloseTo(expected);
  });

  it("refuse un ratio inconnu", () => {
    expect(() => aspectRatio("7:3", "landscape")).toThrow(RangeError);
  });
});

describe("flipOrientation", () => {
  it("passe de paysage à portrait et inversement", () => {
    expect(flipOrientation("landscape")).toBe("portrait");
    expect(flipOrientation("portrait")).toBe("landscape");
  });

  it("revient à l'état de départ en l'appliquant deux fois", () => {
    expect(flipOrientation(flipOrientation("landscape"))).toBe("landscape");
  });
});

describe("availableRatios", () => {
  it("mode Général : aucun natif, tous les ratios en numériques", () => {
    expect(availableRatios(general)).toEqual({
      native: [],
      numeric: [...ALL_RATIOS],
    });
  });

  it("ne partage pas son tableau avec ALL_RATIOS", () => {
    availableRatios(general).numeric.pop();
    expect(availableRatios(general).numeric).toHaveLength(ALL_RATIOS.length);
  });

  it("reflex APS-C : natif 3:2, quatre recadrages dans l'ordre de la liste", () => {
    expect(availableRatios(reflexApsc)).toEqual({
      native: ["3:2"],
      numeric: ["4:3", "1:1", "16:9", "4:5"],
    });
  });

  it("Micro 4/3 : natif 4:3, le 3:2 devient un recadrage numérique", () => {
    expect(availableRatios(micro43)).toEqual({
      native: ["4:3"],
      numeric: ["3:2", "1:1", "16:9", "3:5", "4:5", "5:7"],
    });
  });

  it("ne répète pas le ratio natif dans les numériques", () => {
    const context: RatioContext = {
      mode: "PROFILE",
      nativeRatio: "3:2",
      unlockedRatios: ["3:2", "1:1"],
    };
    expect(availableRatios(context).numeric).toEqual(["1:1"]);
  });

  it("ignore les valeurs inconnues et les doublons de la base", () => {
    const context: RatioContext = {
      mode: "PROFILE",
      nativeRatio: "3:2",
      unlockedRatios: ["1:1", "1:1", "banane"],
    };
    expect(availableRatios(context).numeric).toEqual(["1:1"]);
  });

  it("refuse un ratio natif inconnu (donnée incohérente)", () => {
    const context: RatioContext = {
      mode: "PROFILE",
      nativeRatio: "9:9",
      unlockedRatios: [],
    };
    expect(() => availableRatios(context)).toThrow(RangeError);
  });
});

describe("isRatioAllowed", () => {
  it("mode Général : tous les ratios connus, rien d'autre", () => {
    for (const ratio of ALL_RATIOS) {
      expect(isRatioAllowed(ratio, general)).toBe(true);
    }
    expect(isRatioAllowed("7:3", general)).toBe(false);
  });

  it("reflex APS-C : accepte le natif et les débloqués", () => {
    expect(isRatioAllowed("3:2", reflexApsc)).toBe(true);
    expect(isRatioAllowed("16:9", reflexApsc)).toBe(true);
  });

  it("reflex APS-C : refuse un ratio non débloqué", () => {
    expect(isRatioAllowed("5:7", reflexApsc)).toBe(false);
    expect(isRatioAllowed("3:5", reflexApsc)).toBe(false);
  });
});

describe("defaultRatio", () => {
  it("mode Général : 3:2", () => {
    expect(defaultRatio(general)).toBe("3:2");
  });

  it("mode Profil : le ratio natif du capteur", () => {
    expect(defaultRatio(reflexApsc)).toBe("3:2");
    expect(defaultRatio(micro43)).toBe("4:3");
  });
});
