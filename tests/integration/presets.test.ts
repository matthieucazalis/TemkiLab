import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LensType, SensorType } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SIMULATOR_STATE } from "@/lib/validators/simulator";
import { PRESET_LIMITS } from "@/lib/validators/preset";
import { deleteAccount, exportUserData } from "@/services/account.service";
import {
  PresetLimitError,
  PresetNotFoundError,
  createPreset,
  deletePreset,
  getPreset,
  listPresets,
  renamePreset,
  setPresetFavorite,
} from "@/services/preset.service";
import { PASSWORD, cleanup, makeUser } from "./helpers";

const input = (name: string, extra = {}) => ({
  name,
  state: DEFAULT_SIMULATOR_STATE,
  lensId: null,
  cameraProfileId: null,
  ...extra,
});

describe("presets", () => {
  const ids: string[] = [];
  let lensId = "";

  beforeAll(async () => {
    // Un objectif de test, pour vérifier la liaison sans dépendre du seed
    const lens = await prisma.lens.create({
      data: {
        brand: "Test",
        model: `Test-${Date.now()}`,
        type: LensType.PRIME,
        focalMin: 50,
        focalMax: 50,
        maxAperture: 1.8,
        coverage: SensorType.FULL_FRAME,
        estimatedPrice: 1,
        priceUpdatedAt: new Date(),
      },
    });
    lensId = lens.id;
  });

  afterAll(async () => {
    await cleanup(ids);
    await prisma.lens.deleteMany({ where: { id: lensId } });
  });

  it("enregistre un setup et le retrouve avec ses réglages", async () => {
    const user = await makeUser("preset");
    ids.push(user.id);

    const created = await createPreset(user.id, input("Mon setup", { lensId }));
    const found = await getPreset(user.id, created.id);

    expect(found?.name).toBe("Mon setup");
    expect(found?.lensId).toBe(lensId);
    expect(found?.state).toEqual(JSON.parse(JSON.stringify(DEFAULT_SIMULATOR_STATE)));
  });

  it("ignore un objectif ou un boîtier inconnus au lieu d'échouer", async () => {
    const user = await makeUser("unknownlens");
    ids.push(user.id);

    const created = await createPreset(
      user.id,
      input("Sans lien", { lensId: "n-existe-pas", cameraProfileId: "non-plus" }),
    );
    expect(created.lensId).toBeNull();
    expect(created.cameraProfileId).toBeNull();
  });

  it("liste les favoris d'abord, puis les plus récents", async () => {
    const user = await makeUser("order");
    ids.push(user.id);

    const first = await createPreset(user.id, input("Premier"));
    await createPreset(user.id, input("Deuxième"));
    await setPresetFavorite(user.id, first.id, true);

    const names = (await listPresets(user.id)).map((p) => p.name);
    expect(names).toEqual(["Premier", "Deuxième"]);
  });

  it("renomme et supprime", async () => {
    const user = await makeUser("edit");
    ids.push(user.id);

    const created = await createPreset(user.id, input("Ancien nom"));
    await renamePreset(user.id, created.id, "Nouveau nom");
    expect((await getPreset(user.id, created.id))?.name).toBe("Nouveau nom");

    await deletePreset(user.id, created.id);
    expect(await getPreset(user.id, created.id)).toBeNull();
  });

  it("un utilisateur ne voit, ne modifie et ne supprime jamais les setups d'un autre", async () => {
    const owner = await makeUser("owner");
    const intruder = await makeUser("intruder");
    ids.push(owner.id, intruder.id);

    const secret = await createPreset(owner.id, input("Privé"));

    expect(await getPreset(intruder.id, secret.id)).toBeNull();
    expect(await listPresets(intruder.id)).toHaveLength(0);
    await expect(renamePreset(intruder.id, secret.id, "Piraté")).rejects.toThrow(
      PresetNotFoundError,
    );
    await expect(setPresetFavorite(intruder.id, secret.id, true)).rejects.toThrow(
      PresetNotFoundError,
    );
    await expect(deletePreset(intruder.id, secret.id)).rejects.toThrow(
      PresetNotFoundError,
    );

    // rien n'a bougé chez le propriétaire
    const intact = await getPreset(owner.id, secret.id);
    expect(intact?.name).toBe("Privé");
    expect(intact?.isFavorite).toBe(false);
  });

  it("refuse d'aller au-delà de la limite par compte", async () => {
    const user = await makeUser("limit");
    ids.push(user.id);

    await prisma.simulationPreset.createMany({
      data: Array.from({ length: PRESET_LIMITS.perUser }, (_, i) => ({
        userId: user.id,
        name: `Setup ${i}`,
        state: JSON.parse(JSON.stringify(DEFAULT_SIMULATOR_STATE)),
      })),
    });

    await expect(createPreset(user.id, input("De trop"))).rejects.toThrow(
      PresetLimitError,
    );
  });

  it("les setups sont inclus dans l'export RGPD", async () => {
    const user = await makeUser("export-presets");
    ids.push(user.id);
    await createPreset(user.id, input("À exporter"));

    const data = await exportUserData(user.id);
    expect(data.presets.map((p) => p.name)).toEqual(["À exporter"]);
  });

  it("la suppression du compte efface aussi les setups", async () => {
    const user = await makeUser("leaver-presets");
    ids.push(user.id);
    await createPreset(user.id, input("À effacer"));

    await deleteAccount(user.id, PASSWORD);

    expect(
      await prisma.simulationPreset.count({ where: { userId: user.id } }),
    ).toBe(0);
  });
});
