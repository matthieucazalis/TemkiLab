"use client";

import { useId } from "react";

// Rendu de test
//

const HEIGHT = 100;
const HALF_SCENE = 300; // la scène s'étend de -300 à +300 autour du centre

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
}: {
  aspect: number; // largeur / hauteur
  zoom: number; // ×1 ou plus
  label: string;
}) {
  // useId renvoie des « : » que url(#...) ne supporte pas toujours
  const clipId = `clip-${useId().replace(/:/g, "")}`;
  const width = Math.round(aspect * HEIGHT * 100) / 100;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="size-full text-foreground"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={width} height={HEIGHT} />
        </clipPath>
      </defs>

      <rect width={width} height={HEIGHT} className="fill-background" />

      <g clipPath={`url(#${clipId})`}>
        {/* Le zoom agrandit la scène autour du centre du cadre */}
        <g transform={`translate(${width / 2} ${HEIGHT / 2}) scale(${zoom})`}>
          <path
            d={MINOR_GRID}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={MAJOR_GRID}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.3}
            vectorEffect="non-scaling-stroke"
          />
          {RINGS.map((radius) => (
            <circle
              key={radius}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.5}
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

      <rect
        width={width}
        height={HEIGHT}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
