import type { DeepStrings } from "./types";

const fr = {
  title: "Tableau de bord",
  welcome: "Bienvenue, {name} !",
  intro:
    "Ton compte est prêt. Cette page est un simple point de départ : remplace-la par les écrans de ton application.",
  nextTitle: "Pour continuer",
  nextText:
    "Ajoute tes modèles dans prisma/schema.prisma, tes services dans src/services, puis tes pages dans src/app/(app).",
};

const en: DeepStrings<typeof fr> = {
  title: "Dashboard",
  welcome: "Welcome, {name}!",
  intro:
    "Your account is ready. This page is just a starting point: replace it with your application's screens.",
  nextTitle: "Next steps",
  nextText:
    "Add your models in prisma/schema.prisma, your services in src/services, then your pages in src/app/(app).",
};

const de: DeepStrings<typeof fr> = {
  title: "Dashboard",
  welcome: "Willkommen, {name}!",
  intro:
    "Dein Konto ist bereit. Diese Seite ist nur ein Ausgangspunkt: Ersetze sie durch die Bildschirme deiner Anwendung.",
  nextTitle: "Wie es weitergeht",
  nextText:
    "Füge deine Modelle in prisma/schema.prisma hinzu, deine Services in src/services und deine Seiten in src/app/(app).",
};

export const dashboard = { fr, en, de };
