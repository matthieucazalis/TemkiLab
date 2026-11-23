import { prisma } from "@/lib/prisma";

const cameraProfileSelect = {
  id: true,
  slug: true,
  name: true,
  sensorType: true,
  cropFactor: true,
  nativeRatio: true,
  unlockedRatios: true,
  hasStabilization: true,
  stabilizationStops: true,
} as const;

export type CameraProfileView = NonNullable<
  Awaited<ReturnType<typeof getCameraProfileById>>
>;

export async function listCameraProfiles() {
  return prisma.cameraProfile.findMany({
    select: cameraProfileSelect,
    orderBy: [{ cropFactor: "asc" }, { name: "asc" }],
  });
}

export async function getCameraProfileById(id: string) {
  return prisma.cameraProfile.findUnique({
    where: { id },
    select: cameraProfileSelect,
  });
}

export async function getCameraProfileBySlug(slug: string) {
  return prisma.cameraProfile.findFirst({
    where: { slug },
    select: cameraProfileSelect,
  });
}
