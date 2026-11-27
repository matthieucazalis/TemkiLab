import type { DeepStrings } from "./types";

const fr = {
  title: "Mes setups",
  intro:
    "Les combinaisons boîtier, objectif et cadrage que tu as enregistrées depuis le simulateur.",
  count: "{count} setup(s)",
  emptyTitle: "Aucun setup pour l'instant",
  emptyText:
    "Règle un cadrage dans le simulateur puis enregistre-le : tu le retrouveras ici en un clic.",
  newTile: "Nouveau setup",
  newTileHint: "Ouvrir le simulateur",
  saved: "Setup enregistré.",
  renamed: "Setup renommé.",
  deleted: "Setup supprimé.",
  notFound: "Ce setup n'existe plus.",
  limitReached:
    "Tu as atteint la limite de {count} setups. Supprime-en un pour en enregistrer un autre.",
  save: {
    title: "Enregistrer ce setup",
    label: "Nom du setup",
    placeholder: "Ex. Portrait 85 mm",
    viewAll: "Voir mes setups",
  },
  tile: {
    open: "Ouvrir",
    favorite: "Mettre en favori",
    unfavorite: "Retirer des favoris",
    rename: "Renommer",
    delete: "Supprimer",
    confirmDelete: "Confirmer",
    nameLabel: "Nom du setup",
    generalMode: "Mode général",
    invalidState: "Réglages illisibles",
  },
  open: "Ouvrir le simulateur",
};

const en: DeepStrings<typeof fr> = {
  title: "My setups",
  intro:
    "The camera, lens and framing combinations you saved from the simulator.",
  count: "{count} setup(s)",
  emptyTitle: "No setups yet",
  emptyText:
    "Dial in a framing in the simulator, then save it: you will find it here in one click.",
  newTile: "New setup",
  newTileHint: "Open the simulator",
  saved: "Setup saved.",
  renamed: "Setup renamed.",
  deleted: "Setup deleted.",
  notFound: "This setup no longer exists.",
  limitReached:
    "You have reached the limit of {count} setups. Delete one to save another.",
  save: {
    title: "Save this setup",
    label: "Setup name",
    placeholder: "E.g. 85 mm portrait",
    viewAll: "View my setups",
  },
  tile: {
    open: "Open",
    favorite: "Add to favourites",
    unfavorite: "Remove from favourites",
    rename: "Rename",
    delete: "Delete",
    confirmDelete: "Confirm",
    nameLabel: "Setup name",
    generalMode: "General mode",
    invalidState: "Unreadable settings",
  },
  open: "Open the simulator",
};

const de: DeepStrings<typeof fr> = {
  title: "Meine Setups",
  intro:
    "Die Kombinationen aus Kamera, Objektiv und Bildausschnitt, die du im Simulator gespeichert hast.",
  count: "{count} Setup(s)",
  emptyTitle: "Noch keine Setups",
  emptyText:
    "Stelle im Simulator einen Bildausschnitt ein und speichere ihn: Du findest ihn hier mit einem Klick wieder.",
  newTile: "Neues Setup",
  newTileHint: "Simulator öffnen",
  saved: "Setup gespeichert.",
  renamed: "Setup umbenannt.",
  deleted: "Setup gelöscht.",
  notFound: "Dieses Setup existiert nicht mehr.",
  limitReached:
    "Du hast das Limit von {count} Setups erreicht. Lösche eines, um ein weiteres zu speichern.",
  save: {
    title: "Dieses Setup speichern",
    label: "Name des Setups",
    placeholder: "Z. B. 85-mm-Porträt",
    viewAll: "Meine Setups ansehen",
  },
  tile: {
    open: "Öffnen",
    favorite: "Zu Favoriten hinzufügen",
    unfavorite: "Aus Favoriten entfernen",
    rename: "Umbenennen",
    delete: "Löschen",
    confirmDelete: "Bestätigen",
    nameLabel: "Name des Setups",
    generalMode: "Allgemeiner Modus",
    invalidState: "Unlesbare Einstellungen",
  },
  open: "Simulator öffnen",
};

export const setups = { fr, en, de };
