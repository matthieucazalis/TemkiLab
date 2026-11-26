import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { LOCALES, isLocale, matchLocale } from "./config";
import { messages } from "./messages";
import { createTranslator, translate } from "./translate";
import { firstIssueMessage } from "@/lib/validators/messages";
import { registerSchema } from "@/lib/validators/auth";

function flatten(tree: object, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof value === "string"
        ? { ...acc, [path]: value }
        : { ...acc, ...flatten(value as object, path) };
    },
    {},
  );
}

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("dictionnaires", () => {
  const fr = flatten(messages.fr);

  it.each(LOCALES.filter((l) => l !== "fr"))(
    "%s a exactement les mêmes clés que le français",
    (locale) => {
      const other = flatten(messages[locale]);
      expect(Object.keys(other).sort()).toEqual(Object.keys(fr).sort());
    },
  );

  it.each(LOCALES)("%s : aucune traduction vide", (locale) => {
    for (const [key, text] of Object.entries(flatten(messages[locale])))
      if (key !== "common.notAvailable")
        expect(text.trim(), `${locale}:${key}`).not.toBe("");
  });

  it.each(LOCALES.filter((l) => l !== "fr"))(
    "%s garde les mêmes variables {…} que le français",
    (locale) => {
      const other = flatten(messages[locale]);
      for (const [key, text] of Object.entries(fr))
        expect(placeholders(other[key]), `${locale}:${key}`).toEqual(
          placeholders(text),
        );
    },
  );

  it.each(LOCALES.filter((l) => l !== "fr"))(
    "%s : les pluriels « a|b » existent dans les deux langues ou aucune",
    (locale) => {
      const other = flatten(messages[locale]);
      for (const [key, text] of Object.entries(fr))
        expect(other[key].includes("|"), `${locale}:${key}`).toBe(
          text.includes("|"),
        );
    },
  );
});

describe("translate", () => {
  it("remplace les variables", () => {
    expect(translate("fr", "dashboard.welcome", { name: "Léa" })).toBe(
      "Bienvenue, Léa !",
    );
    expect(translate("en", "dashboard.welcome", { name: "Lea" })).toBe(
      "Welcome, Lea!",
    );
  });

  it("accorde le pluriel (0 et 1 au singulier en français)", () => {
    expect(translate("fr", "common.itemCount", { count: 0 })).toBe("0 élément");
    expect(translate("fr", "common.itemCount", { count: 1 })).toBe("1 élément");
    expect(translate("fr", "common.itemCount", { count: 2 })).toBe(
      "2 éléments",
    );
  });

  it("accorde le pluriel (0 au pluriel en anglais et en allemand)", () => {
    expect(translate("en", "common.itemCount", { count: 0 })).toBe("0 items");
    expect(translate("en", "common.itemCount", { count: 1 })).toBe("1 item");
    expect(translate("de", "common.itemCount", { count: 1 })).toBe("1 Element");
    expect(translate("de", "common.itemCount", { count: 5 })).toBe(
      "5 Elemente",
    );
  });

  it("laisse une variable inconnue telle quelle", () => {
    expect(translate("fr", "dashboard.welcome", {})).toBe(
      "Bienvenue, {name} !",
    );
  });

  it("renvoie des textes différents selon la langue", () => {
    expect(createTranslator("fr")("auth.login")).toBe("Se connecter");
    expect(createTranslator("en")("auth.login")).toBe("Sign in");
    expect(createTranslator("de")("auth.login")).toBe("Anmelden");
  });
});

describe("langue", () => {
  it("reconnaît les langues gérées", () => {
    expect(isLocale("de")).toBe(true);
    expect(isLocale("es")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("choisit la langue selon Accept-Language", () => {
    expect(matchLocale("de-DE,de;q=0.9,en;q=0.8")).toBe("de");
    expect(matchLocale("en-US,en;q=0.9")).toBe("en");
    expect(matchLocale("es-ES,es;q=0.9,en;q=0.5")).toBe("en");
    expect(matchLocale("fr-CA")).toBe("fr");
  });

  it("tient compte des poids q", () => {
    expect(matchLocale("en;q=0.5,de;q=0.9")).toBe("de");
  });

  it("retombe sur le français par défaut", () => {
    expect(matchLocale(null)).toBe("fr");
    expect(matchLocale("")).toBe("fr");
    expect(matchLocale("ja,zh;q=0.8")).toBe("fr");
    expect(matchLocale("n'importe;quoi;;")).toBe("fr");
  });
});

describe("messages de validation traduits", () => {
  it("traduit l'erreur d'un schéma Zod selon la langue", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "x@y.fr",
      password: "motdepasse",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(firstIssueMessage(createTranslator("fr"), result.error)).toBe(
      "2 caractères minimum",
    );
    expect(firstIssueMessage(createTranslator("en"), result.error)).toBe(
      "At least 2 characters",
    );
    expect(firstIssueMessage(createTranslator("de"), result.error)).toBe(
      "Mindestens 2 Zeichen",
    );
  });

  it("retombe sur un message générique pour une erreur sans clé", () => {
    const error = new ZodError([
      { code: "custom", path: ["x"], message: "Too big: expected string" },
    ]);
    expect(firstIssueMessage(createTranslator("de"), error)).toBe(
      "Ungültige Daten.",
    );
  });
});
