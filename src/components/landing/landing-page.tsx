import Link from "next/link";
import { AppIcon, type AppIconName } from "@/components/icons";
import { PreferencesBar } from "@/components/preferences-bar";
import { SiteFooter } from "@/components/shell/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { getT } from "@/i18n/server";

// Page vitrine : affichée aux visiteurs non connectés sur « / ».
export async function LandingPage() {
  const t = await getT();

  const features: { icon: AppIconName; title: string; text: string }[] = [
    {
      icon: "security",
      title: t("landing.securityTitle"),
      text: t("landing.securityText"),
    },
    {
      icon: "mobile",
      title: t("landing.mobileTitle"),
      text: t("landing.mobileText"),
    },
    {
      icon: "offline",
      title: t("landing.offlineTitle"),
      text: t("landing.offlineText"),
    },
    {
      icon: "language",
      title: t("landing.languageTitle"),
      text: t("landing.languageText"),
    },
  ];

  const cta = (
    <div className="flex flex-wrap gap-3">
      <Link href="/register" className={buttonVariants({ size: "lg" })}>
        {t("landing.ctaRegister")}
      </Link>
      <Link
        href="/login"
        className={buttonVariants({ size: "lg", variant: "outline" })}
      >
        {t("landing.ctaLogin")}
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <span className="flex items-center gap-2 font-semibold">
            <span style={{ color: "var(--coat-a)" }}>
              <AppIcon name="logo" size={22} />
            </span>
            {t("common.appName")}
          </span>
          <div className="flex items-center gap-3">
            <PreferencesBar />
            <Link
              href="/login"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              {t("landing.ctaLogin")}
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <section className="stage-bg text-stage-fg">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-6">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {t("landing.tagline")}
              </h1>
              <p className="max-w-lg text-stage-muted sm:text-lg">
                {t("landing.intro")}
              </p>
              {cta}
            </div>
            <div
              aria-hidden="true"
              className="relative mx-auto aspect-square w-full max-w-sm"
            >
              {[100, 78, 56, 34].map((size, i) => (
                <span
                  key={size}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stage-line"
                  style={{
                    width: `${size}%`,
                    height: `${size}%`,
                    background:
                      i === 2
                        ? "radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--coat-a) 40%, transparent), transparent 55%), radial-gradient(circle at 72% 74%, color-mix(in oklch, var(--coat-b) 38%, transparent), transparent 55%)"
                        : undefined,
                  }}
                />
              ))}
              <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stage-fg/80" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-8 px-5 py-14 sm:px-8">
          <h2 className="text-2xl font-semibold">
            {t("landing.featuresTitle")}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon, title, text }) => (
              <li
                key={title}
                className="space-y-2 rounded-xl border bg-card p-5"
              >
                <span
                  aria-hidden="true"
                  className="inline-block"
                  style={{ color: "var(--coat-a)" }}
                >
                  <AppIcon name={icon} size={24} />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-6xl space-y-4 px-5 pb-16 sm:px-8">
          <h2 className="text-2xl font-semibold">{t("landing.finalTitle")}</h2>
          <p className="text-muted-foreground">{t("landing.finalText")}</p>
          {cta}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
