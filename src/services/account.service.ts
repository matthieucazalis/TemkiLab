import bcrypt from "bcryptjs";
import { DELETED_USER_NAME } from "@/lib/labels";
import { prisma } from "@/lib/prisma";
import { WrongPasswordError } from "@/services/user.service";

export async function setAvatar(userId: string, dataUrl: string | null) {
  await prisma.user.update({
    where: { id: userId },
    data: { avatar: dataUrl },
  });
}

// Droit à l'effacement (RGPD, art. 17). On anonymise plutôt que de supprimer la
// ligne : si tu ajoutes des données partagées (contenus, historique), elles
// restent cohérentes mais ne sont plus rattachées à une personne identifiable.
// Pense à compléter cette fonction quand tu ajoutes des modèles liés à User.
export async function deleteAccount(userId: string, password: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) throw new WrongPasswordError();
  if (!(await bcrypt.compare(password, user.passwordHash)))
    throw new WrongPasswordError();

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.deleteMany({ where: { userId } });
    await tx.apiToken.deleteMany({ where: { userId } });
    // La ligne User reste (anonymisée) : ses setups doivent donc être effacés.
    await tx.simulationPreset.deleteMany({ where: { userId } });

    await tx.user.update({
      where: { id: userId },
      data: {
        name: DELETED_USER_NAME,
        email: `deleted-${userId}@deleted.invalid`,
        // valeur qui n'est pas une empreinte bcrypt valide : aucune connexion possible
        passwordHash: "!deleted",
        avatar: null,
        locale: null,
        theme: null,
        deletedAt: new Date(),
      },
    });
  });
}

// Droit d'accès et à la portabilité (RGPD, art. 15 et 20) : toutes les données
// rattachées au compte, dans un format lisible par une machine.
// Ajoute ici les données de tes propres modèles.
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      locale: true,
      theme: true,
      haptics: true,
      avatar: true,
    },
  });

  const presets = await prisma.simulationPreset.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      name: true,
      isFavorite: true,
      state: true,
      createdAt: true,
      lens: { select: { brand: true, model: true } },
      cameraProfile: { select: { name: true } },
    },
  });

  const { avatar, ...profile } = user;
  return {
    exportedAt: new Date().toISOString(),
    profile: { ...profile, hasAvatar: avatar !== null },
    presets,
  };
}
