import { describe, expect, it } from "vitest";
import {
  LENS_SEARCH_LIMITS,
  lensSearchToParams,
  parseLensSearch,
  type RawSearchParams,
} from "./lens";

const accepts = (raw: RawSearchParams) => parseLensSearch(raw).success;

function parsed(raw: RawSearchParams) {
  const result = parseLensSearch(raw);
  if (!result.success) throw new Error("recherche refusée à tort");
  return result.data;
}

describe("parseLensSearch", () => {
  it("accepte l'absence de filtre et applique les valeurs par défaut", () => {
    expect(parsed({})).toEqual({
      sort: "brand",
      page: 1,
      pageSize: LENS_SEARCH_LIMITS.pageSize.default,
    });
  });

  it("convertit les nombres reçus sous forme de texte", () => {
    const search = parsed({ focalFrom: "35", focalTo: "85", page: "3" });
    expect(search.focalFrom).toBe(35);
    expect(search.focalTo).toBe(85);
    expect(search.page).toBe(3);
  });

  it("traite un champ vide comme « pas de filtre »", () => {
    const search = parsed({ brand: "", focalFrom: "", priceMax: "", sort: "" });
    expect(search.brand).toBeUndefined();
    expect(search.focalFrom).toBeUndefined();
    expect(search.priceMax).toBeUndefined();
    expect(search.sort).toBe("brand");
  });

  it("garde la première valeur quand un paramètre est répété", () => {
    expect(parsed({ brand: ["Sony", "Canon"] }).brand).toBe("Sony");
  });

  it("retire les espaces autour de la marque", () => {
    expect(parsed({ brand: "  Fujifilm " }).brand).toBe("Fujifilm");
  });

  it("refuse un paramètre inconnu", () => {
    expect(accepts({ pirate: "1" })).toBe(false);
  });

  describe("énumérations", () => {
    it.each(["FULL_FRAME", "APS_C", "MICRO_43", "MEDIUM_FORMAT"])(
      "accepte la couverture %s",
      (coverage) => expect(accepts({ coverage })).toBe(true),
    );

    it.each(["ZOOM", "PRIME"])("accepte le type %s", (type) =>
      expect(accepts({ type })).toBe(true),
    );

    it.each([{ coverage: "SUPER_8" }, { type: "zoom" }, { sort: "au_hasard" }])(
      "refuse %j",
      (raw) => expect(accepts(raw)).toBe(false),
    );
  });

  describe("nombres", () => {
    it.each(["abc", "35.5", "0", "-10", "2001"])(
      "refuse la focale %j",
      (focalFrom) => expect(accepts({ focalFrom })).toBe(false),
    );

    it("accepte les bornes de focale", () => {
      expect(accepts({ focalFrom: "1", focalTo: "2000" })).toBe(true);
    });

    it("accepte un prix à 0 mais refuse un prix négatif", () => {
      expect(accepts({ priceMin: "0" })).toBe(true);
      expect(accepts({ priceMin: "-1" })).toBe(false);
    });
  });

  describe("plages", () => {
    it("refuse une focale minimale supérieure à la maximale", () => {
      const result = parseLensSearch({ focalFrom: "100", focalTo: "50" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(["focalTo"]);
        expect(result.error.issues[0].message).toBe("validation.rangeInvalid");
      }
    });

    it("accepte une plage réduite à une seule valeur", () => {
      expect(accepts({ focalFrom: "50", focalTo: "50" })).toBe(true);
    });

    it("refuse un prix minimal supérieur au maximal", () => {
      expect(accepts({ priceMin: "900", priceMax: "300" })).toBe(false);
    });

    it("accepte une plage ouverte d'un seul côté", () => {
      expect(accepts({ focalFrom: "200" })).toBe(true);
      expect(accepts({ priceMax: "500" })).toBe(true);
    });
  });

  describe("pagination", () => {
    it("refuse la page 0", () => {
      expect(accepts({ page: "0" })).toBe(false);
    });

    it("plafonne la taille de page", () => {
      const max = LENS_SEARCH_LIMITS.pageSize.max;
      expect(accepts({ pageSize: String(max) })).toBe(true);
      expect(accepts({ pageSize: String(max + 1) })).toBe(false);
    });
  });

  it("refuse les caractères de contrôle dans la marque", () => {
    expect(accepts({ brand: "Son\u0000y" })).toBe(false);
  });

  it("refuse une marque trop longue", () => {
    expect(accepts({ brand: "x".repeat(41) })).toBe(false);
  });
});

describe("lensSearchToParams", () => {
  it("n'écrit rien quand tout est par défaut", () => {
    expect(lensSearchToParams(parsed({})).toString()).toBe("");
  });

  it("n'écrit que les filtres renseignés", () => {
    const params = lensSearchToParams(
      parsed({ brand: "Sony", focalFrom: "35", sort: "price_asc", page: "2" }),
    );
    expect(params.get("brand")).toBe("Sony");
    expect(params.get("focalFrom")).toBe("35");
    expect(params.get("sort")).toBe("price_asc");
    expect(params.get("page")).toBe("2");
    expect(params.has("priceMax")).toBe(false);
  });

  it("est l'inverse de parseLensSearch", () => {
    const search = parsed({
      brand: "Canon",
      type: "PRIME",
      coverage: "FULL_FRAME",
      focalFrom: "35",
      focalTo: "85",
      priceMin: "200",
      priceMax: "900",
      sort: "aperture",
      page: "4",
      pageSize: "24",
    });
    const params = lensSearchToParams(search);
    expect(parsed(Object.fromEntries(params))).toEqual(search);
  });
});
