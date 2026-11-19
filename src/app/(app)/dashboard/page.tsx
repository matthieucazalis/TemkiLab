import { getT } from "@/i18n/server";
import { requireUser } from "@/lib/session";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("dashboard.title") };
}

// Page d'accueil de l'espace connecté : point de départ à remplacer.
export default async function DashboardPage() {
  const [user, t] = await Promise.all([requireUser(), getT()]);

  return (
    <main id="main-content" className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
      <section className="space-y-2 rounded-lg border p-5">
        <h2 className="text-lg font-semibold">
          {t("dashboard.welcome", { name: user.name ?? "" })}
        </h2>
        <p className="text-sm text-muted-foreground">{t("dashboard.intro")}</p>
      </section>
      <section className="space-y-2 rounded-lg border bg-muted/40 p-5">
        <h2 className="font-semibold">{t("dashboard.nextTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.nextText")}
        </p>
      </section>
    </main>
  );
}
