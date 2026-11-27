import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PRESET_LIMITS, type SavePresetInput } from "@/lib/validators/preset";

export class PresetNotFoundError extends Error {}
export class PresetLimitError extends Error {}

const presetSelect = {
  id: true,
  name: true,
  isFavorite: true,
  state: true,
  createdAt: true,
  lensId: true,
  cameraProfileId: true,
} as const;

// Règle de sécurité du cahier des charges : un utilisateur ne lit et ne modifie
// que SES presets. Chaque requête ci-dessous filtre donc sur userId, jamais
// sur l'identifiant du preset seul.

export async function createPreset(userId: string, input: SavePresetInput) {
  const count = await prisma.simulationPreset.count({ where: { userId } });
  if (count >= PRESET_LIMITS.perUser) throw new PresetLimitError();

  // Un identifiant inconnu (objectif supprimé entre-temps) serait refusé par la
  // clé étrangère : on l'ignore plutôt que de faire échouer l'enregistrement.
  const [lens, profile] = await Promise.all([
    input.lensId
      ? prisma.lens.findUnique({
          where: { id: input.lensId },
          select: { id: true },
        })
      : null,
    input.cameraProfileId
      ? prisma.cameraProfile.findUnique({
          where: { id: input.cameraProfileId },
          select: { id: true },
        })
      : null,
  ]);

  return prisma.simulationPreset.create({
    data: {
      userId,
      name: input.name,
      state: input.state as Prisma.InputJsonObject,
      lensId: lens?.id ?? null,
      cameraProfileId: profile?.id ?? null,
    },
    select: presetSelect,
  });
}

// Les favoris d'abord, puis les plus récents.
export async function listPresets(userId: string) {
  return prisma.simulationPreset.findMany({
    where: { userId },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
    select: {
      ...presetSelect,
      lens: { select: { brand: true, model: true } },
      cameraProfile: { select: { name: true } },
    },
  });
}

// null si le preset n'existe pas OU appartient à quelqu'un d'autre : on ne
// révèle jamais l'existence du preset d'un autre compte.
export async function getPreset(userId: string, id: string) {
  return prisma.simulationPreset.findFirst({
    where: { id, userId },
    select: presetSelect,
  });
}

export async function renamePreset(userId: string, id: string, name: string) {
  const result = await prisma.simulationPreset.updateMany({
    where: { id, userId },
    data: { name },
  });
  if (result.count === 0) throw new PresetNotFoundError();
}

export async function setPresetFavorite(
  userId: string,
  id: string,
  isFavorite: boolean,
) {
  const result = await prisma.simulationPreset.updateMany({
    where: { id, userId },
    data: { isFavorite },
  });
  if (result.count === 0) throw new PresetNotFoundError();
}

export async function deletePreset(userId: string, id: string) {
  const result = await prisma.simulationPreset.deleteMany({
    where: { id, userId },
  });
  if (result.count === 0) throw new PresetNotFoundError();
}
