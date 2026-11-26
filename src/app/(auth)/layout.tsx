import { AppIcon } from "@/components/icons";
import { SiteFooter } from "@/components/shell/site-footer";
import { getT } from "@/i18n/server";

// Pages de connexion : à gauche une « lentille » (anneaux et reflets de
// revêtement), à droite le formulaire. Sur mobile, seul le formulaire reste.
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getT();

  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <aside
        aria-hidden="true"
        className="stage-bg relative hidden flex-col justify-between overflow-hidden p-10 text-stage-fg lg:flex"
      >
        <span className="flex items-center gap-2 text-lg font-semibold">
          <span style={{ color: "var(--coat-a)" }}>
            <AppIcon name="logo" size={26} />
          </span>
          {t("common.appName")}
        </span>

        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(34rem,90%)] -translate-x-1/2 -translate-y-1/2">
          {[100, 80, 60, 40, 22].map((size, i) => (
            <span
              key={size}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-stage-line"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                background:
                  i === 3
                    ? "radial-gradient(circle at 30% 28%, color-mix(in oklch, var(--coat-a) 40%, transparent), transparent 55%), radial-gradient(circle at 72% 74%, color-mix(in oklch, var(--coat-b) 38%, transparent), transparent 55%)"
                    : undefined,
              }}
            />
          ))}
          <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stage-fg/80" />
        </div>

        <p className="relative max-w-xs text-2xl font-semibold leading-snug">
          {t("simulator.intro")}
        </p>
      </aside>

      <div className="flex flex-col">
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
