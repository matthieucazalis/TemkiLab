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
import { setups } from "./setups";
import { simulator } from "./simulator";
import { validation } from "./validation";

const domains = {
  common,
  validation,
  errors,
  email,
  auth,
  nav,
  settings,
  setups,
  profile,
  dashboard,
  simulator,
  landing,
  legal,
};

type Domains = typeof domains;

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
