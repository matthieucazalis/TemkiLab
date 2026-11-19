import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { DELETED_USER_NAME } from "@/lib/labels";
import { deleteAccount, exportUserData } from "@/services/account.service";
import { verifyCredentials, WrongPasswordError } from "@/services/user.service";
import { PASSWORD, cleanup, makeUser } from "./helpers";

describe("compte (RGPD)", () => {
  const ids: string[] = [];
  afterAll(() => cleanup(ids));

  it("exporte les données sans jamais inclure le mot de passe", async () => {
    const user = await makeUser("export");
    ids.push(user.id);

    const data = await exportUserData(user.id);
    expect(data.profile.email).toBe(user.email);

    const json = JSON.stringify(data);
    expect(json).not.toContain("passwordHash");
    expect(json).not.toContain(user.passwordHash);
  });

  it("refuse la suppression avec un mauvais mot de passe", async () => {
    const user = await makeUser("wrongpwd");
    ids.push(user.id);
    await expect(deleteAccount(user.id, "mauvais")).rejects.toThrow(
      WrongPasswordError,
    );
    expect(
      (await prisma.user.findUniqueOrThrow({ where: { id: user.id } }))
        .deletedAt,
    ).toBeNull();
  });

  it("anonymise le compte et supprime ses jetons", async () => {
    const user = await makeUser("leaver");
    ids.push(user.id);
    await prisma.apiToken.create({
      data: {
        userId: user.id,
        tokenHash: `t-${Date.now()}-${user.id}`,
        name: "Test",
        expiresAt: new Date(Date.now() + 3600 * 1000),
      },
    });

    await deleteAccount(user.id, PASSWORD);

    const after = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    expect(after.name).toBe(DELETED_USER_NAME);
    expect(after.email).not.toBe(user.email);
    expect(after.email).toMatch(/@deleted\.invalid$/);
    expect(after.avatar).toBeNull();
    expect(after.deletedAt).not.toBeNull();
    expect(await prisma.apiToken.count({ where: { userId: user.id } })).toBe(0);

    // plus aucune connexion possible, ni avec l'ancien email, ni avec le mot de passe
    expect(await verifyCredentials(user.email, PASSWORD)).toBeNull();
    expect(await verifyCredentials(after.email, PASSWORD)).toBeNull();
  });
});
