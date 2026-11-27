import { describe, expect, it } from "vitest";
import { parsePresetState, restoreSession, summarizePreset } from "./preset";
import { INITIAL_SESSION, type Catalog } from "./session";
import { DEFAULT_SIMULATOR_STATE } from "@/lib/validators/simulator";

const catalog: Catalog = {
  profiles: [
    {
      id: "reflex",
      name: "Reflex APS-C",
      sensorType: "APS_C",
      cropFactor: 1.5,
      nativeRatio: "3:2",
      unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
      hasStabilization: false,
      stabilizationStops: 0,
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
  ],
};

const saved = {
  ...DEFAULT_SIMULATOR_STATE,
  mode: "PROFILE" as const,
  sceneId: "portrait",
  focal: 135,
  aperture: 4,
};

describe("parsePresetState", () => {
  it("accepte un état valide", () => {
    expect(parsePresetState(saved)?.focal).toBe(135);
  });

  it("refuse un état corrompu, d'une autre version ou absent", () => {
    expect(parsePresetState({ focal: "beaucoup" })).toBeNull();
    expect(parsePresetState({ ...saved, version: 2 })).toBeNull();
    expect(parsePresetState(null)).toBeNull();
  });
});

describe("restoreSession", () => {
  it("retrouve exactement les réglages enregistrés", () => {
    const result = restoreSession(
      { state: saved, lensId: "tele", cameraProfileId: "reflex" },
      catalog,
    );
    expect(result.profileId).toBe("reflex");
    expect(result.lensId).toBe("tele");
    expect(result.sim).toEqual(saved);
  });

  it("oublie un objectif ou un boîtier disparus du catalogue", () => {
    const result = restoreSession(
      { state: saved, lensId: "supprimé", cameraProfileId: "supprimé" },
      catalog,
    );
    expect(result.lensId).toBeNull();
    expect(result.profileId).toBeNull();
    expect(result.sim.focal).toBe(135);
  });

  it("remet dans les règles un état que le catalogue actuel ne permet plus", () => {
    const tooLong = { ...saved, focal: 500 };
    const result = restoreSession(
      { state: tooLong, lensId: "tele", cameraProfileId: "reflex" },
      catalog,
    );
    expect(result.sim.focal).toBe(200);
  });

  it("état illisible : session de départ", () => {
    const result = restoreSession(
      { state: "n'importe quoi", lensId: "tele", cameraProfileId: null },
      catalog,
    );
    expect(result).toBe(INITIAL_SESSION);
  });
});

describe("summarizePreset", () => {
  it("résume les réglages visibles sur une vignette", () => {
    expect(summarizePreset(saved)).toEqual({
      sceneId: "portrait",
      mode: "PROFILE",
      focal: 135,
      aperture: 4,
      ratio: "3:2",
      orientation: "landscape",
    });
  });

  it("état illisible : null", () => {
    expect(summarizePreset({})).toBeNull();
  });
});
