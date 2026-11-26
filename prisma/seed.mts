import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { LensType, SensorType } from "../src/generated/prisma/enums";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const EMAIL = "demo@temkilab.test";
const PASSWORD = "Demo-temkilab-1";

const PRICES_DATE = new Date("2026-11-23");

const cameraProfiles = [
  {
    slug: "reflex-aps-c",
    name: "Reflex APS-C",
    sensorType: SensorType.APS_C,
    cropFactor: 1.5,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
    hasStabilization: false,
    stabilizationStops: 0,
  },
  {
    slug: "hybride-aps-c",
    name: "Hybride APS-C",
    sensorType: SensorType.APS_C,
    cropFactor: 1.5,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "4:5", "4:3"],
    hasStabilization: true,
    stabilizationStops: 5,
  },
  {
    slug: "plein-format-pro",
    name: "Plein Format Pro",
    sensorType: SensorType.FULL_FRAME,
    cropFactor: 1,
    nativeRatio: "3:2",
    unlockedRatios: ["1:1", "16:9", "4:5", "4:3", "5:7"],
    hasStabilization: true,
    stabilizationStops: 5,
  },
  {
    slug: "compact-expert-micro-43",
    name: "Compact Expert Micro 4/3",
    sensorType: SensorType.MICRO_43,
    cropFactor: 2,
    nativeRatio: "4:3",
    unlockedRatios: ["1:1", "16:9", "3:5", "4:5", "5:7", "3:2"],
    hasStabilization: true,
    stabilizationStops: 6,
  },
  {
    slug: "moyen-format",
    name: "Moyen Format",
    sensorType: SensorType.MEDIUM_FORMAT,
    cropFactor: 0.79,
    nativeRatio: "4:3",
    unlockedRatios: ["1:1", "16:9", "4:5", "3:2"],
    hasStabilization: true,
    stabilizationStops: 6,
  },
];

type LensSeed = {
  brand: string;
  model: string;
  focalMin: number;
  focalMax: number;
  maxAperture: number;
  coverage: SensorType;
  estimatedPrice: number;
  sourceUrl?: string; // TODO : renseigner la page constructeur de chaque objectif
};

const FF = SensorType.FULL_FRAME;
const APSC = SensorType.APS_C;
const M43 = SensorType.MICRO_43;
const MF = SensorType.MEDIUM_FORMAT;

