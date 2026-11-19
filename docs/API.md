# API REST (v1)

API branchée sur les mêmes services métier que l'interface web. Elle sert l'**application mobile** (`mobile/`)
et reste utilisable par tout autre client.

- Description machine : `GET /api/v1/openapi.json` (OpenAPI 3.0) — page lisible : `/api-docs`
- Source de vérité : `src/lib/openapi.ts` (un test vérifie que chaque chemin décrit a bien un `route.ts`)
- Réponses : JSON ; erreurs au format `{ "error": { "code": "…", "message": "…", "fields": ["…"] } }`

## Authentification

| Client             | Méthode                                                                                       | Droits                            |
| ------------------ | --------------------------------------------------------------------------------------------- | --------------------------------- |
| Application mobile | `POST /auth/token` (email + mot de passe) → jeton `tok_…`, puis `Authorization: Bearer tok_…` | **Lecture et écriture**           |
| Navigateur         | Cookie de session du site                                                                     | **Lecture seule** (`GET`, `HEAD`) |

Pourquoi les écritures exigent un jeton : un navigateur envoie son cookie **automatiquement**, y compris depuis un
site malveillant (attaque CSRF). Un `PUT`/`PATCH`/`POST`/`DELETE` avec cookie seul renvoie `403 token_required`.

Le jeton : 256 bits aléatoires, **valable 30 jours**, stocké **haché** (SHA-256), **révocable**
(`DELETE /auth/token`), 10 par utilisateur au maximum, refusé si le compte est supprimé.

## Routes de base

| Méthode et chemin                     | Rôle                               | Corps / paramètres                 |
| ------------------------------------- | ---------------------------------- | ---------------------------------- |
| `POST /auth/token`                    | Connexion mobile (publique)        | `email`, `password`, `deviceName?` |
| `DELETE /auth/token`                  | Déconnexion : révoque le jeton     | —                                  |
| `GET /me`                             | Utilisateur connecté               | —                                  |
| `PUT /me/avatar`, `DELETE /me/avatar` | Photo de profil (data URL, 256 px) | `dataUrl`                          |

## Codes de réponse

| Code            | Signification                                                                   |
| --------------- | ------------------------------------------------------------------------------- |
| 200 / 201 / 204 | Succès / créé / succès sans contenu                                             |
| 400             | Paramètre ou JSON invalide                                                      |
| 401             | Pas de jeton, jeton invalide ou révoqué, compte supprimé ; identifiants faux    |
| 403             | Écriture avec un cookie au lieu d'un jeton (`token_required`)                   |
| 404             | Ressource absente ou non autorisée (on ne révèle pas son existence)             |
| 413             | Corps trop gros                                                                 |
| 422             | Données invalides                                                               |
| 429             | Trop de tentatives                                                              |
| 500             | Erreur inattendue (détail dans les journaux du serveur, jamais dans la réponse) |

## Ajouter une route

1. Créer `src/app/api/v1/<ressource>/route.ts` et l'envelopper avec `withUser` (`src/lib/api.ts`).
2. Traduire les erreurs métier en HTTP dans `domainError()` (`src/lib/api.ts`).
3. Ne jamais renvoyer un objet Prisma brut : passer par un serializer (`src/lib/api-serializers.ts`).
4. Décrire la route dans `src/lib/openapi.ts`.
5. Ajouter la fonction correspondante dans `mobile/src/api/client.ts`.
