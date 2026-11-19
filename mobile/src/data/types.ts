// Types TypeScript des données renvoyées par l'API (voir docs/API.md à la
// racine du dépôt, ou /api-docs sur le serveur). Ajoute ici les types de tes
// propres ressources.
export type Utilisateur = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  createdAt?: string;
};

export type ReponseConnexion = {
  token: string;
  expiresAt: string;
  user: Utilisateur;
};
