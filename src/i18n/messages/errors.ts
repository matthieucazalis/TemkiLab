import type { DeepStrings } from "./types";

const fr = {
  forbidden: "Accès refusé.",
  notAllowed: "Action non autorisée.",
  invalidData: "Données invalides.",
  emailTaken: "Cet email est déjà utilisé.",
  invalidCredentials: "Identifiants invalides.",
  tooManyAttempts: "Trop de tentatives. Réessaie dans 15 minutes.",
  wrongPassword: "Mot de passe actuel incorrect.",
  pageTitle: "Une erreur est survenue",
  pageText: "Quelque chose s'est mal passé. Tu peux réessayer.",
  retry: "Réessayer",
};

const en: DeepStrings<typeof fr> = {
  forbidden: "Access denied.",
  notAllowed: "Action not allowed.",
  invalidData: "Invalid data.",
  emailTaken: "This email address is already in use.",
  invalidCredentials: "Invalid credentials.",
  tooManyAttempts: "Too many attempts. Try again in 15 minutes.",
  wrongPassword: "Current password is incorrect.",
  pageTitle: "Something went wrong",
  pageText: "Something went wrong. You can try again.",
  retry: "Try again",
};

const de: DeepStrings<typeof fr> = {
  forbidden: "Zugriff verweigert.",
  notAllowed: "Aktion nicht erlaubt.",
  invalidData: "Ungültige Daten.",
  emailTaken: "Diese E-Mail-Adresse wird bereits verwendet.",
  invalidCredentials: "Ungültige Anmeldedaten.",
  tooManyAttempts: "Zu viele Versuche. Versuche es in 15 Minuten erneut.",
  wrongPassword: "Das aktuelle Passwort ist falsch.",
  pageTitle: "Ein Fehler ist aufgetreten",
  pageText: "Etwas ist schiefgelaufen. Du kannst es erneut versuchen.",
  retry: "Erneut versuchen",
};

export const errors = { fr, en, de };
