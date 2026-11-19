import type { DeepStrings } from "./types";

const fr = {
  tagline: "Le point de départ de ton prochain projet",
  intro:
    "TemkiLab est une base web et mobile prête à l'emploi : comptes, profil, réglages, mode hors ligne et API pour ton application.",
  ctaLogin: "Se connecter",
  ctaRegister: "Créer un compte",
  ctaOpen: "Ouvrir mon espace",
  featuresTitle: "Tout est déjà en place",
  securityTitle: "Comptes sécurisés",
  securityText:
    "Inscription, connexion, mot de passe oublié, limitation des tentatives et suppression du compte.",
  mobileTitle: "Application mobile",
  mobileText:
    "Une app Expo / React Native connectée à la même API, avec jeton révocable.",
  offlineTitle: "Mode hors ligne",
  offlineText:
    "Application installable (PWA) avec une page claire quand le réseau disparaît.",
  languageTitle: "Multilingue",
  languageText:
    "Français, anglais et allemand, avec thème clair ou sombre et préférences enregistrées.",
  finalTitle: "Prêt à t'y mettre ?",
  finalText: "Crée un compte gratuitement pour découvrir l'application.",
  privacy: "Confidentialité",
  notice: "Mentions légales",
};

const en: DeepStrings<typeof fr> = {
  tagline: "The starting point for your next project",
  intro:
    "TemkiLab is a ready-to-use web and mobile base: accounts, profile, settings, offline mode and an API for your application.",
  ctaLogin: "Log in",
  ctaRegister: "Create an account",
  ctaOpen: "Open my space",
  featuresTitle: "Everything is already in place",
  securityTitle: "Secure accounts",
  securityText:
    "Sign-up, login, forgotten password, attempt limiting and account deletion.",
  mobileTitle: "Mobile app",
  mobileText:
    "An Expo / React Native app connected to the same API, with revocable tokens.",
  offlineTitle: "Offline mode",
  offlineText:
    "Installable app (PWA) with a clear page when the network goes away.",
  languageTitle: "Multilingual",
  languageText:
    "French, English and German, with light or dark theme and saved preferences.",
  finalTitle: "Ready to get started?",
  finalText: "Create a free account to try the application.",
  privacy: "Privacy",
  notice: "Legal notice",
};

const de: DeepStrings<typeof fr> = {
  tagline: "Der Ausgangspunkt für dein nächstes Projekt",
  intro:
    "TemkiLab ist eine einsatzbereite Web- und Mobil-Basis: Konten, Profil, Einstellungen, Offline-Modus und eine API für deine Anwendung.",
  ctaLogin: "Anmelden",
  ctaRegister: "Konto erstellen",
  ctaOpen: "Meinen Bereich öffnen",
  featuresTitle: "Alles ist bereits vorhanden",
  securityTitle: "Sichere Konten",
  securityText:
    "Registrierung, Anmeldung, Passwort vergessen, Begrenzung der Versuche und Kontolöschung.",
  mobileTitle: "Mobile App",
  mobileText:
    "Eine Expo-/React-Native-App an derselben API, mit widerrufbarem Token.",
  offlineTitle: "Offline-Modus",
  offlineText:
    "Installierbare App (PWA) mit einer klaren Seite, wenn das Netz ausfällt.",
  languageTitle: "Mehrsprachig",
  languageText:
    "Französisch, Englisch und Deutsch, mit hellem oder dunklem Design und gespeicherten Einstellungen.",
  finalTitle: "Bereit loszulegen?",
  finalText: "Erstelle kostenlos ein Konto, um die Anwendung auszuprobieren.",
  privacy: "Datenschutz",
  notice: "Impressum",
};

export const landing = { fr, en, de };
