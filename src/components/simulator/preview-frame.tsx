"use client";

import { useId } from "react";

// Rendu de test : une mire (grille, cercles, croix) à la place d'une photo.
// Le viseur est toujours sombre, quel que soit le thème du site.

const HEIGHT = 100;
const HALF_SCENE = 300; // la scène s'étend de -300 à +300 autour du centre
const MARK = 7; // longueur des repères de coin
const INSET = 3; // retrait des repères par rapport au bord

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

export function PreviewFrame({
  aspect,
  zoom,
  label,
  showGrid,
}: {
  aspect: number; // largeur / hauteur
  zoom: number; // ×1 ou plus
  label: string;
  showGrid: boolean;
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

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="size-full max-h-full max-w-full text-stage-fg drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
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
        {/* Le zoom agrandit la scène autour du centre du cadre */}
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
      </g>

      {/* Règle des tiers (optionnelle) */}
      {showGrid && (
        <path
          d={`M${w / 3} 0V${h}M${(2 * w) / 3} 0V${h}M0 ${h / 3}H${w}M0 ${(2 * h) / 3}H${w}`}
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
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
      />
      <rect
        x={w / 2 - 3}
        y={h / 2 - 3}
        width={6}
        height={6}
        fill="none"
        stroke={`url(#${coatId})`}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <rect
        width={width}
        height={HEIGHT}
        rx={1.2}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.35}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
