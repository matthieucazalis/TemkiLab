-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('FULL_FRAME', 'APS_C', 'MICRO_43', 'MEDIUM_FORMAT');

-- CreateEnum
CREATE TYPE "LensType" AS ENUM ('ZOOM', 'PRIME');

-- CreateTable
CREATE TABLE "CameraProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sensorType" "SensorType" NOT NULL,
    "cropFactor" DOUBLE PRECISION NOT NULL,
    "nativeRatio" TEXT NOT NULL,
    "unlockedRatios" TEXT[],
    "hasStabilization" BOOLEAN NOT NULL DEFAULT false,
    "stabilizationStops" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "CameraProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lens" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" "LensType" NOT NULL,
    "focalMin" INTEGER NOT NULL,
    "focalMax" INTEGER NOT NULL,
    "maxAperture" DOUBLE PRECISION NOT NULL,
    "coverage" "SensorType",
    "estimatedPrice" INTEGER NOT NULL,
    "priceUpdatedAt" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,

    CONSTRAINT "Lens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulationPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "lensId" TEXT,
    "cameraProfileId" TEXT,

    CONSTRAINT "SimulationPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingSession" (
    "id" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PairingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CameraProfile_slug_key" ON "CameraProfile"("slug");

-- CreateIndex
CREATE INDEX "Lens_brand_idx" ON "Lens"("brand");

-- CreateIndex
CREATE INDEX "Lens_focalMin_focalMax_idx" ON "Lens"("focalMin", "focalMax");

-- CreateIndex
CREATE UNIQUE INDEX "Lens_brand_model_key" ON "Lens"("brand", "model");

-- CreateIndex
CREATE INDEX "SimulationPreset_userId_createdAt_idx" ON "SimulationPreset"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PairingSession_pin_key" ON "PairingSession"("pin");

-- CreateIndex
CREATE INDEX "PairingSession_expiresAt_idx" ON "PairingSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "SimulationPreset" ADD CONSTRAINT "SimulationPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationPreset" ADD CONSTRAINT "SimulationPreset_lensId_fkey" FOREIGN KEY ("lensId") REFERENCES "Lens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationPreset" ADD CONSTRAINT "SimulationPreset_cameraProfileId_fkey" FOREIGN KEY ("cameraProfileId") REFERENCES "CameraProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
