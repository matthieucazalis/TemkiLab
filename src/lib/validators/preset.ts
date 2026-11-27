import { z } from "zod";
import { hasForbiddenChars } from "./text";
import { simulatorStateSchema } from "./simulator";

export const PRESET_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  perUser: 50, // setups enregistrés par compte
} as const;

// Les messages d'erreur sont des clés de traduction (voir validators/messages.ts)
export const presetNameSchema = z
  .string()
  .trim()
  .min(PRESET_LIMITS.nameMin, "validation.min2")
  .max(PRESET_LIMITS.nameMax)
  .refine((v) => !hasForbiddenChars(v), "validation.forbiddenChars");

const idSchema = z.string().min(1).max(64);

// Ce que le navigateur envoie pour enregistrer un setup. L'état complet est
// revalidé ici : le serveur ne fait jamais confiance au client.
export const savePresetSchema = z.strictObject({
  name: presetNameSchema,
  state: simulatorStateSchema,
  lensId: idSchema.nullable(),
  cameraProfileId: idSchema.nullable(),
});

export type SavePresetInput = z.infer<typeof savePresetSchema>;

// z.object (et non strictObject) : un formulaire Next ajoute ses propres champs
export const renamePresetSchema = z.object({
  id: idSchema,
  name: presetNameSchema,
});

export const presetIdSchema = idSchema;
