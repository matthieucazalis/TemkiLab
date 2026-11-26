import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { PageShell } from "@/components/shell/page-shell";
import { getT } from "@/i18n/server";
import { requireUser } from "@/lib/session";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("setups.title") };
}

// Planche-contact des setups enregistrés. Pour l'instant : uniquement le
// layout (état vide + cases prêtes). Les données viendront du modèle
// SimulationPreset quand l'enregistrement depuis le simulateur existera.
export default async function SetupsPage() {
  const [, t] = await Promise.all([requireUser(), getT()]);
  const count = 0;

  return (
    <PageShell
      wide
      title={t("setups.title")}
      intro={t("setups.intro")}
      aside={
        <p className="font-mono text-sm tabular-nums text-muted-foreground">
          {t("setups.count", { count })}
        </p>
      }
    >
      <section
        aria-label={t("setups.title")}
        className="rounded-3xl bg-stage p-4 text-stage-fg sm:p-6"
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          <li>
            <Link
              href="/"
              className="coat-ring flex aspect-[3/2] flex-col items-center justify-center gap-2 rounded-3xl bg-stage-2 text-center outline-none transition-colors hover:bg-stage-fg/10 focus-visible:ring-2 focus-visible:ring-coat-b"
            >
              <AppIcon name="add" size={26} />
              <span className="text-sm font-medium">{t("setups.newTile")}</span>
              <span className="text-xs text-stage-muted">
                {t("setups.newTileHint")}
              </span>
            </Link>
          </li>
          {Array.from({ length: 7 }, (_, i) => (
            <li
              key={i}
              aria-hidden="true"
              className={`aspect-[3/2] rounded-3xl bg-stage-fg/5 ${i > 3 ? "hidden sm:block" : ""} ${i > 5 ? "xl:block" : ""}`}
            />
          ))}
        </ul>
      </section>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{t("setups.emptyTitle")}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">
          {t("setups.emptyText")}
        </p>
        <p className="pt-2 text-xs text-muted-foreground">{t("setups.soon")}</p>
      </div>
    </PageShell>
  );
}
