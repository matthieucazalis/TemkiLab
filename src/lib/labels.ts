import type { Translator } from "@/i18n/translate";

// Nom stocké quand un compte est anonymisé (droit à l'effacement) : il est
// remplacé à l'affichage par un libellé dans la langue de l'utilisateur.
export const DELETED_USER_NAME = "[deleted]";

export const displayName = (t: Translator, name: string) =>
  name === DELETED_USER_NAME ? t("common.unknownUser") : name;
