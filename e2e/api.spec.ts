import { expect, request, test } from "@playwright/test";
import { signUpAndLogin } from "./helpers";

test.describe("API REST v1", () => {
  test("refuse les requêtes sans session (401 JSON)", async ({ baseURL }) => {
    const anonymous = await request.newContext({ baseURL });
    const res = await anonymous.get("/api/v1/me");
    expect(res.status()).toBe(401);
    expect((await res.json()).error.code).toBe("unauthenticated");
    await anonymous.dispose();
  });

  test("renvoie le profil du compte connecté, sans mot de passe", async ({
    page,
  }) => {
    const email = await signUpAndLogin(page, "Api Testeur");

    const me = await page.request.get("/api/v1/me");
    expect(me.status()).toBe(200);
    const body = await me.json();
    expect(body.email).toBe(email);
    expect(JSON.stringify(body)).not.toContain("passwordHash");

    // une écriture avec le seul cookie de session est refusée (protection CSRF)
    const write = await page.request.put("/api/v1/me/avatar", {
      data: { dataUrl: "data:image/png;base64,AAAA" },
    });
    expect(write.status()).toBe(403);

    const spec = await page.request.get("/api/v1/openapi.json");
    expect((await spec.json()).openapi).toMatch(/^3\./);
  });
});
