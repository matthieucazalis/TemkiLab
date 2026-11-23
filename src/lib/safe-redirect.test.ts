import { describe, expect, it } from "vitest";
import { safeCallbackPath } from "./safe-redirect";

describe("safeCallbackPath", () => {
  it("accepte un chemin interne", () => {
    expect(safeCallbackPath("/invite/abc123")).toBe("/invite/abc123");
    expect(safeCallbackPath("/dashboard/x/list?status=ACTIVE")).toBe(
      "/dashboard/x/list?status=ACTIVE",
    );
  });

  it("réduit une URL absolue à son chemin (adresse d'origine ignorée)", () => {
    expect(safeCallbackPath("http://localhost:3000/dashboard/x")).toBe(
      "/dashboard/x",
    );
    expect(safeCallbackPath("https://evil.example/dashboard")).toBe(
      "/dashboard",
    );
  });

  it("refuse les redirections vers un autre site", () => {
    expect(safeCallbackPath("//evil.example")).toBe("/dashboard");
    expect(safeCallbackPath("/\\evil.example")).toBe("/dashboard");
    expect(safeCallbackPath("javascript:alert(1)")).toBe("/dashboard");
  });

  it("renvoie la valeur de repli si la valeur est absente ou invalide", () => {
    expect(safeCallbackPath(null)).toBe("/dashboard");
    expect(safeCallbackPath(undefined)).toBe("/dashboard");
    expect(safeCallbackPath(["/a", "/b"])).toBe("/dashboard");
    expect(safeCallbackPath("a".repeat(600))).toBe("/dashboard");
  });

  it("ne renvoie jamais vers les pages de connexion (boucle)", () => {
    expect(safeCallbackPath("/login")).toBe("/dashboard");
    expect(safeCallbackPath("/register?x=1")).toBe("/dashboard");
  });
});
