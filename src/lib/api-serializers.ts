// Représentations publiques : on liste explicitement les champs exposés (jamais
// d'objet Prisma brut, pour ne pas laisser échapper une colonne sensible).
// Ajoute ici un serializer par ressource que ton API expose.
type UserLike = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
};

export const serializeUser = (user: UserLike) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
});
