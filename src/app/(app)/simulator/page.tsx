import { SimulatorApp } from "@/components/simulator/simulator-app";
import { getT } from "@/i18n/server";
import { requireUser } from "@/lib/session";
import { listCameraProfiles, listLenses } from "@/services/catalog.service";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("simulator.title") };
}

export default async function SimulatorPage() {
  const [, t, profiles, lenses] = await Promise.all([
    requireUser(),
    getT(),
    listCameraProfiles(),
    listLenses(),
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-7xl space-y-6 p-4 sm:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{t("simulator.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("simulator.intro")}</p>
      </div>
      <SimulatorApp profiles={profiles} lenses={lenses} />
    </main>
  );
}
