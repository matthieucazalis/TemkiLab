import type { DeepStrings } from "./types";

const fr = {
  title: "Simulateur",
  intro:
    "Règle la focale, l'ouverture et le ratio pour voir comment le cadrage change.",
  emptyCatalog:
    "Le catalogue de boîtiers et d'objectifs est vide. Lance « npm run db:seed » pour le remplir.",
  preview: {
    label: "Aperçu du cadrage : zoom ×{zoom}, ratio {ratio}",
    note: "Rendu de test : des lignes de repère, sans photo pour l'instant.",
  },
  mode: {
    title: "Mode",
    general: "Général",
    profile: "Profil",
    generalHint: "Valeurs plein format 24x36, sans contrainte de boîtier.",
    profileHint:
      "Les limites du boîtier et de l'objectif choisis s'appliquent.",
  },
  camera: {
    label: "Boîtier",
    placeholder: "Choisir un boîtier",
    info: "{sensor}, recadrage ×{crop}, stabilisation {stops} IL",
    infoNoStab: "{sensor}, recadrage ×{crop}, sans stabilisation",
    chooseHint: "Choisis un boîtier pour appliquer ses limites.",
  },
  lens: {
    label: "Objectif",
    placeholder: "Choisir un objectif",
  },
  focal: {
    label: "Focale",
    locked: "Focale fixe : elle ne se règle pas.",
  },
  aperture: {
    label: "Ouverture",
    limit: "Ouverture maximale de l'objectif : f/{value}",
  },
  ratio: {
    title: "Ratio",
    native: "Natif",
    numeric: "Recadrage numérique",
    all: "Tous les ratios",
    landscape: "Paysage",
    portrait: "Portrait",
    flip: "Inverser paysage et portrait",
  },
  readout: {
    title: "Équivalences",
    focalEq: "Focale équivalente 24x36",
    apertureEq: "Ouverture équivalente",
    minShutter: "Temps de pose maximal",
    minShutterHelp:
      "Au-delà de ce temps de pose sans trépied, le bougé devient probable.",
  },
  warning: {
    lensCoverage:
      "Cet objectif ne couvre pas entièrement le capteur de ce boîtier : les bords de l'image seraient noirs.",
    belowReference:
      "Cette focale est plus large que la scène de référence : le rendu reste à sa largeur maximale.",
  },
  sensor: {
    FULL_FRAME: "Plein format",
    APS_C: "APS-C",
    MICRO_43: "Micro 4/3",
    MEDIUM_FORMAT: "Moyen format",
  },
};

const en: DeepStrings<typeof fr> = {
  title: "Simulator",
  intro:
    "Adjust focal length, aperture and ratio to see how the framing changes.",
  emptyCatalog:
    "The camera and lens catalogue is empty. Run “npm run db:seed” to fill it.",
  preview: {
    label: "Framing preview: zoom ×{zoom}, ratio {ratio}",
    note: "Test render: guide lines only, no photo yet.",
  },
  mode: {
    title: "Mode",
    general: "General",
    profile: "Profile",
    generalHint: "Full-frame 24x36 values, no camera constraints.",
    profileHint: "The limits of the chosen camera and lens apply.",
  },
  camera: {
    label: "Camera",
    placeholder: "Choose a camera",
    info: "{sensor}, crop factor ×{crop}, {stops} stops of stabilisation",
    infoNoStab: "{sensor}, crop factor ×{crop}, no stabilisation",
    chooseHint: "Choose a camera to apply its limits.",
  },
  lens: {
    label: "Lens",
    placeholder: "Choose a lens",
  },
  focal: {
    label: "Focal length",
    locked: "Prime lens: the focal length cannot be changed.",
  },
  aperture: {
    label: "Aperture",
    limit: "Widest aperture of the lens: f/{value}",
  },
  ratio: {
    title: "Ratio",
    native: "Native",
    numeric: "Digital crop",
    all: "All ratios",
    landscape: "Landscape",
    portrait: "Portrait",
    flip: "Switch between landscape and portrait",
  },
  readout: {
    title: "Equivalents",
    focalEq: "Equivalent focal length (24x36)",
    apertureEq: "Equivalent aperture",
    minShutter: "Slowest safe shutter time",
    minShutterHelp:
      "Beyond this shutter time without a tripod, camera shake becomes likely.",
  },
  warning: {
    lensCoverage:
      "This lens does not fully cover this camera's sensor: the image corners would be black.",
    belowReference:
      "This focal length is wider than the reference scene: the render stays at its widest.",
  },
  sensor: {
    FULL_FRAME: "Full frame",
    APS_C: "APS-C",
    MICRO_43: "Micro Four Thirds",
    MEDIUM_FORMAT: "Medium format",
  },
};

const de: DeepStrings<typeof fr> = {
  title: "Simulator",
  intro:
    "Stelle Brennweite, Blende und Seitenverhältnis ein und sieh, wie sich der Bildausschnitt ändert.",
  emptyCatalog:
    "Der Katalog mit Kameras und Objektiven ist leer. Führe „npm run db:seed“ aus, um ihn zu füllen.",
  preview: {
    label: "Vorschau des Bildausschnitts: Zoom ×{zoom}, Verhältnis {ratio}",
    note: "Testdarstellung: nur Hilfslinien, noch kein Foto.",
  },
  mode: {
    title: "Modus",
    general: "Allgemein",
    profile: "Profil",
    generalHint: "Kleinbildwerte 24x36, keine Einschränkung durch die Kamera.",
    profileHint:
      "Es gelten die Grenzen der gewählten Kamera und des gewählten Objektivs.",
  },
  camera: {
    label: "Kamera",
    placeholder: "Kamera wählen",
    info: "{sensor}, Cropfaktor ×{crop}, {stops} Blendenstufen Stabilisierung",
    infoNoStab: "{sensor}, Cropfaktor ×{crop}, ohne Stabilisierung",
    chooseHint: "Wähle eine Kamera, um ihre Grenzen anzuwenden.",
  },
  lens: {
    label: "Objektiv",
    placeholder: "Objektiv wählen",
  },
  focal: {
    label: "Brennweite",
    locked: "Festbrennweite: Sie lässt sich nicht verstellen.",
  },
  aperture: {
    label: "Blende",
    limit: "Größte Blendenöffnung des Objektivs: f/{value}",
  },
  ratio: {
    title: "Seitenverhältnis",
    native: "Nativ",
    numeric: "Digitaler Zuschnitt",
    all: "Alle Seitenverhältnisse",
    landscape: "Querformat",
    portrait: "Hochformat",
    flip: "Zwischen Quer- und Hochformat wechseln",
  },
  readout: {
    title: "Äquivalente Werte",
    focalEq: "Äquivalente Brennweite (24x36)",
    apertureEq: "Äquivalente Blende",
    minShutter: "Längste sichere Belichtungszeit",
    minShutterHelp:
      "Bei längeren Belichtungszeiten ohne Stativ werden Verwacklungen wahrscheinlich.",
  },
  warning: {
    lensCoverage:
      "Dieses Objektiv deckt den Sensor dieser Kamera nicht vollständig ab: Die Bildecken wären schwarz.",
    belowReference:
      "Diese Brennweite ist weitwinkliger als die Referenzszene: Die Darstellung bleibt bei ihrer größten Weite.",
  },
  sensor: {
    FULL_FRAME: "Kleinbild",
    APS_C: "APS-C",
    MICRO_43: "Micro Four Thirds",
    MEDIUM_FORMAT: "Mittelformat",
  },
};

export const simulator = { fr, en, de };
