# TemkiLab

Template **Next.js + Prisma + Expo (React Native)** : une base complète pour démarrer un projet web et mobile
avec comptes, profil, réglages, mode hors ligne et API.

## Ce qui est inclus

| Domaine      | Contenu                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| **Vitrine**  | Page d'accueil publique (`/`) dont les boutons s'adaptent à la session, pages légales                 |
| **Comptes**  | Inscription, connexion, mot de passe oublié / réinitialisation (e-mail), déconnexion, session expirée |
| **Sécurité** | Mots de passe bcrypt, limitation des tentatives, redirections sûres, CSP et en-têtes de sécurité      |
| **Profil**   | Nom, photo de profil, changement de mot de passe, export des données (RGPD), suppression du compte    |
| **Réglages** | Langue (FR / EN / DE), thème clair / sombre / système, retour haptique — enregistrés sur le compte    |
| **PWA**      | Manifeste, icônes, service worker, **page hors ligne** (`/offline`)                                   |
| **API REST** | `/api/v1` : jeton mobile révocable, profil, photo ; documentation `/api-docs` et OpenAPI              |
| **Mobile**   | App Expo / React Native (`mobile/`) : connexion, accueil, profil, préférences, vibrations             |
| **Qualité**  | Tests unitaires, d'intégration, e2e (Playwright), CI GitHub Actions, Docker de production             |

## Démarrer un nouveau projet

```bash
# 1. Renommer le projet (nom affiché, et facultativement slug et identifiant mobile)
npm run init -- "Mon Appli"
#    ex. avec identifiant mobile : npm run init -- "Mon Appli" monappli fr.monecole.monappli

# 2. Configuration locale
cp .env.example .env            # puis renseigner AUTH_SECRET : openssl rand -base64 32
docker compose up -d            # PostgreSQL

# 3. Dépendances, base de données, compte de démonstration
npm install
npx prisma migrate dev
npm run db:seed                 # demo@<slug>.test / Demo-<slug>-1

# 4. Lancer
npm run dev                     # site sur http://localhost:3000
```

`npm run init` ne s'exécute qu'une fois : il se supprime après usage.
Pour lancer le site **et** l'application mobile ensemble : `npm run dev:all` (voir `mobile/README.md`).

## Ce qu'il faut personnaliser en premier

- [ ] **Textes de la vitrine** : `src/i18n/messages/landing.ts` (fr / en / de) et icônes dans `src/components/icons.tsx`
- [ ] **Pages légales** : `src/i18n/messages/legal.ts` — remplacer tous les passages entre `[crochets]`
- [ ] **Couleurs et logo** : `src/app/globals.css` (variables CSS), icônes générées dans `src/app/icons/[name]/route.tsx`
- [ ] **Modèles** : `prisma/schema.prisma`, puis `npx prisma migrate dev`
- [ ] **Espace connecté** : `src/app/(app)/dashboard/page.tsx` (point de départ) et la navigation de `src/app/(app)/layout.tsx`
- [ ] **Compléter** `src/services/account.service.ts` (export et suppression de compte) dès qu'un modèle est lié à `User`
- [ ] **Mobile** : `mobile/app.json` (nom, icônes, identifiants), écrans dans `mobile/src/app/`
- [ ] **Documentation** : compléter `docs/` (squelettes prêts)

## Structure

```
src/app/        Pages : (auth) connexion…, (app) espace connecté, api/v1, offline, legal, page vitrine
src/services/   Logique métier — seule couche qui parle à Prisma
src/lib/        Auth, validation Zod, rate limit, enveloppe d'API, utilitaires
src/i18n/       Traductions FR / EN / DE (un fichier par domaine)
prisma/         Schéma, migrations, seed
mobile/         Application Expo (React Native)
docs/           Architecture, API, i18n, tests, déploiement
e2e/ tests/     Tests bout en bout et d'intégration
```

## Commandes

| Commande                     | Rôle                                |
| ---------------------------- | ----------------------------------- |
| `npm run dev`                | Site en développement               |
| `npm run dev:all`            | Site + application mobile           |
| `npm run build` / `start`    | Build et lancement de production    |
| `npm run lint` / `typecheck` | ESLint / TypeScript                 |
| `npm test`                   | Tests unitaires                     |
| `npm run test:integration`   | Tests d'intégration (base `*_test`) |
| `npm run test:e2e`           | Tests Playwright (base `*_test`)    |
| `npm run db:migrate`         | Nouvelle migration Prisma (dev)     |
| `npm run db:seed`            | Compte de démonstration             |

## Documentation

Voir [`docs/`](docs/README.md) : architecture, API, i18n, tests, déploiement (Docker).

> **Note** : `npm install` utilise `legacy-peer-deps` (fichier `.npmrc`) à cause d'un conflit de dépendances
> optionnelles ; ne le supprime pas sans tester l'installation.
# TemkiLab
