import Link from "next/link";
import { AppIcon } from "@/components/icons";
import { NavLinks, type NavItem } from "@/components/shell/nav-links";
import { UserAvatar } from "@/components/user-avatar";
import { getT } from "@/i18n/server";
import { auth, signOut } from "@/lib/auth";
import { getUserById } from "@/services/user.service";

// Coque commune à toutes les pages : une rail verticale à gauche (comme le
// flanc d'un boîtier) sur ordinateur, une barre en bas sur mobile.
// Le contenu de chaque page décide lui-même de sa hauteur (le simulateur
// occupe tout l'écran, les autres pages défilent).
export async function AppShell({ children }: { children: React.ReactNode }) {
  const [session, t] = await Promise.all([auth(), getT()]);
  const user = session?.user?.id ? await getUserById(session.user.id) : null;
  const name = user?.name ?? session?.user?.name ?? "";

  const items: NavItem[] = [
    { href: "/", icon: "simulator", label: t("nav.simulator") },
    { href: "/setups", icon: "setups", label: t("nav.setups") },
    { href: "/settings", icon: "settings", label: t("nav.settings") },
  ];
  const accountItem: NavItem = user
    ? { href: "/profile", icon: "profile", label: t("nav.profile") }
    : { href: "/login", icon: "login", label: t("nav.signIn") };

  return (
    <>
      <nav
        aria-label={t("nav.mainLabel")}
        className="fixed bottom-3 left-3 top-3 z-40 hidden w-16 flex-col items-center justify-between rounded-3xl bg-sidebar py-4 text-sidebar-foreground shadow-[0_8px_30px_-12px_rgba(42,41,64,0.35)] md:flex"
      >
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            title={t("common.appName")}
            aria-label={t("nav.home")}
            className="flex size-11 items-center justify-center rounded-full bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <span style={{ color: "var(--coat-a)" }}>
              <AppIcon name="logo" size={24} />
            </span>
          </Link>
          <NavLinks items={items} orientation="rail" />
        </div>

        <div className="flex flex-col items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                title={t("nav.profile")}
                aria-label={t("nav.profile")}
                className="rounded-full outline-none ring-offset-2 ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              >
                <UserAvatar name={name} src={user.avatar} size={36} />
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  title={t("auth.logout")}
                  aria-label={t("auth.logout")}
                  className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground/60 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <AppIcon name="logout" size={20} />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              title={t("nav.signIn")}
              aria-label={t("nav.signIn")}
              className="flex size-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <AppIcon name="login" size={22} />
            </Link>
          )}
        </div>
      </nav>

      <nav
        aria-label={t("nav.mainLabel")}
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex rounded-3xl bg-sidebar px-1 text-sidebar-foreground shadow-[0_8px_30px_-12px_rgba(42,41,64,0.4)] md:hidden"
      >
        <NavLinks items={[...items, accountItem]} orientation="bar" />
      </nav>

      <div className="min-h-dvh pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-[5.5rem]">
        {children}
      </div>
    </>
  );
}
