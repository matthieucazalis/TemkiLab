// Les scènes dessinées. Les coordonnées vont de 0 à 1200 (largeur) et de 0 à 800
// (hauteur) ; les formes de fond dépassent volontairement du dessin pour que
// le flou ne laisse pas de bords clairs.
// Les couches sont rangées du plus loin (profondeur 1) au plus proche (0).
import type { Layer, Scene, Shape } from "./scenes";

const W = 1200;
const H = 800;

const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  opacity?: number,
): Shape => ({ kind: "rect", x, y, width, height, fill, opacity });

const circle = (
  cx: number,
  cy: number,
  r: number,
  fill: string,
  opacity?: number,
): Shape => ({ kind: "circle", cx, cy, r, fill, opacity });

const poly = (
  points: [number, number][],
  fill: string,
  opacity?: number,
): Shape => ({ kind: "polygon", points, fill, opacity });

const layer = (depth: number, ...shapes: Shape[]): Layer => ({ depth, shapes });

// Un point de la scène, exprimé en unités du dessin, converti en 0..1
const at = (x: number, y: number) => ({ x: x / W, y: y / H });

const landscape: Scene = {
  id: "landscape",
  width: W,
  height: H,
  layers: [
    layer(
      1,
      rect(-300, -300, 1800, 1100, "#bcd9ea"),
      circle(930, 170, 70, "#fbe8a6"),
      circle(250, 160, 50, "#ffffff", 0.85),
      circle(310, 150, 62, "#ffffff", 0.85),
      circle(380, 170, 48, "#ffffff", 0.85),
    ),
    layer(
      0.92,
      poly(
        [
          [-300, 520],
          [100, 330],
          [260, 430],
          [480, 260],
          [700, 450],
          [900, 320],
          [1250, 500],
          [1500, 520],
          [1500, 800],
          [-300, 800],
        ],
        "#8ea3b5",
      ),
    ),
    layer(
      0.7,
      poly(
        [
          [-300, 600],
          [200, 470],
          [500, 540],
          [850, 450],
          [1200, 560],
          [1500, 540],
          [1500, 800],
          [-300, 800],
        ],
        "#7fa57a",
      ),
    ),
    layer(
      0.45,
      rect(600, 430, 40, 200, "#6b4a2f"),
      circle(620, 380, 90, "#3f7a46"),
      circle(560, 420, 60, "#4a8a50"),
      circle(690, 420, 65, "#4a8a50"),
    ),
    layer(
      0.25,
      circle(200, 640, 70, "#356b3d"),
      circle(300, 670, 55, "#3d7646"),
      circle(980, 650, 80, "#356b3d"),
      circle(1090, 680, 60, "#3d7646"),
    ),
    layer(
      0.1,
      poly(
        [
          [-300, 720],
          [400, 690],
          [800, 730],
          [1500, 700],
          [1500, 800],
          [-300, 800],
        ],
        "#2f5e36",
      ),
      circle(150, 715, 16, "#f4d35e"),
      circle(330, 740, 20, "#f4d35e"),
      circle(900, 725, 18, "#f4d35e"),
      circle(1050, 750, 22, "#f4d35e"),
    ),
  ],
  focusTargets: {
    near: at(330, 740),
    subject: at(620, 380),
    far: at(480, 330),
  },
};

const portrait: Scene = {
  id: "portrait",
  width: W,
  height: H,
  layers: [
    layer(
      1,
      rect(-300, -300, 1800, 1100, "#1f2937"),
      circle(180, 160, 55, "#fbbf24", 0.6),
      circle(380, 90, 38, "#f472b6", 0.6),
      circle(1080, 100, 42, "#60a5fa", 0.6),
      circle(130, 380, 46, "#60a5fa", 0.55),
      circle(1010, 520, 52, "#fbbf24", 0.5),
      // Lumières proches du sujet : elles deviennent de gros disques flous
      circle(470, 320, 30, "#fbbf24", 0.65),
      circle(745, 300, 36, "#f472b6", 0.6),
      circle(455, 450, 34, "#60a5fa", 0.6),
      circle(760, 440, 40, "#fbbf24", 0.55),
      circle(540, 200, 28, "#f472b6", 0.55),
      circle(680, 215, 32, "#60a5fa", 0.55),
    ),
    layer(
      0.75,
      circle(-20, 500, 160, "#2f5d50"),
      circle(120, 650, 140, "#2f5d50"),
      circle(1100, 620, 170, "#2f5d50"),
      circle(1250, 700, 150, "#285247"),
    ),
    layer(
      0.3,
      poly(
        [
          [430, 800],
          [445, 590],
          [520, 515],
          [680, 515],
          [755, 590],
          [770, 800],
        ],
        "#c05a4a",
      ),
      rect(572, 430, 56, 90, "#e8b998"),
      circle(600, 360, 70, "#3b2a20"),
      circle(600, 380, 64, "#f0c6a4"),
      circle(578, 378, 6, "#2b2b2b"),
      circle(622, 378, 6, "#2b2b2b"),
      rect(585, 410, 30, 5, "#b5524a"),
    ),
    layer(
      0.05,
      poly(
        [
          [-300, 800],
          [-300, 420],
          [120, 520],
          [260, 800],
        ],
        "#3f7d4e",
        0.9,
      ),
      poly(
        [
          [1500, 800],
          [1500, 500],
          [1050, 620],
          [980, 800],
        ],
        "#3a7348",
        0.9,
      ),
    ),
  ],
  focusTargets: {
    near: at(60, 700),
    subject: at(600, 380),
    far: at(1000, 150),
  },
};

