// Les trois scènes. Les coordonnées vont de 0 à 1200 (largeur) et de 0 à 800
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

const paysage: Scene = {
  id: "paysage",
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

const rue: Scene = {
  id: "rue",
  width: W,
  height: H,
  layers: [
    layer(
      1,
      rect(-300, -300, 1800, 1100, "#d8dee6"),
      rect(-100, 260, 260, 540, "#aeb8c6"),
      rect(180, 170, 200, 630, "#aeb8c6"),
      rect(400, 300, 240, 500, "#aeb8c6"),
      rect(660, 200, 220, 600, "#aeb8c6"),
      rect(900, 280, 260, 520, "#aeb8c6"),
      rect(1140, 230, 360, 570, "#aeb8c6"),
    ),
    layer(
      0.8,
      rect(-300, 340, 430, 460, "#c4876c"),
      rect(430, 310, 320, 490, "#d4b483"),
      rect(760, 350, 260, 450, "#b9c4cf"),
      rect(1020, 320, 480, 480, "#c4876c"),
      rect(-200, 400, 60, 80, "#4b5563", 0.5),
      rect(-80, 400, 60, 80, "#4b5563", 0.5),
      rect(40, 400, 60, 80, "#4b5563", 0.5),
      rect(470, 370, 60, 80, "#4b5563", 0.5),
      rect(590, 370, 60, 80, "#4b5563", 0.5),
      rect(800, 410, 60, 80, "#4b5563", 0.5),
      rect(920, 410, 60, 80, "#4b5563", 0.5),
      rect(1080, 380, 60, 80, "#4b5563", 0.5),
      rect(1200, 380, 60, 80, "#4b5563", 0.5),
    ),
    layer(0.7, rect(-300, 640, 1800, 60, "#6b7280")),
    layer(
      0.6,
      rect(700, 560, 300, 80, "#b23a3a"),
      poly(
        [
          [760, 560],
          [800, 510],
          [920, 510],
          [960, 560],
        ],
        "#b23a3a",
      ),
      poly(
        [
          [785, 555],
          [815, 520],
          [865, 520],
          [865, 555],
        ],
        "#cfe3f2",
      ),
      poly(
        [
          [875, 520],
          [915, 520],
          [940, 555],
          [875, 555],
        ],
        "#cfe3f2",
      ),
      circle(770, 645, 32, "#222222"),
      circle(930, 645, 32, "#222222"),
    ),
    layer(0.45, rect(-300, 700, 1800, 60, "#5f6672")),
    layer(
      0.35,
      rect(250, 250, 16, 420, "#2d3748"),
      rect(250, 250, 90, 14, "#2d3748"),
      circle(345, 270, 22, "#fde68a"),
    ),
    layer(
      0.3,
      rect(455, 600, 24, 110, "#2b3a55"),
      rect(485, 600, 24, 110, "#2b3a55"),
      rect(430, 490, 20, 100, "#e07a5f"),
      rect(516, 490, 20, 100, "#e07a5f"),
      rect(448, 480, 70, 130, "#e07a5f"),
      circle(483, 445, 34, "#f2c9a0"),
    ),
    layer(0.15, rect(-300, 760, 1800, 100, "#545a66")),
  ],
  focusTargets: {
    near: at(600, 790),
    subject: at(483, 540),
    far: at(930, 300),
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

// Tuple : SCENES[0] existe toujours, même avec noUncheckedIndexedAccess.
export const SCENES: readonly [Scene, ...Scene[]] = [paysage, rue, portrait];
