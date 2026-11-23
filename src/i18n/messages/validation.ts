import type { DeepStrings } from "./types";

// Ces clés sont utilisées comme messages d'erreur par les schémas Zod
// (voir lib/validators) puis traduites au moment d'afficher l'erreur.
const fr = {
  min2: "2 caractères minimum",
  min8: "8 caractères minimum",
  max72: "72 caractères maximum",
  email: "Email invalide",
  passwordMismatch: "Les mots de passe ne correspondent pas",
  currentPasswordRequired: "Mot de passe actuel requis",
  forbiddenChars:
    "Caractères non autorisés (caractères de contrôle ou invisibles).",
  invalid: "Données invalides.",
  rangeInvalid: "La valeur minimale dépasse la valeur maximale.",
};

const en: DeepStrings<typeof fr> = {
  min2: "At least 2 characters",
  min8: "At least 8 characters",
  max72: "72 characters maximum",
  email: "Invalid email address",
  passwordMismatch: "The passwords do not match",
  currentPasswordRequired: "Current password required",
  forbiddenChars: "Characters not allowed (control or invisible characters).",
  invalid: "Invalid data.",
  rangeInvalid: "The minimum value is greater than the maximum value.",
};

const de: DeepStrings<typeof fr> = {
  min2: "Mindestens 2 Zeichen",
  min8: "Mindestens 8 Zeichen",
  max72: "Höchstens 72 Zeichen",
  email: "Ungültige E-Mail-Adresse",
  passwordMismatch: "Die Passwörter stimmen nicht überein",
  currentPasswordRequired: "Aktuelles Passwort erforderlich",
  forbiddenChars: "Nicht erlaubte Zeichen (Steuer- oder unsichtbare Zeichen).",
  invalid: "Ungültige Daten.",
  rangeInvalid: "Der Mindestwert ist größer als der Höchstwert.",
};

export const validation = { fr, en, de };
