"use client";

import { MIN_VISIBLE_BLUR_RATIO } from "@/lib/simulator/framing";
import type { Scene, Shape } from "@/lib/simulator/scenes";

// Les formes de fond dépassent du dessin de cette marge (voir scene-data.ts) :
// la zone de calcul du flou doit les inclure, sinon les bords seraient coupés.
const FILTER_MARGIN = 300;

function ShapeView({ shape }: { shape: Shape }) {
  switch (shape.kind) {
    case "rect":
      return (
        <rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          fill={shape.fill}
          fillOpacity={shape.opacity}
        />
      );
    case "circle":
      return (
        <circle
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={shape.fill}
          fillOpacity={shape.opacity}
        />
      );
    case "polygon":
      return (
        <polygon
          points={shape.points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill={shape.fill}
          fillOpacity={shape.opacity}
        />
      );
  }
}

// Les couches d'une scène, du fond vers l'avant. `blurs` donne un écart-type
// de flou par couche (même ordre que scene.layers, en unités de la scène) ;
// sans lui, tout est net (vignettes). `idPrefix` évite que deux scènes
// affichées en même temps partagent les identifiants de leurs filtres.
// À placer dans un <svg> dont le viewBox est en coordonnées de la scène.
export function SceneLayers({
  scene,
  idPrefix,
  blurs,
  regionHeight,
}: {
  scene: Scene;
  idPrefix: string;
  blurs?: readonly number[];
  regionHeight?: number;
}) {
  const needsBlur = (index: number) =>
    blurs !== undefined &&
    regionHeight !== undefined &&
    (blurs[index] ?? 0) / regionHeight >= MIN_VISIBLE_BLUR_RATIO;

  return (
    <>
      <defs>
        {scene.layers.map(
          (_, i) =>
            needsBlur(i) && (
              <filter
                key={i}
                id={`${idPrefix}-blur-${i}`}
                filterUnits="userSpaceOnUse"
                x={-FILTER_MARGIN}
                y={-FILTER_MARGIN}
                width={scene.width + 2 * FILTER_MARGIN}
                height={scene.height + 2 * FILTER_MARGIN}
              >
                <feGaussianBlur stdDeviation={blurs?.[i] ?? 0} />
              </filter>
            ),
        )}
      </defs>
      {scene.layers.map((layer, i) => (
        <g
          key={i}
          filter={needsBlur(i) ? `url(#${idPrefix}-blur-${i})` : undefined}
        >
          {layer.shapes.map((shape, j) => (
            <ShapeView key={j} shape={shape} />
          ))}
        </g>
      ))}
    </>
  );
}

// Miniature d'une scène pour la pellicule : toute la scène, sans flou,
// recadrée pour remplir la vignette.
export function SceneThumb({
  scene,
  idPrefix,
}: {
  scene: Scene;
  idPrefix: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
    >
      <SceneLayers scene={scene} idPrefix={idPrefix} />
    </svg>
  );
}
