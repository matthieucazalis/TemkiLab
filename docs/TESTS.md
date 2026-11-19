# Tests

| Niveau       | Outil      | Où                        | Commande                   | Base de données    |
| ------------ | ---------- | ------------------------- | -------------------------- | ------------------ |
| Unitaires    | Vitest     | `src/**/*.test.ts`        | `npm test`                 | Non                |
| Intégration  | Vitest     | `tests/integration/`      | `npm run test:integration` | **Oui** (`*_test`) |
| Bout en bout | Playwright | `e2e/`                    | `npm run test:e2e`         | **Oui** (`*_test`) |
| Mobile       | Vitest     | `mobile/src/**/*.test.ts` | `cd mobile && npm test`    | Non                |

## Bases de test

Les tests d'intégration et e2e créent et suppriment des données : ils **refusent** de tourner sur une base dont le
nom ne se termine pas par `_test`.

```bash
# créer la base de test (une fois), puis appliquer les migrations
docker compose exec db createdb -U temkilab temkilab_test
DATABASE_URL=postgresql://temkilab:temkilab_dev@localhost:5432/temkilab_test npx prisma migrate deploy

DATABASE_URL=postgresql://temkilab:temkilab_dev@localhost:5432/temkilab_test npm run test:integration
npm run test:e2e        # construit le site et le lance sur le port 3100
```

## Ce que couvre le template

- **Unitaires** : traductions (mêmes clés dans les 3 langues), redirections sûres, limitation de tentatives,
  photo de profil, formats de date, cohérence OpenAPI ↔ routes.
- **Intégration** : inscription concurrente, limitation de connexion, réinitialisation du mot de passe
  (jeton à usage unique, expiré, inventé), purge, export et suppression de compte.
- **E2E** : inscription / connexion / déconnexion, accès protégé, profil, réglages (langue, thème), PWA, API, responsive.
- **Mobile** : client HTTP (erreurs typées, délai), traductions, adresse du serveur.

## Intégration continue

`.github/workflows/ci.yml` lance lint, types, tests, build, e2e et les vérifications du dossier `mobile/`.
