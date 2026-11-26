import { expect, test, type Page } from "@playwright/test";
import { signUpAndLogin } from "./helpers";

test.use({ viewport: { width: 375, height: 812 } });

async function expectNoHorizontalScroll(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("main").first()).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow, `${path} déborde de ${overflow}px`).toBeLessThanOrEqual(0);
}

test.describe("responsive (375 px)", () => {
  test("les pages publiques ne défilent pas horizontalement", async ({
    page,
  }) => {
    await expectNoHorizontalScroll(page, "/login");
    await expectNoHorizontalScroll(page, "/register");
  });

  test("les pages connectées tiennent dans l'écran", async ({ page }) => {
    await signUpAndLogin(page);
    for (const path of ["/", "/setups", "/profile", "/settings"])
      await expectNoHorizontalScroll(page, path);
  });
});
