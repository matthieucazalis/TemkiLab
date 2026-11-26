import type { DeepStrings } from "./types";

const fr = {
  title: "Mes setups",
  intro:
    "Les combinaisons boîtier, objectif et cadrage que tu as enregistrées depuis le simulateur.",
  count: "{count} setup(s)",
  emptyTitle: "Aucun setup pour l'instant",
  emptyText:
    "Règle un cadrage dans le simulateur : tu pourras bientôt l'enregistrer ici pour le retrouver en un clic.",
  newTile: "Nouveau setup",
  newTileHint: "Ouvrir le simulateur",
  soon: "L'enregistrement des setups arrive bientôt.",
  open: "Ouvrir le simulateur",
};

const en: DeepStrings<typeof fr> = {
  title: "My setups",
  intro:
    "The camera, lens and framing combinations you saved from the simulator.",
  count: "{count} setup(s)",
  emptyTitle: "No setups yet",
  emptyText:
    "Dial in a framing in the simulator: soon you will be able to save it here and get it back in one click.",
  newTile: "New setup",
  newTileHint: "Open the simulator",
  soon: "Saving setups is coming soon.",
  open: "Open the simulator",
};

const de: DeepStrings<typeof fr> = {
  title: "Meine Setups",
  intro:
    "Die Kombinationen aus Kamera, Objektiv und Bildausschnitt, die du im Simulator gespeichert hast.",
  count: "{count} Setup(s)",
  emptyTitle: "Noch keine Setups",
  emptyText:
    "Stelle im Simulator einen Bildausschnitt ein: bald kannst du ihn hier speichern und mit einem Klick wiederfinden.",
  newTile: "Neues Setup",
  newTileHint: "Simulator öffnen",
  soon: "Das Speichern von Setups kommt bald.",
  open: "Simulator öffnen",
};

export const setups = { fr, en, de };
