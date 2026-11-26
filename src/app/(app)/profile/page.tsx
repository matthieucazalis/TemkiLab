import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/shell/page-shell";
import { Button } from "@/components/ui/button";
import { getT } from "@/i18n/server";
import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/session";
import { getUserById } from "@/services/user.service";
import { ProfileForms } from "./profile-forms";

export async function generateMetadata() {
  const t = await getT();
  return { title: t("profile.title") };
}

export default async function ProfilePage() {
  const [sessionUser, t] = await Promise.all([requireUser(), getT()]);
  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");

  return (
    <PageShell
      title={t("profile.title")}
      aside={
        <Link href="/" className="text-sm underline">
          {t("profile.backToSimulator")}
        </Link>
      }
    >
      <ProfileForms name={user.name} email={user.email} avatar={user.avatar} />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline">
          {t("auth.logout")}
        </Button>
      </form>
    </PageShell>
  );
}
