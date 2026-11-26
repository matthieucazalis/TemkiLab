import type { DeepStrings } from "./types";

const fr = {
  mainLabel: "Navigation principale",
  settings: "Paramètres",
  profile: "Mon profil",
  home: "Accueil",
  dashboard: "Tableau de bord",
  simulator: "Simulateur",
};

const en: DeepStrings<typeof fr> = {
  mainLabel: "Main navigation",
  settings: "Settings",
  profile: "My profile",
  home: "Home",
  dashboard: "Dashboard",
  simulator: "Simulator",
};

const de: DeepStrings<typeof fr> = {
  mainLabel: "Hauptnavigation",
  settings: "Einstellungen",
  profile: "Mein Profil",
  home: "Startseite",
  dashboard: "Dashboard",
  simulator: "Simulator",
};

export const nav = { fr, en, de };
