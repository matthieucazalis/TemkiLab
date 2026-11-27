"use server";

import { revalidatePath } from "next/cache";
import { getT } from "@/i18n/server";
import { requireUser } from "@/lib/session";
import { firstIssueMessage } from "@/lib/validators/messages";
import {
  PRESET_LIMITS,
  presetIdSchema,
  renamePresetSchema,
  savePresetSchema,
} from "@/lib/validators/preset";
import {
  PresetLimitError,
  PresetNotFoundError,
  createPreset,
  deletePreset,
  renamePreset,
  setPresetFavorite,
} from "@/services/preset.service";

export type PresetResult = { error?: string; success?: string; id?: string };

// Enregistre l'état courant du simulateur. `input` vient du navigateur : il est
// entièrement revalidé ici.
export async function savePresetAction(input: unknown): Promise<PresetResult> {
  const [user, t] = await Promise.all([requireUser(), getT()]);
  const parsed = savePresetSchema.safeParse(input);
  if (!parsed.success) return { error: firstIssueMessage(t, parsed.error) };

  try {
    const preset = await createPreset(user.id, parsed.data);
    revalidatePath("/setups");
    return { success: t("setups.saved"), id: preset.id };
  } catch (e) {
    if (e instanceof PresetLimitError)
      return { error: t("setups.limitReached", { count: PRESET_LIMITS.perUser }) };
    throw e;
  }
}

export async function renamePresetAction(
  _prev: PresetResult | undefined,
  formData: FormData,
): Promise<PresetResult> {
  const [user, t] = await Promise.all([requireUser(), getT()]);
  const parsed = renamePresetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: firstIssueMessage(t, parsed.error) };

  try {
    await renamePreset(user.id, parsed.data.id, parsed.data.name);
  } catch (e) {
    if (e instanceof PresetNotFoundError) return { error: t("setups.notFound") };
    throw e;
  }
  revalidatePath("/setups");
  return { success: t("setups.renamed") };
}

export async function togglePresetFavoriteAction(
  id: string,
  isFavorite: boolean,
): Promise<PresetResult> {
  const [user, t] = await Promise.all([requireUser(), getT()]);
  const parsed = presetIdSchema.safeParse(id);
  if (!parsed.success) return { error: t("validation.invalid") };

  try {
    await setPresetFavorite(user.id, parsed.data, isFavorite === true);
  } catch (e) {
    if (e instanceof PresetNotFoundError) return { error: t("setups.notFound") };
    throw e;
  }
  revalidatePath("/setups");
  return {};
}

export async function deletePresetAction(id: string): Promise<PresetResult> {
  const [user, t] = await Promise.all([requireUser(), getT()]);
  const parsed = presetIdSchema.safeParse(id);
  if (!parsed.success) return { error: t("validation.invalid") };

  try {
    await deletePreset(user.id, parsed.data);
  } catch (e) {
    if (e instanceof PresetNotFoundError) return { error: t("setups.notFound") };
    throw e;
  }
  revalidatePath("/setups");
  return { success: t("setups.deleted") };
}
