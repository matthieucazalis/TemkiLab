// Du setup enregistré à la session du simulateur, et inversement : fonctions
// pures, sans React ni base de données.
import { normalizeState } from "./reducer";
import {
  INITIAL_SESSION,
  resolveSelection,
  type Catalog,
  type SimulatorSession,
} from "./session";
import {
  simulatorStateSchema,
  type SimulatorState,
} from "@/lib/validators/simulator";

// Ce que la base conserve d'un setup (le champ `state` est du JSON : on ne lui
// fait pas confiance, il est revalidé à chaque lecture).
export type StoredPreset = {
  state: unknown;
  lensId: string | null;
  cameraProfileId: string | null;
};

// État lisible d'un setup, ou null s'il est corrompu ou d'une ancienne version.
export function parsePresetState(state: unknown): SimulatorState | null {
  const parsed = simulatorStateSchema.safeParse(state);
  return parsed.success ? parsed.data : null;
}

// Retrouve exactement les réglages d'un setup. Un boîtier ou un objectif
// supprimé du catalogue depuis est simplement oublié, et l'état est remis
// dans les règles de ce qui reste. Un état illisible donne la session de départ.
export function restoreSession(
  preset: StoredPreset,
  catalog: Catalog,
): SimulatorSession {
  const sim = parsePresetState(preset.state);
  if (!sim) return INITIAL_SESSION;

  const session: SimulatorSession = {
    sim,
    profileId:
      catalog.profiles.find((p) => p.id === preset.cameraProfileId)?.id ?? null,
    lensId: catalog.lenses.find((l) => l.id === preset.lensId)?.id ?? null,
  };
  const { constraints } = resolveSelection(session, catalog);
  return { ...session, sim: normalizeState(session.sim, constraints) };
}

export type PresetSummary = {
  sceneId: string;
  mode: SimulatorState["mode"];
  focal: number;
  aperture: number;
  ratio: string;
  orientation: SimulatorState["ratio"]["orientation"];
};

// Les réglages à afficher sur une vignette ; null si l'état est illisible.
export function summarizePreset(state: unknown): PresetSummary | null {
  const sim = parsePresetState(state);
  if (!sim) return null;
  return {
    sceneId: sim.sceneId,
    mode: sim.mode,
    focal: sim.focal,
    aperture: sim.aperture,
    ratio: sim.ratio.value,
    orientation: sim.ratio.orientation,
  };
}
