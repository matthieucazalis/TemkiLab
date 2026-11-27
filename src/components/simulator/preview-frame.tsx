"use client";

import { useId, type MouseEvent } from "react";
import { SceneLayers } from "@/components/simulator/scene-layers";
import {
  frameToScene,
  sceneToFrame,
  type Region,
} from "@/lib/simulator/framing";
import type { Point, Scene } from "@/lib/simulator/scenes";

// Le viseur est toujours sombre, quel que soit le thème du site.
// Deux contenus possibles dans le cadre :
//  - la mire (grille, cercles, croix) : image plate, que le zoom agrandit ;
//  - une scène dessinée, recadrée par la focale et floutée selon la profondeur.
// Les repères du viseur (coins, grille des tiers, point de mise au point) sont
// dessinés par-dessus, dans le repère du cadre.

const HEIGHT = 100;
const HALF_SCENE = 300; // la mire s'étend de -300 à +300 autour du centre
const MARK = 7; // longueur des repères de coin
const INSET = 3; // retrait des repères par rapport au bord
const AF_SIZE = 6; // côté du point de mise au point

function gridPath(step: number): string {
  const parts: string[] = [];
  for (let v = -HALF_SCENE; v <= HALF_SCENE; v += step) {
    parts.push(`M${v} ${-HALF_SCENE}V${HALF_SCENE}`);
    parts.push(`M${-HALF_SCENE} ${v}H${HALF_SCENE}`);
  }
  return parts.join("");
}

const MINOR_GRID = gridPath(5);
const MAJOR_GRID = gridPath(25);
const RINGS = Array.from({ length: 14 }, (_, i) => (i + 1) * 20);

// Tout ce qu'il faut pour afficher une scène dessinée (null : la mire).
export type SceneRender = {
  scene: Scene;
  region: Region; // zone de la scène visible dans le cadre
  blurs: readonly number[]; // écart-type de flou de chaque couche
  focusPoint: Point; // point de mise au point, coordonnées de la scène (0..1)
  onFocus: (point: Point) => void;
};

export function PreviewFrame({
  aspect,
  zoom,
  label,
  showGrid,
  render,
}: {
  aspect: number; // largeur / hauteur
  zoom: number; // ×1 ou plus (utilisé par la mire)
  label: string;
  showGrid: boolean;
  render: SceneRender | null;
}) {
  // useId renvoie des « : » que url(#...) ne supporte pas toujours
  const uid = useId().replace(/:/g, "");
  const clipId = `clip-${uid}`;
  const coatId = `coat-${uid}`;
  const width = Math.round(aspect * HEIGHT * 100) / 100;
  const w = width;
  const h = HEIGHT;
  const a = INSET;
  const m = MARK;

  // Quatre « L » aux coins du cadre, comme dans un viseur
  const corners =
    `M${a} ${a + m}V${a}H${a + m}` +
    `M${w - a - m} ${a}H${w - a}V${a + m}` +
    `M${w - a} ${h - a - m}V${h - a}H${w - a - m}` +
    `M${a + m} ${h - a}H${a}V${h - a - m}`;

  // Point de mise au point : au centre pour la mire ; pour une scène, là où
  // l'utilisateur l'a placé (rien s'il sort du cadre à cause du zoom).
  let af = { x: w / 2, y: h / 2 };
  if (render) {
    const inFrame = sceneToFrame(render.scene, render.region, render.focusPoint);
    af = inFrame ? { x: inFrame.x * w, y: inFrame.y * h } : { x: NaN, y: NaN };
  }
  const showAf = Number.isFinite(af.x);

  function handleClick(event: MouseEvent<SVGSVGElement>) {
    if (!render) return;
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    // Position du clic dans le repère du cadre, quelle que soit la taille
    // d'affichage.
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) return; // marges autour du cadre
    render.onFocus(
      frameToScene(render.scene, render.region, { x: p.x / w, y: p.y / h }),
    );
  }

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
      className={`size-full max-h-full max-w-full text-stage-fg drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)] ${
        render ? "cursor-crosshair" : ""
      }`}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={width} height={HEIGHT} rx={1.2} />
        </clipPath>
        <linearGradient id={coatId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--coat-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--coat-b)" }} />
        </linearGradient>
      </defs>

      <rect width={width} height={HEIGHT} rx={1.2} className="fill-stage-2" />

      <g clipPath={`url(#${clipId})`}>
        {render ? (
          // Svg imbriqué : son viewBox est la zone visible de la scène, donc le
          // recadrage et le zoom ; le cadre garde ses propres repères.
          <svg
            x={0}
            y={0}
            width={width}
            height={HEIGHT}
            viewBox={`${render.region.x} ${render.region.y} ${render.region.w} ${render.region.h}`}
            preserveAspectRatio="none"
          >
            <SceneLayers
              scene={render.scene}
              idPrefix={uid}
              blurs={render.blurs}
              regionHeight={render.region.h}
            />
          </svg>
        ) : (
          /* Le zoom agrandit la mire autour du centre du cadre */
          <g transform={`translate(${width / 2} ${HEIGHT / 2}) scale(${zoom})`}>
            <path
              d={MINOR_GRID}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.1}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={MAJOR_GRID}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.28}
              vectorEffect="non-scaling-stroke"
            />
            {RINGS.map((radius) => (
              <circle
                key={radius}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.45}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path
              d="M-300 0H300M0 -300V300"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </g>

      {/* Règle des tiers (optionnelle) */}
      {showGrid && (
        <path
          d={`M${w / 3} 0V${h}M${(2 * w) / 3} 0V${h}M0 ${h / 3}H${w}M0 ${(2 * h) / 3}H${w}`}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />
      )}

      {/* Repères de viseur et point de mise au point */}
      <path
        d={corners}
        fill="none"
        stroke={`url(#${coatId})`}
        strokeWidth={2.5}
        strokeLinecap="square"
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
      {showAf && (
        <g pointerEvents="none" fill="none">
          {/* Liseré sombre dessous : le repère reste lisible sur une scène claire */}
          <rect
            x={af.x - AF_SIZE / 2}
            y={af.y - AF_SIZE / 2}
            width={AF_SIZE}
            height={AF_SIZE}
            stroke="#000000"
            strokeOpacity={0.5}
            strokeWidth={3.5}
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x={af.x - AF_SIZE / 2}
            y={af.y - AF_SIZE / 2}
            width={AF_SIZE}
            height={AF_SIZE}
            stroke={`url(#${coatId})`}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      )}

      <rect
        width={width}
        height={HEIGHT}
        rx={1.2}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    </svg>
  );
}
