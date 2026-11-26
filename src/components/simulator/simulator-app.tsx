"use client";

import { useMemo } from "react";
import { ControlPanel } from "@/components/simulator/control-panel";
import { PreviewFrame } from "@/components/simulator/preview-frame";
import { ReadoutPanel } from "@/components/simulator/readout-panel";
import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { useSimulator } from "@/hooks/use-simulator";
import { isBelowReference, zoomFactor } from "@/lib/optics/formulas";
import { aspectRatio } from "@/lib/optics/ratios";
import { REFERENCE_FOCAL_EQ } from "@/lib/simulator/controls";
import { lensCoversSensor } from "@/lib/simulator/readout";
import type { CatalogLens, CatalogProfile } from "@/lib/simulator/session";

export function SimulatorApp({
  profiles,
  lenses,
}: {
  profiles: CatalogProfile[];
  lenses: CatalogLens[];
}) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];

  const catalog = useMemo(() => ({ profiles, lenses }), [profiles, lenses]);
  const { sim, dispatch, profile, lens, readout } = useSimulator(catalog);

  const zoom = zoomFactor(readout.focalEq, REFERENCE_FOCAL_EQ);
  const aspect = aspectRatio(sim.ratio.value, sim.ratio.orientation);

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

  return (
    <div className="space-y-4">
      {profiles.length === 0 && lenses.length === 0 && (
        <p
          role="status"
          className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground"
        >
          {t("simulator.emptyCatalog")}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <div className="h-[min(62vh,34rem)] rounded-xl bg-muted/50 p-4 ring-1 ring-foreground/10">
            <PreviewFrame
              aspect={aspect}
              zoom={zoom}
              label={t("simulator.preview.label", {
                zoom: zoom.toLocaleString(tag, { maximumFractionDigits: 1 }),
                ratio: sim.ratio.value,
              })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("simulator.preview.note")}
          </p>
          <ReadoutPanel readout={readout} warnings={warnings} />
        </div>

        <ControlPanel
          sim={sim}
          profiles={profiles}
          lenses={lenses}
          profile={profile}
          lens={lens}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
