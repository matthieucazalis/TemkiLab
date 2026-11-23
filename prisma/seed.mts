import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, SensorType } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const EMAIL = "demo@temkilab.test";
const PASSWORD = "Demo-temkilab-1";

async function main() {
  await prisma.cameraProfile.deleteMany();
  await prisma.cameraProfile.createMany({
    data: CAMERA_PROFILE,
  });
  console.log(`${CAMERA_PROFILE.length} profils de boîtiers créés`);
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

const CAMERA_PROFILE = [
  {
    name: "Reflex APS-C initiation",
    sensorType: SensorType.APS_C,
    cropFactor: 1.5,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "4:5", "4:3",],
    hasStabilization: false,
    stabilizationStops: 0,
  },
  {
    name: "Hybride APS-c",
    sensorType: SensorType.APS_C,
    cropFactor: 1.5,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "4:3",],
    hasStabilization: true,
    stabilizationStops: 5,
  },
  {
    name: "Plein format pro",
    sensorType: SensorType.FULL_FRAME,
    cropFactor: 1,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "4:3",],
    hasStabilization: true,
    stabilizationStops: 7,
  },
  {
    name: "Compact expert Micro 4/3",
    sensorType: SensorType.MICRO_43,
    cropFactor: 2,
    nativeRatio: "4:3",
    unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "3:2",],
    hasStabilization: true,
    stabilizationStops: 6,
  },
  {
    name: "Moyen format",
    sensorType: SensorType.MEDIUM_FORMAT,
    cropFactor: 0.79,
    nativeRatio: "4:3",
    unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "3:2",],
    hasStabilization: true,
    stabilizationStops: 6,
  },
];