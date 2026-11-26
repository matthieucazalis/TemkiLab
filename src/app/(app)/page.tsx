import { SiteFooter } from "@/components/shell/site-footer";
import { SimulatorApp } from "@/components/simulator/simulator-app";
import { getT } from "@/i18n/server";
import { listCameraProfiles, listLenses } from "@/services/catalog.service";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("simulator.title") };
}

// Accueil = simulateur. Accessible sans compte : la connexion ne sert qu'à
// enregistrer des setups.
export default async function HomePage() {
  const [profiles, lenses] = await Promise.all([
    listCameraProfiles(),
    listLenses(),
  ]);

  return (
    <main id="main-content">
      <SimulatorApp
        profiles={profiles}
        lenses={lenses}
        legalLinks={<SiteFooter />}
      />
    </main>
  );
}
