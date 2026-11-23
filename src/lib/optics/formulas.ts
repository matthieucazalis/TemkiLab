// Formules optiques de TemkiLab : des fonctions PURES.
// Pas de React, pas de Prisma, pas de navigateur : on donne des nombres,
// on récupère un nombre. C'est ce qui les rend faciles à tester.
function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(
      `${name} doit être un nombre strictement positif (reçu : ${value})`,
    );
  }
}

function assertUnit(name: string, value: number) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new RangeError(
      `${name} doit être compris entre 0 et 1 (reçu : ${value})`,
    );
  }
}

export function equivalentFocal(focal: number, cropFactor: number): number {
  assertPositive("focal", focal);
  assertPositive("cropFactor", cropFactor);
  return focal * cropFactor;
}

export function equivalentAperture(
  aperture: number,
  cropFactor: number,
): number {
  assertPositive("aperture", aperture);
  assertPositive("cropFactor", cropFactor);
  return aperture * cropFactor;
}

export function zoomFactor(focalEq: number, refFocalEq: number): number {
  assertPositive("focalEq", focalEq);
  assertPositive("refFocalEq", refFocalEq);
  return Math.max(1, focalEq / refFocalEq);
}

export function isBelowReference(focalEq: number, refFocalEq: number): boolean {
  assertPositive("focalEq", focalEq);
  assertPositive("refFocalEq", refFocalEq);
  return focalEq < refFocalEq;
}

export type BlurInput = {
  focalEq: number;
  apertureEq: number;
  depth: number;
  focusDepth: number;
};

export function blurAmount({
  focalEq,
  apertureEq,
  depth,
  focusDepth,
}: BlurInput): number {
  assertPositive("focalEq", focalEq);
  assertPositive("apertureEq", apertureEq);
  assertUnit("depth", depth);
  assertUnit("focusDepth", focusDepth);
  return (focalEq / apertureEq) * Math.abs(depth - focusDepth);
}

export function minShutterSeconds(
  focalEq: number,
  stabilizationStops = 0,
): number {
  assertPositive("focalEq", focalEq);
  if (!Number.isFinite(stabilizationStops) || stabilizationStops < 0) {
    throw new RangeError(
      `stabilizationStops doit être un nombre ≥ 0 (reçu : ${stabilizationStops})`,
    );
  }
  return 2 ** stabilizationStops / focalEq;
}
