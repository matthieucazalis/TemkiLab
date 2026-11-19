import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const PASSWORD = "motdepasse-de-test";
// coût 4 : suffisant pour les tests, et rapide
const HASH = bcrypt.hashSync(PASSWORD, 4);

export async function makeUser(label = "user") {
  const id = randomUUID().slice(0, 8);
  return prisma.user.create({
    data: {
      name: `${label}-${id}`,
      email: `${label}-${id}@test.local`,
      passwordHash: HASH,
    },
  });
}

// Supprime les comptes de test (et, en cascade, leurs jetons). Complète cette
// fonction quand tu ajoutes des modèles liés à User.
export async function cleanup(userIds: string[]) {
  await prisma.rateLimit.deleteMany({
    where: { key: { contains: "@test.local" } },
  });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}
