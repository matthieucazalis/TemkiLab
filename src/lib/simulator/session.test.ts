import { describe, expect, it } from "vitest";
import {
  applySessionAction,
  INITIAL_SESSION,
  resolveSelection,
  type Catalog,
  type SessionAction,
  type SimulatorSession,
} from "./session";

// Données tirées du seed : reflex APS-C et Micro 4/3, trois objectifs.
const catalog: Catalog = {
  profiles: [
    {
      id: "reflex",
      name: "Reflex APS-C initiation",
      sensorType: "APS_C",
      cropFactor: 1.5,
      nativeRatio: "3:2",
      unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
      hasStabilization: false,
      stabilizationStops: 0,
    },
    {
      id: "micro",
      name: "Compact expert Micro 4/3",
      sensorType: "MICRO_43",
      cropFactor: 2,
      nativeRatio: "4:3",
      unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "3:2"],
      hasStabilization: true,
      stabilizationStops: 6,
    },
  ],
  lenses: [
    {
      id: "tele",
      brand: "Sony",
      model: "FE 70-200mm F2.8 GM OSS II",
      type: "ZOOM",
      focalMin: 70,
      focalMax: 200,
      maxAperture: 2.8,
      coverage: "FULL_FRAME",
    },
    {
      id: "prime85",
      brand: "Sony",
      model: "FE 85mm F1.8",
      type: "PRIME",
      focalMin: 85,
      focalMax: 85,
      maxAperture: 1.8,
      coverage: "FULL_FRAME",
    },
  ],
};

const run = (session: SimulatorSession, ...actions: SessionAction[]) =>
  actions.reduce(
    (current, action) => applySessionAction(current, action, catalog),
    session,
  );

describe("resolveSelection", () => {
  it("retrouve le boîtier et l'objectif choisis", () => {
    const session = { ...INITIAL_SESSION, profileId: "reflex", lensId: "tele" };
    const { profile, lens } = resolveSelection(session, catalog);
    expect(profile?.id).toBe("reflex");
    expect(lens?.id).toBe("tele");
  });

  it("identifiant inconnu : aucun choix", () => {
    const session = { ...INITIAL_SESSION, profileId: "?", lensId: "?" };
    const { profile, lens, constraints } = resolveSelection(session, catalog);
    expect(profile).toBeNull();
    expect(lens).toBeNull();
    expect(constraints).toEqual({ profile: null, lens: null });
  });
});

describe("sélection du boîtier", () => {
  it("ignore un identifiant inconnu : session renvoyée telle quelle", () => {
    const result = run(INITIAL_SESSION, { type: "selectProfile", id: "?" });
    expect(result).toBe(INITIAL_SESSION);
  });

  it("mode Profil : un ratio non débloqué retombe sur le ratio natif", () => {
    const start = run(
      INITIAL_SESSION,
      { type: "setRatio", value: "5:7" },
      { type: "setMode", mode: "PROFILE" },
    );
    expect(start.sim.ratio.value).toBe("5:7"); // sans boîtier, tout est permis

    const result = run(start, { type: "selectProfile", id: "reflex" });
    expect(result.profileId).toBe("reflex");
    expect(result.sim.ratio.value).toBe("3:2");
  });

  it("mode Général : le choix est mémorisé sans toucher aux réglages", () => {
    const result = run(INITIAL_SESSION, { type: "selectProfile", id: "reflex" });
    expect(result.profileId).toBe("reflex");
    expect(result.sim).toEqual(INITIAL_SESSION.sim);
  });

  it("peut être effacé", () => {
    const result = run(
      INITIAL_SESSION,
      { type: "selectProfile", id: "reflex" },
      { type: "selectProfile", id: null },
    );
    expect(result.profileId).toBeNull();
  });
});

describe("sélection de l'objectif", () => {
  const inProfileMode = run(INITIAL_SESSION, { type: "setMode", mode: "PROFILE" });

  it("ignore un identifiant inconnu", () => {
    expect(run(inProfileMode, { type: "selectLens", id: "?" })).toBe(
      inProfileMode,
    );
  });

  it("mode Profil : la focale est replacée dans la plage du zoom", () => {
    const result = run(inProfileMode, { type: "selectLens", id: "tele" });
    expect(result.sim.focal).toBe(70); // 35 mm était hors plage
  });

  it("mode Profil : une focale fixe verrouille la focale", () => {
    const result = run(inProfileMode, { type: "selectLens", id: "prime85" });
    expect(result.sim.focal).toBe(85);
  });

  it("mode Profil : l'ouverture ne peut pas être plus grande que celle de l'objectif", () => {
    const open = run(inProfileMode, { type: "setAperture", aperture: 1 });
    expect(open.sim.aperture).toBe(1);
    const result = run(open, { type: "selectLens", id: "tele" });
    expect(result.sim.aperture).toBe(2.8);
  });

  it("choisi en mode Général, il s'applique au passage en mode Profil", () => {
    const chosen = run(INITIAL_SESSION, { type: "selectLens", id: "tele" });
    expect(chosen.sim.focal).toBe(35); // aucune contrainte en mode Général
    const result = run(chosen, { type: "setMode", mode: "PROFILE" });
    expect(result.sim.focal).toBe(70);
  });
});

describe("autres actions", () => {
  const ready = run(
    INITIAL_SESSION,
    { type: "selectProfile", id: "reflex" },
    { type: "selectLens", id: "tele" },
    { type: "setMode", mode: "PROFILE" },
  );

  it("respectent la plage de l'objectif choisi", () => {
    expect(run(ready, { type: "setFocal", focal: 100 }).sim.focal).toBe(100);
    expect(run(ready, { type: "setFocal", focal: 300 }).sim.focal).toBe(200);
  });

  it("n'acceptent que les ratios débloqués par le boîtier", () => {
    expect(run(ready, { type: "setRatio", value: "16:9" }).sim.ratio.value).toBe(
      "16:9",
    );
    expect(run(ready, { type: "setRatio", value: "5:7" })).toBe(ready);
  });

  it("une action sans effet renvoie la même session", () => {
    expect(run(ready, { type: "setFocal", focal: Number.NaN })).toBe(ready);
  });
});

describe("réinitialisation", () => {
  it("revient à la session de départ, choix compris", () => {
    const changed = run(
      INITIAL_SESSION,
      { type: "selectProfile", id: "micro" },
      { type: "selectLens", id: "prime85" },
      { type: "setMode", mode: "PROFILE" },
    );
    expect(run(changed, { type: "reset" })).toBe(INITIAL_SESSION);
  });
});