const lenses: LensSeed[] = [
  // Plein format
  {
    brand: "Canon",
    model: "RF 50mm f/1.8 STM",
    focalMin: 50,
    focalMax: 50,
    maxAperture: 1.8,
    coverage: FF,
    estimatedPrice: 230,
    sourceUrl: "https://www.canon.fr/lenses/rf-50mm-f1-8-stm/",
  },
  {
    brand: "Canon",
    model: "RF 35mm f/1.8 Macro IS STM",
    focalMin: 35,
    focalMax: 35,
    maxAperture: 1.8,
    coverage: FF,
    estimatedPrice: 500,
  },
  {
    brand: "Canon",
    model: "RF 85mm f/2 Macro IS STM",
    focalMin: 85,
    focalMax: 85,
    maxAperture: 2,
    coverage: FF,
    estimatedPrice: 650,
  },
  {
    brand: "Canon",
    model: "RF 24-70mm f/2.8L IS USM",
    focalMin: 24,
    focalMax: 70,
    maxAperture: 2.8,
    coverage: FF,
    estimatedPrice: 2400,
  },
  {
    brand: "Canon",
    model: "RF 70-200mm f/2.8L IS USM",
    focalMin: 70,
    focalMax: 200,
    maxAperture: 2.8,
    coverage: FF,
    estimatedPrice: 2800,
  },
  {
    brand: "Sony",
    model: "FE 50mm f/1.8",
    focalMin: 50,
    focalMax: 50,
    maxAperture: 1.8,
    coverage: FF,
    estimatedPrice: 250,
  },
  {
    brand: "Sony",
    model: "FE 85mm f/1.4 GM",
    focalMin: 85,
    focalMax: 85,
    maxAperture: 1.4,
    coverage: FF,
    estimatedPrice: 1800,
  },
  {
    brand: "Sony",
    model: "FE 24-70mm f/2.8 GM II",
    focalMin: 24,
    focalMax: 70,
    maxAperture: 2.8,
    coverage: FF,
    estimatedPrice: 2400,
  },
  {
    brand: "Sony",
    model: "FE 70-200mm f/2.8 GM OSS II",
    focalMin: 70,
    focalMax: 200,
    maxAperture: 2.8,
    coverage: FF,
    estimatedPrice: 3000,
  },
  {
    brand: "Nikon",
    model: "Z 35mm f/1.8 S",
    focalMin: 35,
    focalMax: 35,
    maxAperture: 1.8,
    coverage: FF,
    estimatedPrice: 700,
  },
  {
    brand: "Nikon",
    model: "Z 85mm f/1.8 S",
    focalMin: 85,
    focalMax: 85,
    maxAperture: 1.8,
    coverage: FF,
    estimatedPrice: 850,
  },
  {
    brand: "Nikon",
    model: "Z 24-70mm f/4 S",
    focalMin: 24,
    focalMax: 70,
    maxAperture: 4,
    coverage: FF,
    estimatedPrice: 1000,
  },
  {
    brand: "Sigma",
    model: "35mm f/1.4 DG DN Art",
    focalMin: 35,
    focalMax: 35,
    maxAperture: 1.4,
    coverage: FF,
    estimatedPrice: 800,
  },
  {
    brand: "Tamron",
    model: "28-75mm f/2.8 Di III VXD G2",
    focalMin: 28,
    focalMax: 75,
    maxAperture: 2.8,
    coverage: FF,
    estimatedPrice: 900,
  },
  {
    brand: "Sigma",
    model: "100-400mm f/5-6.3 DG DN OS",
    focalMin: 100,
    focalMax: 400,
    maxAperture: 5,
    coverage: FF,
    estimatedPrice: 950,
  },

  // APS-C
  {
    brand: "Fujifilm",
    model: "XF 23mm f/2 R WR",
    focalMin: 23,
    focalMax: 23,
    maxAperture: 2,
    coverage: APSC,
    estimatedPrice: 450,
  },
  {
    brand: "Fujifilm",
    model: "XF 35mm f/1.4 R",
    focalMin: 35,
    focalMax: 35,
    maxAperture: 1.4,
    coverage: APSC,
    estimatedPrice: 550,
  },
  {
    brand: "Fujifilm",
    model: "XF 56mm f/1.2 R",
    focalMin: 56,
    focalMax: 56,
    maxAperture: 1.2,
    coverage: APSC,
    estimatedPrice: 1000,
  },
  {
    brand: "Fujifilm",
    model: "XF 16-55mm f/2.8 R LM WR",
    focalMin: 16,
    focalMax: 55,
    maxAperture: 2.8,
    coverage: APSC,
    estimatedPrice: 1200,
  },
  {
    brand: "Sigma",
    model: "18-50mm f/2.8 DC DN",
    focalMin: 18,
    focalMax: 50,
    maxAperture: 2.8,
    coverage: APSC,
    estimatedPrice: 600,
  },

  {
    brand: "Olympus",
    model: "M.Zuiko 25mm f/1.8",
    focalMin: 25,
    focalMax: 25,
    maxAperture: 1.8,
    coverage: M43,
    estimatedPrice: 300,
  },
  {
    brand: "Olympus",
    model: "M.Zuiko 45mm f/1.8",
    focalMin: 45,
    focalMax: 45,
    maxAperture: 1.8,
    coverage: M43,
    estimatedPrice: 280,
  },
  {
    brand: "Panasonic",
    model: "Leica DG Summilux 25mm f/1.4 II",
    focalMin: 25,
    focalMax: 25,
    maxAperture: 1.4,
    coverage: M43,
    estimatedPrice: 600,
  },
  {
    brand: "Olympus",
    model: "M.Zuiko 12-40mm f/2.8 PRO",
    focalMin: 12,
    focalMax: 40,
    maxAperture: 2.8,
    coverage: M43,
    estimatedPrice: 700,
  },

  {
    brand: "Fujifilm",
    model: "GF 63mm f/2.8 R WR",
    focalMin: 63,
    focalMax: 63,
    maxAperture: 2.8,
    coverage: MF,
    estimatedPrice: 1600,
  },
  {
    brand: "Fujifilm",
    model: "GF 110mm f/2 R LM WR",
    focalMin: 110,
    focalMax: 110,
    maxAperture: 2,
    coverage: MF,
    estimatedPrice: 3500,
  },
  {
    brand: "Fujifilm",
    model: "GF 32-64mm f/4 R LM WR",
    focalMin: 32,
    focalMax: 64,
    maxAperture: 4,
    coverage: MF,
    estimatedPrice: 2300,
  },
];

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

  for (const profile of cameraProfiles) {
    await prisma.cameraProfile.upsert({
      where: { slug: profile.slug },
      update: profile,
      create: profile,
    });
  }
  console.log(`${cameraProfiles.length} boîtiers`);

  for (const lens of lenses) {
    const data = {
      ...lens,
      type: lens.focalMin === lens.focalMax ? LensType.PRIME : LensType.ZOOM,
      priceUpdatedAt: PRICES_DATE,
    };
    const existingLens = await prisma.lens.findFirst({
      where: { brand: lens.brand, model: lens.model },
    });
    if (existingLens) {
      await prisma.lens.update({ where: { id: existingLens.id }, data });
    } else {
      await prisma.lens.create({ data });
    }
  }
  console.log(`${lenses.length} objectifs`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
