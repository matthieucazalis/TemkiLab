"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PreferencesBar } from "@/components/preferences-bar";
import { ControlPanel } from "@/components/simulator/control-panel";
import { ExposureDeck } from "@/components/simulator/exposure-deck";
import { SceneView } from "@/components/simulator/scene-view";
import { ReadoutPanel } from "@/components/simulator/readout-panel";
import { SceneStrip } from "@/components/simulator/scene-strip";
import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { useSimulator } from "@/hooks/use-simulator";
import {
  focusDepthOf,
  layerBlurStd,
  visibleRegion,
} from "@/lib/simulator/framing";
import { findScene } from "@/lib/simulator/scenes";
import { isBelowReference, zoomFactor } from "@/lib/optics/formulas";
import { aspectRatio } from "@/lib/optics/ratios";
import { REFERENCE_FOCAL_EQ } from "@/lib/simulator/controls";
import { formatShutter, lensCoversSensor } from "@/lib/simulator/readout";
import type { CatalogLens, CatalogProfile } from "@/lib/simulator/session";

// Page d'accueil : le simulateur occupe tout l'écran.
//
//  ┌─ rail ─┬──────────── viseur ────────────┬─ panneau ─┐
//  │        │ HUD : 50 mm  f/2.8  1/60  3:2   │ Matériel  │
//  │        │                                │ Cadrage   │
//  │        │        [ cadre + repères ]     │ Équival.  │
//  │        │────────────────────────────────│           │
//  │        │ règle de focale | bague f/     │           │
//  │        │ pellicule de scènes            │           │
//  └────────┴────────────────────────────────┴───────────┘
// Sur mobile, le viseur prend l'écran et le panneau défile en dessous.
export function SimulatorApp({
  profiles,
  lenses,
  legalLinks,
}: {
  profiles: CatalogProfile[];
  lenses: CatalogLens[];
  legalLinks?: React.ReactNode;
}) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];
  const [showGrid, setShowGrid] = useState(false);

  const catalog = useMemo(() => ({ profiles, lenses }), [profiles, lenses]);
  const { sim, dispatch, profile, lens, readout } = useSimulator(catalog);

  const zoom = zoomFactor(readout.focalEq, REFERENCE_FOCAL_EQ);
  const aspect = aspectRatio(sim.ratio.value, sim.ratio.orientation);
  const number = (value: number) =>
    value.toLocaleString(tag, { maximumFractionDigits: 1 });

  // Du réglage à l'image : zone visible, plan net, flou de chaque couche.
  const scene = findScene(sim.sceneId);
  const region = visibleRegion(scene.width, scene.height, aspect, zoom);
  const focusPoint = sim.focusPoint ?? scene.focusTargets.subject;
  const focusDepth = focusDepthOf(scene, focusPoint);
  const blurs = scene.layers.map((layer) =>
    layerBlurStd({
      focalEq: readout.focalEq,
      apertureEq: readout.apertureEq,
      depth: layer.depth,
      focusDepth,
      regionHeight: region.h,
    }),
  );

  const warnings: string[] = [];
  if (
    sim.mode === "PROFILE" &&
    profile &&
    lens &&
    !lensCoversSensor(lens.coverage, profile.sensorType)
  ) {
    warnings.push(t("simulator.warning.lensCoverage"));
  }
  if (isBelowReference(readout.focalEq, REFERENCE_FOCAL_EQ)) {
    warnings.push(t("simulator.warning.belowReference"));
  }

  const hud = [
    { key: "focal", value: `${number(readout.focalEq)} mm` },
    { key: "aperture", value: `f/${number(readout.apertureEq)}` },
    { key: "shutter", value: formatShutter(readout.minShutterSeconds, tag) },
    { key: "ratio", value: sim.ratio.value },
  ];

  return (
    <div className="flex flex-col gap-3 p-3 lg:h-dvh lg:flex-row">
      <section
        aria-label={t("simulator.title")}
        className="stage-bg flex h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] min-h-[34rem] flex-col overflow-hidden rounded-3xl text-stage-fg md:h-[calc(100dvh-1.5rem)] lg:h-auto lg:min-h-0 lg:flex-1"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-stage-line px-4 py-3 sm:px-6">
          <h1 className="text-sm font-semibold">{t("simulator.title")}</h1>
          <ul
            aria-label={t("simulator.readout.title")}
            className="flex items-center divide-x divide-stage-line font-mono text-sm tabular-nums"
          >
            {hud.map(({ key, value }) => (
              <li key={key} className="px-3 first:pl-0 last:pr-0">
                {value}
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-pressed={showGrid}
            title={t(
              showGrid ? "simulator.stage.gridOn" : "simulator.stage.gridOff",
            )}
            onClick={() => setShowGrid((v) => !v)}
            className={`rounded-full px-3 py-1 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-coat-b ${
              showGrid
                ? "coat-ring bg-stage-fg/10"
                : "text-stage-muted hover:text-stage-fg"
            }`}
          >
            {t("simulator.stage.grid")}
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-8">
          {profiles.length === 0 && lenses.length === 0 && (
            <p
              role="status"
              className="absolute inset-x-4 top-3 z-10 rounded-md bg-stage-2/90 px-3 py-2 text-center text-xs text-stage-muted"
            >
              {t("simulator.emptyCatalog")}
            </p>
          )}
          <div className="focus-pull size-full">
            <SceneView
              scene={scene}
              region={region}
              blurs={blurs}
              focusPoint={focusPoint}
              showGrid={showGrid}
              onFocus={(point) => dispatch({ type: "setFocusPoint", point })}
              label={t("simulator.preview.label", {
                zoom: zoom.toLocaleString(tag, { maximumFractionDigits: 1 }),
                ratio: sim.ratio.value,
              })}
            />
          </div>
        </div>

        <p className="px-4 pb-2 text-center text-[0.7rem] text-stage-muted sm:px-6">
          {t("simulator.preview.note")}
        </p>

        <div className="border-t border-stage-line bg-stage-fg/5">
          <ExposureDeck sim={sim} lens={lens} dispatch={dispatch} />
          <SceneStrip sceneId={scene.id} dispatch={dispatch} />
        </div>
      </section>

      <aside className="flex flex-col overflow-hidden rounded-3xl bg-card lg:w-[22rem] lg:shrink-0 lg:overflow-y-auto xl:w-[24rem]">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
          <Link
            href="/setups"
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("nav.setups")}
          </Link>
          <PreferencesBar />
        </div>
        <div className="flex-1 space-y-7 p-5">
          <ControlPanel
            sim={sim}
            profiles={profiles}
            lenses={lenses}
            profile={profile}
            lens={lens}
            scene={scene}
            dispatch={dispatch}
          />
          <ReadoutPanel readout={readout} warnings={warnings} />
        </div>
        <div className="border-t">{legalLinks}</div>
      </aside>
    </div>
  );
}
