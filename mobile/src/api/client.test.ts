import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { echec } from "./echec";
import { ErreurApi, appel, connexion, creerApi } from "./client";

const SERVEUR = "http://serveur.test";

function reponse(statut: number, corps?: unknown) {
  return new Response(corps === undefined ? null : JSON.stringify(corps), {
    status: statut,
    headers: { "Content-Type": "application/json" },
  });
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const dernierAppel = () => {
  const [url, init] = fetchMock.mock.calls.at(-1) as [
    string,
    RequestInit & { headers: Record<string, string> },
  ];
  return { url, init };
};

describe("appel", () => {
  it("envoie le jeton dans l'en-tête Authorization et lit le JSON", async () => {
    fetchMock.mockResolvedValue(reponse(200, { id: "u1" }));
    const resultat = await appel<{ id: string }>(SERVEUR, "/me", {
      jeton: "tok_abc",
    });

    expect(resultat).toEqual({ id: "u1" });
    const { url, init } = dernierAppel();
    expect(url).toBe("http://serveur.test/api/v1/me");
    expect(init.headers.Authorization).toBe("Bearer tok_abc");
    expect(init.method).toBe("GET");
  });

  it("n'envoie pas d'en-tête Authorization sans jeton", async () => {
    fetchMock.mockResolvedValue(reponse(200, {}));
    await appel(SERVEUR, "/me");
    expect(dernierAppel().init.headers.Authorization).toBeUndefined();
  });

  it("envoie le corps en JSON", async () => {
    fetchMock.mockResolvedValue(reponse(200, {}));
    await appel(SERVEUR, "/x", { methode: "POST", corps: { a: 1 } });
    const { init } = dernierAppel();
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe('{"a":1}');
  });

  it("gère une réponse 204 sans corps", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(
      appel(SERVEUR, "/me/avatar", { methode: "DELETE" }),
    ).resolves.toBeUndefined();
  });

  it.each([
    [401, { error: { code: "unauthenticated" } }, "non_authentifie"],
    [401, { error: { code: "invalid_credentials" } }, "identifiants"],
    [429, { error: { code: "too_many_attempts" } }, "trop_de_tentatives"],
    [404, { error: { code: "not_found" } }, "introuvable"],
    [409, { error: { code: "conflict" } }, "conflit"],
    [422, { error: { code: "validation", fields: ["title"] } }, "validation"],
    [422, { error: { code: "invalid_image" } }, "image"],
    [500, { error: { code: "internal_error" } }, "serveur"],
    [418, undefined, "inconnue"],
  ])(
    "convertit le statut %i en erreur « %s » typée",
    async (statut, corps, code) => {
      fetchMock.mockResolvedValue(reponse(statut, corps));
      const erreur = await echec(appel(SERVEUR, "/x"));
      expect(erreur).toBeInstanceOf(ErreurApi);
      expect(erreur.code).toBe(code);
      expect(erreur.statut).toBe(statut);
    },
  );

  it("transmet la liste des champs invalides", async () => {
    fetchMock.mockResolvedValue(
      reponse(422, {
        error: { code: "validation", fields: ["title", "context"] },
      }),
    );
    const erreur = await echec(appel(SERVEUR, "/x"));
    expect(erreur.champs).toEqual(["title", "context"]);
  });

  it("signale une panne réseau (serveur éteint, mauvaise adresse)", async () => {
    fetchMock.mockRejectedValue(new TypeError("Network request failed"));
    const erreur = await echec(appel(SERVEUR, "/x"));
    expect(erreur.code).toBe("reseau");
  });

  it("signale un délai dépassé", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_ok, rejeter) => {
          init.signal?.addEventListener("abort", () =>
            rejeter(Object.assign(new Error("abort"), { name: "AbortError" })),
          );
        }),
    );
    const promesse = echec(appel(SERVEUR, "/x"));
    await vi.advanceTimersByTimeAsync(15_001);
    expect((await promesse).code).toBe("delai");
  });

  it("une réponse non JSON sur une erreur ne plante pas", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>Bad gateway</html>", { status: 502 }),
    );
    const erreur = await echec(appel(SERVEUR, "/x"));
    expect(erreur.code).toBe("serveur");
  });
});

describe("fonctions de l'API", () => {
  const api = creerApi(SERVEUR, "tok_jeton");

  it("moi() lit le profil avec le jeton", async () => {
    fetchMock.mockResolvedValue(
      reponse(200, { id: "u", name: "N", email: "e@x.fr" }),
    );
    await api.moi();
    const { url, init } = dernierAppel();
    expect(url).toBe("http://serveur.test/api/v1/me");
    expect(init.headers.Authorization).toBe("Bearer tok_jeton");
  });

  it("envoyerPhoto envoie l'image en PUT, supprimerPhoto la retire", async () => {
    fetchMock.mockResolvedValue(reponse(200, { avatar: "x" }));
    await api.envoyerPhoto("data:image/jpeg;base64,AAAA");
    let { url, init } = dernierAppel();
    expect(url).toBe("http://serveur.test/api/v1/me/avatar");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body as string)).toEqual({
      dataUrl: "data:image/jpeg;base64,AAAA",
    });

    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await api.supprimerPhoto();
    ({ url, init } = dernierAppel());
    expect(init.method).toBe("DELETE");
  });

  it("deconnexion révoque le jeton côté serveur", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await api.deconnexion();
    const { url, init } = dernierAppel();
    expect(url).toBe("http://serveur.test/api/v1/auth/token");
    expect(init.method).toBe("DELETE");
  });

  it("connexion envoie email, mot de passe et nom d'appareil, sans jeton", async () => {
    fetchMock.mockResolvedValue(
      reponse(200, {
        token: "tok_x",
        expiresAt: "2026-12-01",
        user: { id: "u", name: "N", email: "e@x.fr" },
      }),
    );
    const r = await connexion(SERVEUR, "e@x.fr", "secret", "Mobile (android)");
    expect(r.token).toBe("tok_x");
    const { url, init } = dernierAppel();
    expect(url).toBe("http://serveur.test/api/v1/auth/token");
    expect(init.headers.Authorization).toBeUndefined();
    expect(JSON.parse(init.body as string)).toEqual({
      email: "e@x.fr",
      password: "secret",
      deviceName: "Mobile (android)",
    });
  });
});
