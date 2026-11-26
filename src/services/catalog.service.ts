import { prisma } from "@/lib/prisma";

// Lecture du catalogue pour le simulateur : boîtiers et objectifs.
// Seule couche autorisée à parler à Prisma pour ces données (comme user.service
// pour les comptes). On ne sélectionne que les champs utiles à l'écran : moins
// de données envoyées au navigateur, et rien d'interne qui fuit par accident.
const profileSelect = {
  id: true,
  name: true,
  sensorType: true,
  cropFactor: true,
  nativeRatio: true,
  unlockedRatios: true,
  hasStabilization: true,
  stabilizationStops: true,
} as const;

const lensSelect = {
  id: true,
  brand: true,
  model: true,
  type: true,
  focalMin: true,
  focalMax: true,
  maxAperture: true,
  coverage: true,
} as const;

// Du plus petit capteur au plus grand : le facteur de recadrage décroît quand
// le capteur grandit (Micro 4/3 ×2, APS-C ×1,5, plein format ×1, moyen format).
export async function listCameraProfiles() {
  return prisma.cameraProfile.findMany({
    select: profileSelect,
    orderBy: [{ cropFactor: "desc" }, { name: "asc" }],
  });
}

// Classés par marque, puis par focale : c'est l'ordre des <optgroup> du menu.
export async function listLenses() {
  return prisma.lens.findMany({
    select: lensSelect,
    orderBy: [{ brand: "asc" }, { focalMin: "asc" }, { model: "asc" }],
  });
}
