"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { availableRatios } from "@/lib/optics/ratios";
import type { Point, Scene } from "@/lib/simulator/scenes";
import { ratioContext } from "@/lib/simulator/reducer";
import type {
  CatalogLens,
  CatalogProfile,
  SessionAction,
} from "@/lib/simulator/session";
import type { SimulatorState } from "@/lib/validators/simulator";

const SELECT_CLASS =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

type Props = {
  sim: SimulatorState;
  profiles: readonly CatalogProfile[];
  lenses: readonly CatalogLens[];
  profile: CatalogProfile | null;
  lens: CatalogLens | null;
  scene: Scene;
  dispatch: (action: SessionAction) => void;
};

// Regroupe les objectifs par marque (la liste arrive déjà triée par marque).
function groupByBrand(lenses: readonly CatalogLens[]) {
  const groups = new Map<string, CatalogLens[]>();
  for (const lens of lenses) {
    const group = groups.get(lens.brand) ?? [];
    group.push(lens);
    groups.set(lens.brand, group);
  }
  return [...groups];
}

export function ControlPanel({
  sim,
  profiles,
  lenses,
  profile,
  lens,
  scene,
  dispatch,
}: Props) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];
  const number = (value: number, maxDigits = 2) =>
    value.toLocaleString(tag, { maximumFractionDigits: maxDigits });

  const isProfile = sim.mode === "PROFILE";
  const ratios = availableRatios(ratioContext(sim.mode, { profile, lens }));
  const currentFocus = sim.focusPoint ?? scene.focusTargets.subject;
  const sameFocus = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
  const lensGroups = useMemo(() => groupByBrand(lenses), [lenses]);

  function lensLabel(item: CatalogLens) {
    const focal =
      item.focalMin === item.focalMax
        ? `${item.focalMin} mm`
        : `${item.focalMin}–${item.focalMax} mm`;
    return `${item.model}, ${focal}, f/${number(item.maxAperture)}`;
  }

  return (
    <div className="space-y-7">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold">
          {t("simulator.panel.gear")}
        </legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          {(["GENERAL", "PROFILE"] as const).map((mode) => (
            <Button
              key={mode}
              type="button"
              variant={sim.mode === mode ? "default" : "ghost"}
              aria-pressed={sim.mode === mode}
              onClick={() => dispatch({ type: "setMode", mode })}
            >
              {t(
                mode === "GENERAL"
                  ? "simulator.mode.general"
                  : "simulator.mode.profile",
              )}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {t(
            isProfile
              ? "simulator.mode.profileHint"
              : "simulator.mode.generalHint",
          )}
        </p>
      </fieldset>

      {isProfile && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="sim-camera">{t("simulator.camera.label")}</Label>
            <select
              id="sim-camera"
              className={SELECT_CLASS}
              value={profile?.id ?? ""}
              onChange={(event) =>
                dispatch({
                  type: "selectProfile",
                  id: event.target.value || null,
                })
              }
            >
              <option value="">{t("simulator.camera.placeholder")}</option>
              {profiles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              {profile
                ? profile.hasStabilization && profile.stabilizationStops > 0
                  ? t("simulator.camera.info", {
                      sensor: t(`simulator.sensor.${profile.sensorType}`),
                      crop: number(profile.cropFactor),
                      stops: number(profile.stabilizationStops, 1),
                    })
                  : t("simulator.camera.infoNoStab", {
                      sensor: t(`simulator.sensor.${profile.sensorType}`),
                      crop: number(profile.cropFactor),
                    })
                : t("simulator.camera.chooseHint")}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sim-lens">{t("simulator.lens.label")}</Label>
            <select
              id="sim-lens"
              className={SELECT_CLASS}
              value={lens?.id ?? ""}
              onChange={(event) =>
                dispatch({
                  type: "selectLens",
                  id: event.target.value || null,
                })
              }
            >
              <option value="">{t("simulator.lens.placeholder")}</option>
              {lensGroups.map(([brand, items]) => (
                <optgroup key={brand} label={brand}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lensLabel(item)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </>
      )}

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold">
          {t("simulator.panel.framing")}
        </legend>

        {ratios.native.length > 0 && (
          <RatioRow
            label={t("simulator.ratio.native")}
            values={ratios.native}
            selected={sim.ratio.value}
            onSelect={(value) => dispatch({ type: "setRatio", value })}
          />
        )}
        <RatioRow
          label={t(
            ratios.native.length > 0
              ? "simulator.ratio.numeric"
              : "simulator.ratio.all",
          )}
          values={ratios.numeric}
          selected={sim.ratio.value}
          onSelect={(value) => dispatch({ type: "setRatio", value })}
        />

        <Button
          type="button"
          variant="outline"
          aria-label={t("simulator.ratio.flip")}
          title={t("simulator.ratio.flip")}
          onClick={() => dispatch({ type: "flipOrientation" })}
        >
          {t(
            sim.ratio.orientation === "landscape"
              ? "simulator.ratio.landscape"
              : "simulator.ratio.portrait",
          )}
        </Button>
      </fieldset>

      <Button
        type="button"
        variant="ghost"
        onClick={() => dispatch({ type: "reset" })}
      >
        {t("common.reset")}
      </Button>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold">
          {t("simulator.focus.title")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["near", "subject", "far"] as const).map((key) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant={
                sameFocus(currentFocus, scene.focusTargets[key])
                  ? "default"
                  : "outline"
              }
              aria-pressed={sameFocus(currentFocus, scene.focusTargets[key])}
              onClick={() =>
                dispatch({
                  type: "setFocusPoint",
                  point: scene.focusTargets[key],
                })
              }
            >
              {t(`simulator.focus.${key}`)}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {t("simulator.focus.hint")}
        </p>
      </fieldset>
    </div>
  );
}

function RatioRow({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={selected === value ? "default" : "outline"}
            aria-pressed={selected === value}
            onClick={() => onSelect(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
