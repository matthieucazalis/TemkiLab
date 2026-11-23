import { describe, expect, it } from "vitest";
import {
  applyAction,
  normalizeState,
  type LensConstraint,
  type ProfileConstraint,
  type SimulatorConstraints,
} from "./reducer";
import {
  DEFAULT_SIMULATOR_STATE,
  type SimulatorState,
} from "@/lib/validators/simulator";

const reflexApsc: ProfileConstraint = {
  cropFactor: 1.5,
  nativeRatio: "3:2",
  unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
};
const tele70200: LensConstraint = {
  focalMin: 70,
  focalMax: 200,
  maxAperture: 2.8,
};
const prime85: LensConstraint = {
  focalMin: 85,
  focalMax: 85,
  maxAperture: 1.4,
};

const withTele: SimulatorConstraints = { profile: reflexApsc, lens: tele70200 };

const general = DEFAULT_SIMULATOR_STATE;
const profile: SimulatorState = { ...general, mode: "PROFILE" };
const stickman: SimulatorState = { ...general, sceneId: "stickman" };

describe("focale", () => {
  it("applique la focale demandée en mode Général", () => {
    expect(applyAction(general, { type: "setFocal", focal: 85 }).focal).toBe(
      85,
    );
  });

  it("plafonne aux bornes absolues du simulateur", () => {
    expect(applyAction(general, { type: "setFocal", focal: 5000 }).focal).toBe(
      2000,
    );
    expect(applyAction(general, { type: "setFocal", focal: 0 }).focal).toBe(1);
  });

  it("ignore une valeur invalide : l'état est renvoyé tel quel", () => {
    expect(applyAction(general, { type: "setFocal", focal: Number.NaN })).toBe(
      general,
    );
  });

  it("mode Profil : reste dans la plage de l'objectif", () => {
    expect(
      applyAction(profile, { type: "setFocal", focal: 300 }, withTele).focal,
    ).toBe(200);
    expect(
      applyAction(profile, { type: "setFocal", focal: 100 }, withTele).focal,
    ).toBe(100);
  });

  it("mode Profil : replace une focale hors plage dès la normalisation", () => {
    expect(normalizeState(profile, withTele).focal).toBe(70);
  });

  it("mode Général : l'objectif choisi n'impose rien", () => {
    expect(
      applyAction(general, { type: "setFocal", focal: 300 }, withTele).focal,
    ).toBe(300);
  });

  it("focale fixe : la focale est verrouillée", () => {
    const constraints = { profile: reflexApsc, lens: prime85 };
    expect(
      applyAction(profile, { type: "setFocal", focal: 50 }, constraints).focal,
    ).toBe(85);
  });
});

describe("ouverture", () => {
  it("ne peut pas être plus grande que celle de l'objectif", () => {
    expect(
      applyAction(profile, { type: "setAperture", aperture: 1.4 }, withTele)
        .aperture,
    ).toBe(2.8);
  });

  it("accepte une ouverture plus fermée", () => {
    expect(
      applyAction(profile, { type: "setAperture", aperture: 5.6 }, withTele)
        .aperture,
    ).toBe(5.6);
  });

  it("plafonne à la borne absolue côté diaphragme fermé", () => {
    expect(
      applyAction(profile, { type: "setAperture", aperture: 100 }, withTele)
        .aperture,
    ).toBe(64);
  });

  it("mode Général : toutes les ouvertures sont libres", () => {
    expect(
      applyAction(general, { type: "setAperture", aperture: 1.4 }, withTele)
        .aperture,
    ).toBe(1.4);
  });
});

