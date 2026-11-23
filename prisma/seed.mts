import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { LensType, PrismaClient, SensorType } from "../src/generated/prisma/client";

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
  await prisma.lens.deleteMany();
  await prisma.lens.createMany({
    data: LENSES,
  });
  console.log(`${LENSES.length} objectifs créés`);
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


const PRICES_CHECKED_AT = new Date("2026-11-23");

const prime = (
  brand: string,
  model: string,
  focal: number,
  maxAperture: number,
  coverage: SensorType,
  estimatedPrice: number,
) => ({
  brand,
  model,
  type: LensType.PRIME,
  focalMin: focal,
  focalMax: focal,
  maxAperture,
  coverage,
  estimatedPrice,
  priceUpdatedAt: PRICES_CHECKED_AT,
  sourceUrl: null as string | null,
});

const zoom = (
  brand: string,
  model: string,
  focalMin: number,
  focalMax: number,
  maxAperture: number,
  coverage: SensorType,
  estimatedPrice: number,
) => ({
  brand,
  model,
  type: LensType.ZOOM,
  focalMin,
  focalMax,
  maxAperture,
  coverage,
  estimatedPrice,
  priceUpdatedAt: PRICES_CHECKED_AT,
  sourceUrl: null as string | null,
});

const FF = SensorType.FULL_FRAME;
const APSC = SensorType.APS_C;
const M43 = SensorType.MICRO_43;
const MF = SensorType.MEDIUM_FORMAT;

const LENSES = [
  prime("Canon", "RF 50mm f/1.8 STM", 50, 1.8, FF, 250),
  prime("Sony", "FE 50mm F1.8", 50, 1.8, FF, 250),
  prime("Nikon", "NIKKOR Z 40mm f/2", 40, 2, FF, 300),
  prime("Sony", "FE 24mm F1.4 GM", 24, 1.4, FF, 1500),
  prime("Canon", "RF 85mm f/2 Macro IS STM", 85, 2, FF, 650),
  prime("Sony", "FE 85mm F1.8", 85, 1.8, FF, 600),
  prime("Sony", "FE 135mm F1.8 GM", 135, 1.8, FF, 2000),
  prime("Sigma", "56mm f/1.4 DC DN Contemporary", 56, 1.4, APSC, 450),
  prime("Fujifilm", "XF 35mm f/2 R WR", 35, 2, APSC, 400),
  prime("Olympus", "M.Zuiko Digital ED 45mm f/1.8", 45, 1.8, M43, 300),
  prime("Panasonic", "Lumix G 25mm f/1.7 ASPH.", 25, 1.7, M43, 150),
  prime("Fujifilm", "GF 80mm f/1.7 R WR", 80, 1.7, MF, 2400),

  zoom("Sigma", "16-28mm f/2.8 DG DN Contemporary", 16, 28, 2.8, FF, 650),
  zoom("Canon", "RF 14-35mm f/4L IS USM", 14, 35, 4, FF, 1700),
  zoom("Sony", "FE 24-70mm F2.8 GM II", 24, 70, 2.8, FF, 2400),
  zoom("Tamron", "28-75mm f/2.8 Di III VXD G2", 28, 75, 2.8, FF, 900),
  zoom("Canon", "RF 24-105mm f/4L IS USM", 24, 105, 4, FF, 1300),
  zoom("Sony", "FE 70-200mm F2.8 GM OSS II", 70, 200, 2.8, FF, 2800),
  zoom("Sigma", "150-600mm f/5-6.3 DG DN OS Sports", 150, 600, 5, FF, 1600),
  zoom("Sigma", "18-50mm f/2.8 DC DN Contemporary", 18, 50, 2.8, APSC, 450),
  zoom("Fujifilm", "XF 16-55mm f/2.8 R LM WR", 16, 55, 2.8, APSC, 1100),
  zoom("Olympus", "M.Zuiko Digital ED 12-40mm f/2.8 PRO", 12, 40, 2.8, M43, 700),
  zoom("Olympus", "M.Zuiko Digital ED 40-150mm f/2.8 PRO", 40, 150, 2.8, M43, 1400),
  zoom("Canon", "RF 100-500mm f/4.5-7.1L IS USM", 100, 500, 4.5, FF, 3000),
];