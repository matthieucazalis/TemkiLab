import { expect, type Page } from "@playwright/test";

export const PASSWORD = "Motdepasse-e2e-1";

export function uniqueEmail(prefix = "user") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.test`;
}

export async function register(
  page: Page,
  name: string,
  email: string,
  password = PASSWORD,
) {
  await page.goto("/register");
  await page.getByLabel("Nom", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mot de passe", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await page.waitForURL(/\/login\?registered=1/);
}

export async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mot de passe", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

// Comme login(), mais attend d'être réellement connecté (redirection vers
// /dashboard). À utiliser quand la suite du test a besoin de la session : sans
// cela, un goto() immédiat annule la connexion en cours.
export async function loginAndWait(
  page: Page,
  email: string,
  password = PASSWORD,
) {
  await login(page, email, password);
  await page.waitForURL(/\/dashboard/);
}

export async function signUpAndLogin(page: Page, name = "Testeur") {
  const email = uniqueEmail();
  await register(page, name, email);
  await login(page, email);
  await expect(
    page.getByRole("heading", { name: "Tableau de bord", level: 1 }),
  ).toBeVisible();
  return email;
}
