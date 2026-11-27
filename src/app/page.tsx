import { LandingPage } from "@/components/landing/landing-page";
import { AppShell } from "@/components/shell/app-shell";
import { SiteFooter } from "@/components/shell/site-footer";
import { SimulatorApp } from "@/components/simulator/simulator-app";
import { getT } from "@/i18n/server";
import { auth } from "@/lib/auth";
import { restoreSession } from "@/lib/simulator/preset";
import { requireUser } from "@/lib/session";
import { listCameraProfiles, listLenses } from "@/services/catalog.service";
import { getPreset } from "@/services/preset.service";

export async function generateMetadata() {
  const t = await getT();
  return { title: `${t("common.appName")} – ${t("landing.tagline")}` };
}

// « / » : page vitrine pour un visiteur, simulateur (accueil de l'app)
// pour un utilisateur connecté.
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ preset?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return <LandingPage />;

  const user = await requireUser();
  const { preset: presetId } = await searchParams;
  const [profiles, lenses, preset] = await Promise.all([
    listCameraProfiles(),
    listLenses(),
    // « /?preset=... » rouvre un setup ; getPreset ne renvoie que les siens
    presetId ? getPreset(user.id, presetId) : null,
  ]);
  const initialSession = preset
    ? restoreSession(preset, { profiles, lenses })
    : undefined;

  return (
    <AppShell>
      <main id="main-content">
        <SimulatorApp
          // la clé remet l'état à zéro quand on passe d'un setup à un autre
          key={preset?.id ?? "new"}
          profiles={profiles}
          lenses={lenses}
          initialSession={initialSession}
          legalLinks={<SiteFooter />}
        />
      </main>
    </AppShell>
  );
}
