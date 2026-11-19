// Jeu de démonstration : `npm run db:seed` (relançable à volonté).
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const EMAIL = "demo@temkilab.test";
const PASSWORD = "Demo-temkilab-1";

async function main() {
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  await prisma.user.create({
    data: {
      name: "Compte démo",
      email: EMAIL,
      passwordHash: await bcrypt.hash(PASSWORD, 12),
    },
  });
  console.log(`Compte créé : ${EMAIL} / ${PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
