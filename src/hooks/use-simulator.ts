"use client";

import { useMemo, useReducer } from "react";
import { computeReadout } from "@/lib/simulator/readout";
import {
  applySessionAction,
  INITIAL_SESSION,
  resolveSelection,
  type Catalog,
  type SessionAction,
  type SimulatorSession,
} from "@/lib/simulator/session";

// Branche la logique pure (session.ts) sur React : un état, des actions, et
// les valeurs déjà calculées pour l'affichage.
export function useSimulator(catalog: Catalog) {
  const [session, dispatch] = useReducer(
    (current: SimulatorSession, action: SessionAction) =>
      applySessionAction(current, action, catalog),
    INITIAL_SESSION,
  );

  const selection = useMemo(
    () => resolveSelection(session, catalog),
    [session, catalog],
  );
  const readout = useMemo(
    () => computeReadout(session.sim, selection.profile),
    [session.sim, selection.profile],
  );

  return {
    sim: session.sim,
    dispatch,
    profile: selection.profile,
    lens: selection.lens,
    readout,
  };
}
