import { expect, test } from "@playwright/test";
import { signUpAndLogin } from "./helpers";

test.describe("contrôle d'accès", () => {
  test("un visiteur non connecté est renvoyé vers la connexion", async ({
    page,
  }) => {
    for (const path of ["/dashboard", "/profile", "/settings"]) {
      await page.goto(path);
      await expect(page, path).toHaveURL(/\/login/);
    }
  });

  test("les pages publiques restent accessibles", async ({ page }) => {
    for (const path of ["/", "/login", "/register", "/legal/privacy"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
    }
  });

  test("une fois connecté, /login renvoie vers le tableau de bord", async ({
    page,
  }) => {
    await signUpAndLogin(page);
    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
