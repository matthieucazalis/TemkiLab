import type { Locale } from "../config";
import { auth } from "./auth";
import { common } from "./common";
import { dashboard } from "./dashboard";
import { email } from "./email";
import { errors } from "./errors";
import { landing } from "./landing";
import { legal } from "./legal";
import { nav } from "./nav";
import { profile } from "./profile";
import { settings } from "./settings";
import { validation } from "./validation";

// Un domaine = un fichier contenant les trois langues côte à côte.
const domains = {
  common,
  validation,
  errors,
  email,
  auth,
  nav,
  settings,
  profile,
  dashboard,
  landing,
  legal,
};

type Domains = typeof domains;

// La forme de référence est celle du français.
export type Messages = { [D in keyof Domains]: Domains[D]["fr"] };

function pick(locale: Locale): Messages {
  return Object.fromEntries(
    Object.entries(domains).map(([name, langs]) => [name, langs[locale]]),
  ) as Messages;
}

export const messages: Record<Locale, Messages> = {
  fr: pick("fr"),
  en: pick("en"),
  de: pick("de"),
};
