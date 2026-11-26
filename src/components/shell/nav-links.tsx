"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppIcon, type AppIconName } from "@/components/icons";

export type NavItem = { href: string; icon: AppIconName; label: string };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// Rail verticale (écran large) ou barre du bas (mobile) : mêmes liens,
// deux dispositions. L'élément actif reçoit le cadre « revêtement de lentille ».
export function NavLinks({
  items,
  orientation,
}: {
  items: NavItem[];
  orientation: "rail" | "bar";
}) {
  const pathname = usePathname();

  return (
    <ul
      className={
        orientation === "rail"
          ? "flex flex-col items-center gap-2"
          : "grid flex-1 grid-flow-col auto-cols-fr"
      }
    >
      {items.map(({ href, icon, label }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href} className={orientation === "bar" ? "flex" : undefined}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              title={label}
              className={
                orientation === "rail"
                  ? `group relative flex size-11 items-center justify-center rounded-2xl text-sidebar-foreground/60 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring ${active ? "coat-ring bg-sidebar-accent text-sidebar-accent-foreground" : ""}`
                  : `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.68rem] outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring ${active ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/60"}`
              }
            >
              <span
                className={
                  orientation === "bar" && active
                    ? "rounded-full px-4 py-1 coat-ring"
                    : orientation === "bar"
                      ? "px-4 py-1"
                      : undefined
                }
              >
                <AppIcon name={icon} size={orientation === "rail" ? 22 : 20} />
              </span>
              {orientation === "bar" && <span>{label}</span>}
              {orientation === "rail" && (
                <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 ring-1 ring-border transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
                  {label}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
