import type { DeepStrings } from "./types";

const fr = {
  mainLabel: "Navigation principale",
  settings: "Paramètres",
  profile: "Mon profil",
  home: "Accueil",
  dashboard: "Tableau de bord",
};

const en: DeepStrings<typeof fr> = {
  mainLabel: "Main navigation",
  settings: "Settings",
  profile: "My profile",
  home: "Home",
  dashboard: "Dashboard",
};

const de: DeepStrings<typeof fr> = {
  mainLabel: "Hauptnavigation",
  settings: "Einstellungen",
  profile: "Mein Profil",
  home: "Startseite",
  dashboard: "Dashboard",
};

export const nav = { fr, en, de };
