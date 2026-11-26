import { LandingPage } from "@/components/landing/landing-page";
import { AppShell } from "@/components/shell/app-shell";
import { SiteFooter } from "@/components/shell/site-footer";
import { SimulatorApp } from "@/components/simulator/simulator-app";
import { getT } from "@/i18n/server";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import { listCameraProfiles, listLenses } from "@/services/catalog.service";

export async function generateMetadata() {
  const t = await getT();
  return { title: `${t("common.appName")} – ${t("landing.tagline")}` };
}

// « / » : page vitrine pour un visiteur, simulateur (accueil de l'app)
// pour un utilisateur connecté.
export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) return <LandingPage />;

  await requireUser();
  const [profiles, lenses] = await Promise.all([
    listCameraProfiles(),
    listLenses(),
  ]);

  return (
    <AppShell>
      <main id="main-content">
        <SimulatorApp
          profiles={profiles}
          lenses={lenses}
          legalLinks={<SiteFooter />}
        />
      </main>
    </AppShell>
  );
}
