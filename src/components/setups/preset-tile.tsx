"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import {
  deletePresetAction,
  renamePresetAction,
  togglePresetFavoriteAction,
} from "@/app/(app)/setups/actions";
import { SceneThumb } from "@/components/simulator/scene-layers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOCALE_TAGS } from "@/i18n/config";
import { useLocale, useT } from "@/i18n/client";
import { findScene, resolveSceneId } from "@/lib/simulator/scenes";
import type { PresetSummary } from "@/lib/simulator/preset";

export type PresetTileData = {
  id: string;
  name: string;
  isFavorite: boolean;
  summary: PresetSummary | null; // null : réglages illisibles
  gear: string | null; // « Sony FE 85mm · Reflex APS-C », null en mode Général
};

// Les noms de scènes existent déjà dans la pellicule du simulateur.
const SCENE_KEYS = {
  chart: "simulator.stage.sceneChart",
  landscape: "simulator.stage.sceneLandscape",
  portrait: "simulator.stage.scenePortrait",
  packshot: "simulator.stage.scenePackshot",
  sport: "simulator.stage.sceneSport",
  stickman: "simulator.stage.sceneStickman",
} as const;

// Une vue de la planche-contact : vignette, réglages, et les actions
// (ouvrir, favori, renommer, supprimer).
export function PresetTile({ preset }: { preset: PresetTileData }) {
  const t = useT();
  const tag = LOCALE_TAGS[useLocale()];
  const [pending, startTransition] = useTransition();
  const [renaming, setRenaming] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [error, setError] = useState<string>();
  const [renameState, renameAction, renamePending] = useActionState(
    async (prev: Awaited<ReturnType<typeof renamePresetAction>> | undefined, formData: FormData) => {
      const result = await renamePresetAction(prev, formData);
      if (result.success) setRenaming(false);
      return result;
    },
    undefined,
  );

  const { summary } = preset;
  const sceneId = summary ? resolveSceneId(summary.sceneId) : "chart";
  const scene = summary ? findScene(summary.sceneId) : null;
  const number = (value: number) =>
    value.toLocaleString(tag, { maximumFractionDigits: 1 });

  function run(action: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      setError((await action()).error);
    });
  }

  return (
    <li className="space-y-2 rounded-md bg-stage-2 p-2 text-stage-fg">
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm bg-black/40">
        {scene && <SceneThumb scene={scene} idPrefix={`tile-${preset.id}`} />}
        <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-black/55 px-1 text-[0.7rem] font-medium">
          {t(SCENE_KEYS[sceneId])}
        </span>
        {preset.isFavorite && (
          <span
            className="absolute right-1.5 top-1.5 rounded-sm bg-black/55 px-1 text-[0.7rem]"
            aria-label={t("setups.tile.favorite")}
          >
            ★
          </span>
        )}
      </div>

      {renaming ? (
        <form action={renameAction} className="flex gap-1.5">
          <input type="hidden" name="id" value={preset.id} />
          <Input
            name="name"
            defaultValue={preset.name}
            maxLength={60}
            aria-label={t("setups.tile.nameLabel")}
            className="text-foreground"
          />
          <Button type="submit" size="sm" disabled={renamePending}>
            {t("common.save")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setRenaming(false)}
          >
            {t("common.cancel")}
          </Button>
        </form>
      ) : (
        <h3 className="truncate text-sm font-semibold" title={preset.name}>
          {preset.name}
        </h3>
      )}

      <p className="font-mono text-xs tabular-nums text-stage-muted">
        {summary
          ? `${number(summary.focal)} mm  f/${number(summary.aperture)}  ${summary.ratio}`
          : t("setups.tile.invalidState")}
      </p>
      <p className="truncate text-xs text-stage-muted">
        {preset.gear ?? t("setups.tile.generalMode")}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href={`/?preset=${encodeURIComponent(preset.id)}`}
          className="inline-flex h-7 items-center rounded-md bg-stage-fg px-2.5 text-xs font-medium text-stage outline-none focus-visible:ring-2 focus-visible:ring-coat-b"
        >
          {t("setups.tile.open")}
        </Link>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          aria-pressed={preset.isFavorite}
          disabled={pending}
          onClick={() =>
            run(() => togglePresetFavoriteAction(preset.id, !preset.isFavorite))
          }
          className="text-stage-fg hover:bg-stage-fg/10 hover:text-stage-fg"
        >
          {t(preset.isFavorite ? "setups.tile.unfavorite" : "setups.tile.favorite")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setRenaming((v) => !v)}
          className="text-stage-fg hover:bg-stage-fg/10 hover:text-stage-fg"
        >
          {t("setups.tile.rename")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => {
            if (!confirmingDelete) return setConfirmingDelete(true);
            run(() => deletePresetAction(preset.id));
          }}
          onBlur={() => setConfirmingDelete(false)}
          className="text-stage-fg hover:bg-stage-fg/10 hover:text-stage-fg"
        >
          {t(confirmingDelete ? "setups.tile.confirmDelete" : "setups.tile.delete")}
        </Button>
      </div>

      {(error || renameState?.error) && (
        <p role="alert" className="text-xs text-red-400">
          {error ?? renameState?.error}
        </p>
      )}
    </li>
  );
}
