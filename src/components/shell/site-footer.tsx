import Link from "next/link";
import { getT } from "@/i18n/server";

export async function SiteFooter() {
  const t = await getT();
  return (
    <footer className="flex flex-wrap justify-center gap-4 px-4 py-8 text-xs text-muted-foreground">
      <Link href="/legal/privacy" className="underline">
        {t("legal.footerPrivacy")}
      </Link>
      <Link href="/legal/notice" className="underline">
        {t("legal.footerNotice")}
      </Link>
    </footer>
  );
}
