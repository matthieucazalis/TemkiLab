// Session du simulateur = l'état (SimulatorState, ce qu'on sauvegardera dans un
// preset) + les choix du catalogue (quel boîtier, quel objectif).
// Les règles restent dans reducer.ts ; ici on ajoute seulement la sélection.
// Fonctions pures, sans React : le hook et les tests s'en servent tels quels.
import {
  applyAction,
  normalizeState,
  type LensConstraint,
  type ProfileConstraint,
  type SimulatorAction,
  type SimulatorConstraints,
} from "./reducer";
import type { SensorKind } from "./readout";
import {
  DEFAULT_SIMULATOR_STATE,
  type SimulatorState,
} from "@/lib/validators/simulator";

// Une ligne du catalogue (celle que renvoie catalog.service) est acceptée
// telle quelle : ces types ne décrivent que les champs dont l'écran se sert.
export type CatalogProfile = ProfileConstraint & {
  id: string;
  name: string;
  sensorType: SensorKind;
  hasStabilization: boolean;
  stabilizationStops: number;
};

export type CatalogLens = LensConstraint & {
  id: string;
  brand: string;
  model: string;
  type: "ZOOM" | "PRIME";
  coverage: SensorKind | null;
};

export type Catalog = {
  profiles: readonly CatalogProfile[];
  lenses: readonly CatalogLens[];
};

export type SimulatorSession = {
  sim: SimulatorState;
  profileId: string | null;
  lensId: string | null;
};

export type SessionAction =
  | SimulatorAction
  | { type: "selectProfile"; id: string | null }
  | { type: "selectLens"; id: string | null }
  | { type: "reset" };

export const INITIAL_SESSION: SimulatorSession = {
  sim: DEFAULT_SIMULATOR_STATE,
  profileId: null,
  lensId: null,
};

export type Selection = {
  profile: CatalogProfile | null;
  lens: CatalogLens | null;
  constraints: SimulatorConstraints;
};

// Retrouve le boîtier et l'objectif choisis. Un identifiant inconnu (catalogue
// modifié entre-temps) donne simplement « aucun choix ».
export function resolveSelection(
  session: SimulatorSession,
  catalog: Catalog,
): Selection {
  const profile =
    catalog.profiles.find((p) => p.id === session.profileId) ?? null;
  const lens = catalog.lenses.find((l) => l.id === session.lensId) ?? null;
  return { profile, lens, constraints: { profile, lens } };
}

export function applySessionAction(
  session: SimulatorSession,
  action: SessionAction,
  catalog: Catalog,
): SimulatorSession {
  switch (action.type) {
    case "reset":
      return INITIAL_SESSION;

    case "selectProfile": {
      const known = catalog.profiles.some((p) => p.id === action.id);
      if (action.id !== null && !known) return session;
      const next = { ...session, profileId: action.id };
      // Le nouveau boîtier peut rendre l'état invalide (ratio non débloqué…) :
      // on le remet dans les règles.
      const { constraints } = resolveSelection(next, catalog);
      return { ...next, sim: normalizeState(next.sim, constraints) };
    }

    case "selectLens": {
      const known = catalog.lenses.some((l) => l.id === action.id);
      if (action.id !== null && !known) return session;
      const next = { ...session, lensId: action.id };
      // Le nouvel objectif replace la focale et l'ouverture dans sa plage.
      const { constraints } = resolveSelection(next, catalog);
      return { ...next, sim: normalizeState(next.sim, constraints) };
    }

    default: {
      const { constraints } = resolveSelection(session, catalog);
      const sim = applyAction(session.sim, action, constraints);
      // Même référence si rien n'a changé : React ne refait aucun rendu.
      return sim === session.sim ? session : { ...session, sim };
    }
  }
}
