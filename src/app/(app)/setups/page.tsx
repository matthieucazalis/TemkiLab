import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { PageShell } from "@/components/shell/page-shell";
import {
  PresetTile,
  type PresetTileData,
} from "@/components/setups/preset-tile";
import { getT } from "@/i18n/server";
import { summarizePreset } from "@/lib/simulator/preset";
import { requireUser } from "@/lib/session";
import { listPresets } from "@/services/preset.service";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("setups.title") };
}

// Planche-contact des setups enregistrés depuis le simulateur.
export default async function SetupsPage() {
  const user = await requireUser();
  const [t, presets] = await Promise.all([getT(), listPresets(user.id)]);

  const tiles: PresetTileData[] = presets.map((preset) => ({
    id: preset.id,
    name: preset.name,
    isFavorite: preset.isFavorite,
    summary: summarizePreset(preset.state),
    gear:
      [
        preset.lens && `${preset.lens.brand} ${preset.lens.model}`,
        preset.cameraProfile?.name,
      ]
        .filter(Boolean)
        .join(" · ") || null,
  }));

  return (
    <PageShell
      wide
      title={t("setups.title")}
      intro={t("setups.intro")}
      aside={
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {t("setups.count", { count: tiles.length })}
        </p>
      }
    >
      <section
        aria-label={t("setups.title")}
        className="rounded-xl bg-stage p-3 text-stage-fg sm:p-5"
      >
        <div className="film-holes h-3.5" aria-hidden="true" />
        <ul className="grid grid-cols-1 gap-3 py-3 sm:grid-cols-2 xl:grid-cols-3">
          <li>
            <Link
              href="/"
              className="coat-ring flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-md bg-stage-2 text-center outline-none transition-colors hover:bg-stage-fg/10 focus-visible:ring-2 focus-visible:ring-coat-b"
            >
              <AppIcon name="add" size={26} />
              <span className="text-sm font-medium">{t("setups.newTile")}</span>
              <span className="text-xs text-stage-muted">
                {t("setups.newTileHint")}
              </span>
            </Link>
          </li>
          {tiles.map((preset) => (
            <PresetTile key={preset.id} preset={preset} />
          ))}
        </ul>
        <div className="film-holes h-3.5" aria-hidden="true" />
      </section>

      {tiles.length === 0 && (
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{t("setups.emptyTitle")}</h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            {t("setups.emptyText")}
          </p>
        </div>
      )}
    </PageShell>
  );
}
