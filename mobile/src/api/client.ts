// Client de l'API TemkiLab. Aucune dépendance à React : il ne fait que des
// appels `fetch` et transforme les erreurs en une classe unique, ErreurApi.
import type { ReponseConnexion, Utilisateur } from "@/data/types";

export type CodeErreur =
  | "reseau" // pas de connexion, serveur éteint, mauvaise adresse
  | "delai" // le serveur n'a pas répondu à temps
  | "non_authentifie" // jeton absent, expiré ou révoqué
  | "identifiants" // email ou mot de passe faux
  | "trop_de_tentatives"
  | "introuvable"
  | "conflit" // changement refusé dans l'état actuel
  | "validation"
  | "image"
  | "serveur"
  | "inconnue";

export class ErreurApi extends Error {
  constructor(
    public code: CodeErreur,
    public statut?: number,
    public champs: string[] = [],
  ) {
    super(code);
    this.name = "ErreurApi";
  }
}

const DELAI_MS = 15_000;

type Options = {
  methode?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  corps?: unknown;
  jeton?: string | null;
};

// Convertit le statut HTTP + le code renvoyé par le serveur en erreur typée
function versErreur(
  statut: number,
  code?: string,
  champs?: string[],
): ErreurApi {
  if (code === "invalid_credentials")
    return new ErreurApi("identifiants", statut);
  if (code === "too_many_attempts")
    return new ErreurApi("trop_de_tentatives", statut);
  if (code === "validation") return new ErreurApi("validation", statut, champs);
  if (code === "invalid_image" || code === "image_too_large")
    return new ErreurApi("image", statut);
  if (statut === 401) return new ErreurApi("non_authentifie", statut);
  if (statut === 404) return new ErreurApi("introuvable", statut);
  if (statut === 409) return new ErreurApi("conflit", statut);
  if (statut === 422) return new ErreurApi("validation", statut, champs);
  if (statut === 429) return new ErreurApi("trop_de_tentatives", statut);
  if (statut >= 500) return new ErreurApi("serveur", statut);
  return new ErreurApi("inconnue", statut);
}

export async function appel<T>(
  serveur: string,
  chemin: string,
  { methode = "GET", corps, jeton }: Options = {},
): Promise<T> {
  const controle = new AbortController();
  const minuteur = setTimeout(() => controle.abort(), DELAI_MS);

  let reponse: Response;
  try {
    reponse = await fetch(`${serveur}/api/v1${chemin}`, {
      method: methode,
      headers: {
        Accept: "application/json",
        ...(corps !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: corps !== undefined ? JSON.stringify(corps) : undefined,
      signal: controle.signal,
    });
  } catch (e) {
    throw new ErreurApi(
      e instanceof Error && e.name === "AbortError" ? "delai" : "reseau",
    );
  } finally {
    clearTimeout(minuteur);
  }

  if (reponse.status === 204) return undefined as T;

  let donnees: unknown = null;
  try {
    donnees = await reponse.json();
  } catch {
    /* corps vide ou non JSON */
  }

  if (!reponse.ok) {
    const erreur = (
      donnees as { error?: { code?: string; fields?: string[] } } | null
    )?.error;
    throw versErreur(reponse.status, erreur?.code, erreur?.fields);
  }
  return donnees as T;
}

// Fonctions de l'API, regroupées pour que les écrans n'écrivent jamais d'URL.
// Ajoute ici une fonction par route de ton API (voir /api-docs sur le serveur).
export function creerApi(serveur: string, jeton: string | null) {
  const o = (opts: Options = {}) => ({ ...opts, jeton });

  return {
    moi: () => appel<Utilisateur>(serveur, "/me", o()),
    envoyerPhoto: (dataUrl: string) =>
      appel<{ avatar: string }>(
        serveur,
        "/me/avatar",
        o({ methode: "PUT", corps: { dataUrl } }),
      ),
    supprimerPhoto: () =>
      appel<void>(serveur, "/me/avatar", o({ methode: "DELETE" })),
    deconnexion: () =>
      appel<void>(serveur, "/auth/token", o({ methode: "DELETE" })),
  };
}

export type Api = ReturnType<typeof creerApi>;

export function connexion(
  serveur: string,
  email: string,
  motDePasse: string,
  appareil: string,
) {
  return appel<ReponseConnexion>(serveur, "/auth/token", {
    methode: "POST",
    corps: { email, password: motDePasse, deviceName: appareil },
  });
}
