# TemkiLab Mobile

Application mobile (React Native + Expo) de **TemkiLab**. Elle se connecte au serveur du site (Next.js) par son
**API REST** (`/api/v1`) : mêmes comptes, mêmes droits.

## Ce que fait l'application

| Écran                | Rôle                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Connexion**        | Adresse du serveur, email, mot de passe. Le jeton reçu est gardé dans le coffre sécurisé du téléphone       |
| **Accueil** (onglet) | Écran de départ à remplacer par les écrans de ton projet                                                    |
| **Profil** (onglet)  | **Photo** (appareil photo ou galerie), langue FR/EN/DE, thème clair/sombre/système, vibrations, déconnexion |

## Lancer le projet

Trois choses doivent tourner : la base de données, le site (qui sert l'API), puis l'application.

```bash
# 1. À la racine du dépôt : base de données et site, visible sur le réseau
docker compose up -d
npm install && npx prisma migrate dev && npm run db:seed
npm run dev -- -H 0.0.0.0          # le site écoute sur toutes les interfaces (port 3000)

# 2. Dans ce dossier (mobile/) : l'application
cd mobile
npm install
npx expo start
```

`npx expo start` affiche un **QR code** : scanne-le avec **Expo Go** (Android) ou l'appareil photo (iPhone).
Le téléphone et l'ordinateur doivent être sur le **même Wi-Fi** (sinon `npx expo start --tunnel`).

**Compte de démonstration** (après `npm run db:seed`) : `demo@temkilab.test` / `Demo-temkilab-1`.

**Adresse du serveur** : l'application la devine à partir de l'adresse de Metro (ton ordinateur, port 3000).
Sinon, tape-la sur l'écran de connexion (ex. `192.168.1.42:3000`) ou définis `EXPO_PUBLIC_API_URL`
(voir `.env.example`).

## Structure

```
src/
├─ app/          Écrans : un fichier = un écran (Expo Router)
│  ├─ _layout.tsx   Providers (préférences, session) + pile de navigation protégée
│  ├─ connexion.tsx
│  └─ (tabs)/       Onglets : index (accueil), profil
├─ api/          client.ts (appels fetch + erreurs typées), adresse.ts, serveur.ts
├─ components/   Bouton, Carte, ChampTexte, Texte, Avatar, Choix, Etats, Icones
├─ constants/    theme.ts (couleurs clair / sombre)
├─ context/      auth.tsx (session), preferences.tsx (langue, thème, vibrations)
├─ data/         types.ts (types de l'API)
├─ hooks/        useChargement, useStockage, useDebounce
├─ i18n/         Traductions FR / EN / DE (typées : une clé oubliée ne compile pas)
└─ lib/          secret.ts (coffre sécurisé), vibrations.ts
```

## Ajouter un écran

1. Créer le fichier dans `src/app/` (ou `src/app/(tabs)/` pour un onglet) — le chemin devient l'URL.
2. Déclarer l'écran dans `src/app/_layout.tsx` (pile) ou `(tabs)/_layout.tsx` (onglet).
3. Ajouter la fonction d'API dans `src/api/client.ts` et le type dans `src/data/types.ts`.
4. Ajouter les textes dans `src/i18n/messages.ts` (fr, en, de).

## Commandes

| Commande            | Rôle                                     |
| ------------------- | ---------------------------------------- |
| `npm run typecheck` | Vérification TypeScript                  |
| `npm run lint`      | ESLint (Expo)                            |
| `npm test`          | Tests (client API, traductions, adresse) |

## Installer l'application sans Expo Go

Voir `eas.json` : `npx eas build --profile preview --platform android` produit un `.apk`.
Le serveur doit alors être en **HTTPS** (Android refuse le trafic `http://` non chiffré hors Expo Go).
