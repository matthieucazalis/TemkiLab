import { describe, expect, it } from "vitest";
import {
  presetNameSchema,
  renamePresetSchema,
  savePresetSchema,
} from "./preset";
import { DEFAULT_SIMULATOR_STATE } from "./simulator";

const valid = {
  name: "Portrait 85 mm",
  state: DEFAULT_SIMULATOR_STATE,
  lensId: "lens_1",
  cameraProfileId: null,
};

describe("presetNameSchema", () => {
  it("accepte un nom correct et retire les espaces autour", () => {
    expect(presetNameSchema.parse("  Mon setup  ")).toBe("Mon setup");
  });

  it("refuse un nom trop court, avec la bonne clé de traduction", () => {
    const result = presetNameSchema.safeParse("a");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("validation.min2");
  });

  it("refuse un nom de plus de 60 caractères", () => {
    expect(presetNameSchema.safeParse("a".repeat(61)).success).toBe(false);
    expect(presetNameSchema.safeParse("a".repeat(60)).success).toBe(true);
  });

  it("refuse les caractères de contrôle et invisibles", () => {
    expect(presetNameSchema.safeParse("nom\u0000piégé").success).toBe(false);
    expect(presetNameSchema.safeParse("nom\u202Epiégé").success).toBe(false);
  });
});

describe("savePresetSchema", () => {
  it("accepte une demande complète", () => {
    expect(savePresetSchema.safeParse(valid).success).toBe(true);
  });

  it("accepte l'absence de boîtier et d'objectif (null)", () => {
    expect(
      savePresetSchema.safeParse({ ...valid, lensId: null, cameraProfileId: null })
        .success,
    ).toBe(true);
  });

  it("refuse un état invalide (focale hors bornes)", () => {
    const state = { ...DEFAULT_SIMULATOR_STATE, focal: 99999 };
    expect(savePresetSchema.safeParse({ ...valid, state }).success).toBe(false);
  });

  it("refuse un champ inconnu", () => {
    expect(savePresetSchema.safeParse({ ...valid, userId: "autre" }).success).toBe(
      false,
    );
  });

  it("refuse un identifiant vide ou démesuré", () => {
    expect(savePresetSchema.safeParse({ ...valid, lensId: "" }).success).toBe(false);
    expect(
      savePresetSchema.safeParse({ ...valid, cameraProfileId: "x".repeat(65) }).success,
    ).toBe(false);
  });
});

describe("renamePresetSchema", () => {
  it("ignore les champs ajoutés par le formulaire", () => {
    const result = renamePresetSchema.safeParse({
      id: "p1",
      name: "Nouveau nom",
      $ACTION_ID_abc: "",
    });
    expect(result.success).toBe(true);
  });

  it("refuse un nom invalide", () => {
    expect(renamePresetSchema.safeParse({ id: "p1", name: "x" }).success).toBe(false);
  });
});
