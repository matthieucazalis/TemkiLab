// modèle pédagogique : il sert à comparer des objectifs
// et des boîtiers, pas à simuler une vraie lentille.

function assertPostitive (name: string, value: number) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new RangeError(
            `${name} doit être un nombre positif (reçus : ${value})`
        );
    }
}

function assertUnit(name: string, value: number) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new RangeError(
            `${name} doit être un nombre compris entre 0 et 1 (reçus : ${value})`
        );
    }
}

// équivalent 24x36

export function equivalentFocal(focal: number, cropFactor: number): number {
    assertPostitive("focal", focal);
    assertPostitive("cropFactor", cropFactor);
    return focal * cropFactor;
}

// f/N x facteur de recadrage

 export function equivalentAperture(aperture: number, cropFactor: number): number {
    assertUnit("aperture", aperture);
    assertPostitive("cropFactor", cropFactor);
    return aperture * cropFactor;
}

// zoom numérique

export function zoomFactor(focalEq: number, refFocalEq: number): number {
    assertPostitive("focalEq", focalEq);
    assertPostitive("refFocalEq", refFocalEq);
    return Math.max(1, focalEq / refFocalEq);
}

export function isBelowReference(focalEq: number, refFocalEq: number): boolean {
    assertPostitive("focalEq", focalEq);
    assertPostitive("refFocalEq", refFocalEq);
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
    assertPostitive("focalEq", focalEq);
    assertPostitive("apertureEq", apertureEq);
    assertPostitive("depth", depth);
    assertPostitive("focusDepth", focusDepth);
    return (focalEq / apertureEq) * Math.abs(depth - focusDepth);
}

// temps de pose ect

export function minShutterSeconds(
    focalEq: number,
    stabilizationStops = 0,
): number {
    assertPostitive("focalEq", focalEq);
    if (!Number.isInteger(stabilizationStops) || stabilizationStops < 0) {
        throw new RangeError(
            `stabilizationStops doit être un nombre ≥ 0 (reçus : ${stabilizationStops})`,
        );
    }
    return 2 ** stabilizationStops / focalEq;
}