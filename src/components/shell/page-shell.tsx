import { PreferencesBar } from "@/components/preferences-bar";
import { SiteFooter } from "@/components/shell/site-footer";

// Page « classique » (réglages, profil, setups) : le titre est dans une
// colonne à gauche, le contenu à droite. Sur mobile, tout s'empile.
export async function PageShell({
  title,
  intro,
  aside,
  wide = false,
  children,
}: {
  title: string;
  intro?: string;
  aside?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <main
        id="main-content"
        className={`mx-auto grid gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 ${wide ? "max-w-6xl" : "max-w-4xl"}`}
      >
        <header className="space-y-4 lg:sticky lg:top-12 lg:self-start">
          <div className="h-1 w-10 rounded-full bg-[image:var(--coat)]" />
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {intro && (
            <p className="max-w-prose text-sm text-muted-foreground">{intro}</p>
          )}
          {aside}
          <div className="pt-2">
            <PreferencesBar />
          </div>
        </header>
        <div className="min-w-0 space-y-6">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