describe("ratio", () => {
  it("mode Général : accepte un ratio connu", () => {
    expect(
      applyAction(general, { type: "setRatio", value: "16:9" }).ratio.value,
    ).toBe("16:9");
  });

  it("ignore un ratio inconnu", () => {
    expect(applyAction(general, { type: "setRatio", value: "7:3" })).toBe(
      general,
    );
  });

  it("mode Profil : ignore un ratio non débloqué, accepte un débloqué", () => {
    expect(
      applyAction(profile, { type: "setRatio", value: "5:7" }, withTele),
    ).toBe(profile);
    expect(
      applyAction(profile, { type: "setRatio", value: "16:9" }, withTele).ratio
        .value,
    ).toBe("16:9");
  });

  it("passer en mode Profil bascule un ratio devenu interdit vers le natif, en gardant l'orientation", () => {
    const state: SimulatorState = {
      ...general,
      ratio: { value: "5:7", orientation: "portrait" },
    };
    const result = applyAction(
      state,
      { type: "setMode", mode: "PROFILE" },
      withTele,
    );
    expect(result.ratio).toEqual({ value: "3:2", orientation: "portrait" });
  });

  it("mode Profil sans profil choisi : se comporte comme le mode Général", () => {
    const state: SimulatorState = {
      ...general,
      ratio: { value: "5:7", orientation: "landscape" },
    };
    const none: SimulatorConstraints = { profile: null, lens: null };
    expect(
      applyAction(state, { type: "setMode", mode: "PROFILE" }, none).ratio
        .value,
    ).toBe("5:7");
  });

  it("l'inversion paysage/portrait est réversible", () => {
    const flipped = applyAction(general, { type: "flipOrientation" });
    expect(flipped.ratio.orientation).toBe("portrait");
    expect(
      applyAction(flipped, { type: "flipOrientation" }).ratio.orientation,
    ).toBe("landscape");
  });
});

describe("inclinaison", () => {
  it("est forcée à 0 hors de la scène Stickman", () => {
    expect(applyAction(general, { type: "setTilt", tilt: 20 }).tilt).toBe(0);
  });

  it("est appliquée et bornée sur la scène Stickman", () => {
    expect(applyAction(stickman, { type: "setTilt", tilt: 20 }).tilt).toBe(20);
    expect(applyAction(stickman, { type: "setTilt", tilt: 90 }).tilt).toBe(45);
  });

  it("revient à 0 quand on quitte la scène Stickman", () => {
    const tilted: SimulatorState = { ...stickman, tilt: 20 };
    expect(
      applyAction(tilted, { type: "setScene", sceneId: "paysage" }).tilt,
    ).toBe(0);
  });
});

describe("point de mise au point", () => {
  it("ramène un point hors de l'image sur le bord", () => {
    const result = applyAction(general, {
      type: "setFocusPoint",
      point: { x: 1.5, y: -1 },
    });
    expect(result.focusPoint).toEqual({ x: 1, y: 0 });
  });

  it("peut être effacé", () => {
    const placed: SimulatorState = {
      ...general,
      focusPoint: { x: 0.5, y: 0.5 },
    };
    expect(
      applyAction(placed, { type: "setFocusPoint", point: undefined })
        .focusPoint,
    ).toBeUndefined();
  });
});

describe("applyPatch", () => {
  it("applique plusieurs champs d'un coup", () => {
    const result = applyAction(general, {
      type: "applyPatch",
      patch: { focal: 85, aperture: 1.8 },
    });
    expect(result.focal).toBe(85);
    expect(result.aperture).toBe(1.8);
  });

  it("contrôle quand même les bornes", () => {
    expect(
      applyAction(general, { type: "applyPatch", patch: { focal: 5000 } })
        .focal,
    ).toBe(2000);
    expect(
      applyAction(
        profile,
        { type: "applyPatch", patch: { focal: 10 } },
        withTele,
      ).focal,
    ).toBe(70);
  });
});

describe("propriétés générales", () => {
  it("ne modifie jamais l'état reçu (fonction pure)", () => {
    const frozen = Object.freeze({
      ...general,
      ratio: Object.freeze({ ...general.ratio }),
    });
    const before = structuredClone(frozen);
    applyAction(frozen, { type: "setFocal", focal: 100 });
    applyAction(frozen, { type: "flipOrientation" });
    expect(frozen).toEqual(before);
  });

  it("normalizeState est idempotente : la rappeler ne change plus rien", () => {
    const once = normalizeState(profile, withTele);
    expect(normalizeState(once, withTele)).toEqual(once);
  });
});
