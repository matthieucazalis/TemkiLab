import type { DeepStrings } from "./types";

const fr = {
  title: "Tableau de bord",
  welcome: "Bienvenue, {name} !",
  intro:
    "Ton compte est prêt. Le simulateur montre comment la focale, l'ouverture et le ratio changent un cadrage.",
  nextTitle: "Simulateur",
  nextText:
    "Compare des boîtiers et des objectifs réels du catalogue, ou règle librement les valeurs.",
  open: "Ouvrir le simulateur",
};

const en: DeepStrings<typeof fr> = {
  title: "Dashboard",
  welcome: "Welcome, {name}!",
  intro:
    "Your account is ready. The simulator shows how focal length, aperture and ratio change a framing.",
  nextTitle: "Simulator",
  nextText:
    "Compare real cameras and lenses from the catalogue, or set the values freely.",
  open: "Open the simulator",
};

const de: DeepStrings<typeof fr> = {
  title: "Dashboard",
  welcome: "Willkommen, {name}!",
  intro:
    "Dein Konto ist bereit. Der Simulator zeigt, wie Brennweite, Blende und Seitenverhältnis einen Bildausschnitt verändern.",
  nextTitle: "Simulator",
  nextText:
    "Vergleiche echte Kameras und Objektive aus dem Katalog oder stelle die Werte frei ein.",
  open: "Simulator öffnen",
};

export const dashboard = { fr, en, de };
