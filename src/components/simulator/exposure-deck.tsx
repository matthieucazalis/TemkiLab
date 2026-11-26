"use client";

import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import {
  apertureFloor,
  availableApertures,
  focalRange,
} from "@/lib/simulator/controls";
import type { CatalogLens, SessionAction } from "@/lib/simulator/session";
import type { SimulatorState } from "@/lib/validators/simulator";

// Sous le viseur : les deux bagues de l'objectif.
// - la règle de focale (on la fait glisser comme une bague de zoom)
// - la bague d'ouverture (les valeurs f/ sous forme de crans)
export function ExposureDeck({
  sim,
  lens,
  dispatch,
}: {
  sim: SimulatorState;
  lens: CatalogLens | null;
  dispatch: (action: SessionAction) => void;
}) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];
  const number = (value: number, maxDigits = 2) =>
    value.toLocaleString(tag, { maximumFractionDigits: maxDigits });

  const range = focalRange(sim.mode, lens);
  const floor = apertureFloor(sim.mode, lens);
  const apertures = availableApertures(floor, sim.aperture);

  return (
    <div className="grid gap-x-8 gap-y-4 px-4 py-4 sm:px-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-1">
        <div className="flex items-baseline justify-between gap-3">
          <label
            htmlFor="sim-focal"
            className="text-xs font-medium text-stage-muted"
          >
            {t("simulator.focal.label")}
          </label>
          <output
            htmlFor="sim-focal"
            className="font-mono text-2xl font-semibold tabular-nums"
          >
            {number(sim.focal, 1)}
            <span className="ml-1 text-sm font-normal text-stage-muted">
              mm
            </span>
          </output>
        </div>
        <div className="relative">
          <div className="focal-ticks pointer-events-none absolute inset-x-0 bottom-0 h-5" />
          <input
            id="sim-focal"
            type="range"
            aria-label={t("simulator.stage.focalRing")}
            min={range.min}
            max={range.max}
            step={1}
            value={sim.focal}
            disabled={range.locked}
            onChange={(event) =>
              dispatch({ type: "setFocal", focal: event.target.valueAsNumber })
            }
            className="dial relative block w-full"
          />
        </div>
        <div className="flex justify-between font-mono text-[0.7rem] text-stage-muted tabular-nums">
          <span>{range.min} mm</span>
          {range.locked && <span>{t("simulator.focal.locked")}</span>}
          <span>{range.max} mm</span>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <span
            id="sim-aperture-label"
            className="text-xs font-medium text-stage-muted"
          >
            {t("simulator.aperture.label")}
          </span>
          <output className="font-mono text-2xl font-semibold tabular-nums">
            <span className="mr-0.5 text-sm font-normal text-stage-muted">
              f/
            </span>
            {number(sim.aperture)}
          </output>
        </div>
        <div
          role="group"
          aria-labelledby="sim-aperture-label"
          className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:thin]"
        >
          {apertures.map((value) => {
            const active = value === sim.aperture;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  dispatch({ type: "setAperture", aperture: value })
                }
                className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-xs tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-coat-b ${
                  active
                    ? "coat-ring bg-stage-fg/10 text-stage-fg"
                    : "text-stage-muted hover:bg-stage-fg/5 hover:text-stage-fg"
                }`}
              >
                {number(value)}
              </button>
            );
          })}
        </div>
        {floor !== null && (
          <p className="text-[0.7rem] text-stage-muted">
            {t("simulator.aperture.limit", { value: number(floor) })}
          </p>
        )}
      </div>
    </div>
  );
}
