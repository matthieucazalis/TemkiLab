import type { DeepStrings } from "./types";

const fr = {
  mainLabel: "Navigation principale",
  settings: "Réglages",
  profile: "Mon profil",
  home: "Accueil",
  simulator: "Simulateur",
  setups: "Mes setups",
  signIn: "Se connecter",
  signUp: "Créer un compte",
  guest: "Invité",
};

const en: DeepStrings<typeof fr> = {
  mainLabel: "Main navigation",
  settings: "Settings",
  profile: "My profile",
  home: "Home",
  simulator: "Simulator",
  setups: "My setups",
  signIn: "Sign in",
  signUp: "Create an account",
  guest: "Guest",
};

const de: DeepStrings<typeof fr> = {
  mainLabel: "Hauptnavigation",
  settings: "Einstellungen",
  profile: "Mein Profil",
  home: "Startseite",
  simulator: "Simulator",
  setups: "Meine Setups",
  signIn: "Anmelden",
  signUp: "Konto erstellen",
  guest: "Gast",
};

export const nav = { fr, en, de };
