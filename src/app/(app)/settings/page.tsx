import Link from "next/link";
import { getPreferences, getT } from "@/i18n/server";
import { requireUser } from "@/lib/session";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreferencesForm } from "./preferences-form";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("settings.title") };
}

export default async function SettingsPage() {
  await requireUser();
  const [t, prefs] = await Promise.all([getT(), getPreferences()]);

  return (
    <PageShell title={t("settings.title")} intro={t("settings.intro")}>
      <PreferencesForm
        locale={prefs.locale}
        theme={prefs.theme}
        haptics={prefs.haptics}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.accountTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">{t("settings.accountHelp")}</p>
          <Link href="/profile" className="underline">
            {t("settings.accountLink")}
          </Link>
        </CardContent>
      </Card>
    </PageShell>
  );
}
