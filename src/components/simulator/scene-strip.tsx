"use client";

import { useId } from "react";
import { SceneThumb } from "@/components/simulator/scene-layers";
import { useT } from "@/i18n/client";
import { findScene, resolveSceneId } from "@/lib/simulator/scenes";
import type { SessionAction } from "@/lib/simulator/session";

// Bandeau de scènes en forme de pellicule 35 mm.
// La mire et les scènes dessinées sont disponibles ; le Stickman 3D viendra
// plus tard (il garde sa place, désactivée, pour fixer le layout).
const TILES = [
  { id: "chart", key: "sceneChart", ready: true },
  { id: "landscape", key: "sceneLandscape", ready: true },
  { id: "portrait", key: "scenePortrait", ready: true },
  { id: "packshot", key: "scenePackshot", ready: true },
  { id: "sport", key: "sceneSport", ready: true },
  { id: "stickman", key: "sceneStickman", ready: false },
] as const;

export function SceneStrip({
  sceneId,
  dispatch,
}: {
  sceneId: string;
  dispatch: (action: SessionAction) => void;
}) {
  const t = useT();
  const uid = useId().replace(/:/g, "");
  const current = resolveSceneId(sceneId);

  return (
    <div className="px-4 pb-4 sm:px-6">
      <div className="mb-1.5 text-xs font-medium text-stage-muted">
        {t("simulator.stage.scenes")}
      </div>
      <div className="overflow-x-auto rounded-md bg-black/40 [scrollbar-width:none]">
        <div className="film-holes h-3.5 min-w-max" aria-hidden="true" />
        <ul className="flex min-w-max gap-1.5 px-2 py-1">
          {TILES.map(({ id, key, ready }) => {
            const active = ready && current === id;
            const scene = ready ? findScene(id) : null;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={!ready}
                  aria-pressed={active}
                  onClick={() => dispatch({ type: "setScene", sceneId: id })}
                  className={`relative flex h-14 w-24 flex-col justify-end overflow-hidden rounded-sm p-1.5 text-left text-[0.7rem] outline-none focus-visible:ring-2 focus-visible:ring-coat-b ${
                    active
                      ? "coat-ring bg-stage-2 text-stage-fg"
                      : ready
                        ? "bg-stage-2/70 text-stage-fg hover:bg-stage-2"
                        : "bg-stage-2/50 text-stage-muted"
                  }`}
                >
                  {scene && <SceneThumb scene={scene} idPrefix={`${uid}-${id}`} />}
                  {/* Pastille sombre : le nom reste lisible sur la vignette */}
                  <span className="relative w-fit rounded-sm bg-black/55 px-1 font-medium">
                    {t(`simulator.stage.${key}`)}
                  </span>
                  {!ready && (
                    <span className="relative text-[0.62rem] opacity-70">
                      {t("simulator.stage.sceneSoon")}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="film-holes h-3.5 min-w-max" aria-hidden="true" />
      </div>
    </div>
  );
}
