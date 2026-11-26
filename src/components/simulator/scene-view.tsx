"use client";

import { useId, type MouseEvent } from "react";
import { MIN_VISIBLE_BLUR_RATIO, type Region } from "@/lib/simulator/framing";
import type { Point, Scene, Shape } from "@/lib/simulator/scenes";

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

// Dessine la scène telle que le cadre la voit :
//  - le viewBox est la zone visible (donc le recadrage et le zoom) ;
//  - chaque couche reçoit un flou gaussien propre à sa profondeur ;
//  - un clic sur l'image déplace le point de mise au point.
// Tout est du SVG : le navigateur garde les proportions du cadre, en paysage
// comme en portrait.
export function SceneView({
  scene,
  region,
  blurs,
  focusPoint,
  label,
  showGrid = false,
  onFocus,
}: {
  scene: Scene;
  region: Region;
  blurs: readonly number[]; // un écart-type par couche, dans l'ordre de scene.layers
  focusPoint: Point;
  label: string;
  showGrid?: boolean;
  onFocus: (point: Point) => void;
}) {
  // useId renvoie des « : » que url(#...) ne supporte pas toujours
  const uid = useId().replace(/:/g, "");
  const needsBlur = (std: number) => std / region.h >= MIN_VISIBLE_BLUR_RATIO;

  function handleClick(event: MouseEvent<SVGSVGElement>) {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return;
    // Position du clic dans le repère de la scène, quelle que soit la taille
    // d'affichage et le zoom.
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    const inside =
      p.x >= region.x &&
      p.x <= region.x + region.w &&
      p.y >= region.y &&
      p.y <= region.y + region.h;
    if (!inside) return; // clic dans les marges autour du cadre
    onFocus({ x: p.x / scene.width, y: p.y / scene.height });
  }

  const markerSize = region.h * 0.07;
  const radius = region.h * 0.04;
  const inset = region.h * 0.035;
  const mark = region.h * 0.07;
  const { x: rx0, y: ry0, w: rw, h: rh } = region;
  const corners =
    `M${rx0 + inset} ${ry0 + inset + mark}V${ry0 + inset}H${rx0 + inset + mark}` +
    `M${rx0 + rw - inset - mark} ${ry0 + inset}H${rx0 + rw - inset}V${ry0 + inset + mark}` +
    `M${rx0 + rw - inset} ${ry0 + rh - inset - mark}V${ry0 + rh - inset}H${rx0 + rw - inset - mark}` +
    `M${rx0 + inset + mark} ${ry0 + rh - inset}H${rx0 + inset}V${ry0 + rh - inset - mark}`;
  const thirds =
    `M${rx0 + rw / 3} ${ry0}V${ry0 + rh}M${rx0 + (2 * rw) / 3} ${ry0}V${ry0 + rh}` +
    `M${rx0} ${ry0 + rh / 3}H${rx0 + rw}M${rx0} ${ry0 + (2 * rh) / 3}H${rx0 + rw}`;
  const fx = focusPoint.x * scene.width;
  const fy = focusPoint.y * scene.height;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${region.x} ${region.y} ${region.w} ${region.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="size-full cursor-crosshair text-stage-fg drop-shadow-[0_16px_32px_rgba(42,41,64,0.3)]"
      onClick={handleClick}
    >
      <defs>
        <clipPath id={`${uid}-clip`}>
          <rect
            x={region.x}
            y={region.y}
            width={region.w}
            height={region.h}
            rx={radius}
          />
        </clipPath>
        <linearGradient id={`${uid}-coat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--coat-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--coat-b)" }} />
        </linearGradient>
        {blurs.map(
          (std, i) =>
            needsBlur(std) && (
              <filter
                key={i}
                id={`${uid}-blur-${i}`}
                filterUnits="userSpaceOnUse"
                x={-FILTER_MARGIN}
                y={-FILTER_MARGIN}
                width={scene.width + 2 * FILTER_MARGIN}
                height={scene.height + 2 * FILTER_MARGIN}
              >
                <feGaussianBlur stdDeviation={std} />
              </filter>
            ),
        )}
      </defs>

      {/* clipPath : le reste de la scène, hors du cadre, n'est pas montré */}
      <g clipPath={`url(#${uid}-clip)`}>
        {scene.layers.map((layer, i) => (
          <g
            key={i}
            filter={
              needsBlur(blurs[i] ?? 0) ? `url(#${uid}-blur-${i})` : undefined
            }
          >
            {layer.shapes.map((shape, j) => (
              <ShapeView key={j} shape={shape} />
            ))}
          </g>
        ))}

        {showGrid && (
          <path
            d={thirds}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.6}
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
          />
        )}
        <path
          d={corners}
          fill="none"
          stroke={`url(#${uid}-coat)`}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pointerEvents="none"
        />

        {/* Repère de mise au point : liseré sombre + blanc, lisible sur tout fond */}
        <g pointerEvents="none" fill="none">
          <rect
            x={fx - markerSize / 2}
            y={fy - markerSize / 2}
            width={markerSize}
            height={markerSize}
            stroke="#000000"
            strokeOpacity={0.55}
            strokeWidth={4}
            vectorEffect="non-scaling-stroke"
          />
          <rect
            x={fx - markerSize / 2}
            y={fy - markerSize / 2}
            width={markerSize}
            height={markerSize}
            stroke="#ffffff"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </g>

      <rect
        x={region.x}
        y={region.y}
        width={region.w}
        height={region.h}
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        pointerEvents="none"
      />
    </svg>
  );
}