const packshot: Scene = {
  id: "packshot",
  width: W,
  height: H,
  layers: [
    layer(
      1,
      rect(-300, -300, 1800, 1100, "#e8e4dc"),
      // Fenêtre éclairée au fond : une grande tache lumineuse qui se floute
      rect(780, 110, 300, 270, "#fdf6e3"),
      rect(925, 110, 10, 270, "#cfc7b6"),
      rect(780, 240, 300, 10, "#cfc7b6"),
    ),
    layer(
      0.8,
      rect(110, 470, 190, 120, "#b5651d"),
      circle(150, 430, 60, "#4f7d4a"),
      circle(210, 390, 70, "#5a8f54"),
      circle(265, 440, 55, "#4f7d4a"),
    ),
    layer(0.6, rect(-300, 560, 1800, 70, "#c9a273")),
    layer(0.4, rect(-300, 630, 1800, 80, "#b88a5a")),
    layer(
      0.35,
      rect(840, 500, 120, 125, "#2f6f8f"),
      rect(840, 545, 120, 22, "#ffffff", 0.85),
    ),
    layer(
      0.3,
      // Le produit : une bouteille
      rect(555, 400, 90, 235, "#1e5a8a"),
      poly(
        [
          [555, 400],
          [575, 360],
          [625, 360],
          [645, 400],
        ],
        "#1e5a8a",
      ),
      rect(588, 312, 24, 55, "#1e5a8a"),
      rect(582, 292, 36, 22, "#d9d9d9"),
      rect(555, 470, 90, 85, "#f5f1e6"),
      rect(555, 505, 90, 10, "#c0392b"),
      rect(565, 410, 9, 215, "#ffffff", 0.35),
    ),
    layer(0.2, rect(-300, 710, 1800, 100, "#a97c4d")),
    layer(
      0.08,
      poly(
        [
          [1500, 800],
          [1500, 650],
          [1000, 720],
          [900, 800],
        ],
        "#e9d8c4",
        0.95,
      ),
    ),
  ],
  focusTargets: {
    near: at(1120, 770),
    subject: at(600, 500),
    far: at(930, 190),
  },
};

const sport: Scene = {
  id: "sport",
  width: W,
  height: H,
  layers: [
    layer(
      1,
      rect(-300, -300, 1800, 1100, "#cfe4f2"),
      rect(-300, 330, 1800, 170, "#8a93a6"),
      rect(-300, 330, 1800, 22, "#6b7488"),
      // Le public : de petites taches de couleur
      circle(60, 410, 11, "#e4572e"),
      circle(180, 440, 11, "#f2c14e"),
      circle(290, 400, 11, "#3a86ff"),
      circle(420, 435, 11, "#ffffff"),
      circle(520, 405, 11, "#e4572e"),
      circle(690, 440, 11, "#f2c14e"),
      circle(790, 410, 11, "#3a86ff"),
      circle(910, 435, 11, "#ffffff"),
      circle(1020, 400, 11, "#e4572e"),
      circle(1130, 440, 11, "#f2c14e"),
    ),
    layer(
      0.85,
      rect(-300, 495, 1800, 60, "#2a4d9b"),
      rect(-100, 508, 130, 32, "#ffffff"),
      rect(300, 508, 130, 32, "#ffffff"),
      rect(700, 508, 130, 32, "#ffffff"),
      rect(1100, 508, 130, 32, "#ffffff"),
    ),
    layer(
      0.7,
      rect(-300, 555, 1800, 100, "#c0583a"),
      rect(-300, 602, 1800, 5, "#ffffff"),
    ),
    layer(
      0.5,
      rect(-300, 655, 1800, 75, "#b34d32"),
      rect(-300, 695, 1800, 6, "#ffffff"),
    ),
    layer(
      0.3,
      // Le coureur
      poly(
        [
          [582, 560],
          [560, 618],
          [520, 662],
          [535, 672],
          [588, 632],
          [602, 568],
        ],
        "#e0b48e",
      ),
      poly(
        [
          [612, 558],
          [642, 612],
          [692, 642],
          [682, 657],
          [626, 627],
          [598, 568],
        ],
        "#e0b48e",
      ),
      poly(
        [
          [580, 520],
          [618, 520],
          [621, 560],
          [578, 560],
        ],
        "#222222",
      ),
      poly(
        [
          [575, 420],
          [625, 420],
          [615, 522],
          [580, 522],
        ],
        "#1d7a5a",
      ),
      poly(
        [
          [578, 430],
          [555, 472],
          [530, 457],
          [560, 425],
        ],
        "#e0b48e",
      ),
      poly(
        [
          [622, 430],
          [655, 462],
          [690, 447],
          [630, 422],
        ],
        "#e0b48e",
      ),
      circle(603, 392, 26, "#e0b48e"),
      rect(588, 440, 26, 22, "#ffffff"),
    ),
    layer(
      0.12,
      rect(-300, 745, 1800, 100, "#2f7d3a"),
      circle(200, 735, 34, "#ffffff"),
      circle(200, 735, 12, "#2b2b2b", 0.8),
    ),
  ],
  focusTargets: {
    near: at(200, 735),
    subject: at(603, 470),
    far: at(700, 420),
  },
};

// Tuple : SCENES[0] existe toujours, même avec noUncheckedIndexedAccess.
export const SCENES: readonly [Scene, ...Scene[]] = [
  landscape,
  portrait,
  packshot,
  sport,
];
