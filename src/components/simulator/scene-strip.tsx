"use client";

import { useT } from "@/i18n/client";
import type { SessionAction } from "@/lib/simulator/session";
import { SCENE_IDS, type SceneId } from "@/lib/simulator/scenes";

// Bandeau de scènes : les trois scènes illustrées sont sélectionnables, les
// autres du cahier des charges ont déjà leur place (désactivées).
const SOON = ["scenePackshot", "sceneSport", "sceneStickman"] as const;

export function SceneStrip({
  sceneId,
  dispatch,
}: {
  sceneId: SceneId;
  dispatch: (action: SessionAction) => void;
}) {
  const t = useT();
  const base =
    "relative flex h-14 w-24 flex-col justify-end rounded-xl p-2 text-left text-[0.7rem] outline-none focus-visible:ring-2 focus-visible:ring-coat-b";

  return (
    <div className="px-4 pb-4 sm:px-6">
      <div className="mb-1.5 text-xs font-medium text-stage-muted">
        {t("simulator.stage.scenes")}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-stage-fg/5 [scrollbar-width:none]">
        <ul className="flex min-w-max gap-1.5 p-2">
          {SCENE_IDS.map((id) => {
            const active = id === sceneId;
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch({ type: "setScene", sceneId: id })}
                  className={`${base} ${
                    active
                      ? "coat-ring bg-stage-2 text-stage-fg"
                      : "bg-stage-2/60 text-stage-muted hover:text-stage-fg"
                  }`}
                >
                  <span className="font-medium">
                    {t(`simulator.scene.${id}`)}
                  </span>
                </button>
              </li>
            );
          })}
          {SOON.map((key) => (
            <li key={key}>
              <button
                type="button"
                disabled
                className={`${base} bg-stage-2/40 text-stage-muted`}
              >
                <span className="font-medium">
                  {t(`simulator.stage.${key}`)}
                </span>
                <span className="text-[0.62rem] opacity-70">
                  {t("simulator.stage.sceneSoon")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
