import { describe, expect, it } from "vitest";
import { depthAt, findScene, SCENE_IDS, SCENES, type Scene } from "./scenes";

const tiny: Scene = {
  id: "paysage",
  width: 100,
  height: 100,
  layers: [
    {
      depth: 1,
      shapes: [
        { kind: "rect", x: 0, y: 0, width: 100, height: 100, fill: "#000" },
      ],
    },
    {
      depth: 0.5,
      shapes: [{ kind: "circle", cx: 50, cy: 50, r: 20, fill: "#000" }],
    },
    {
      depth: 0.2,
      shapes: [
        {
          kind: "polygon",
          points: [
            [10, 10],
            [30, 10],
            [10, 30],
          ],
          fill: "#000",
        },
      ],
    },
  ],
  focusTargets: {
    near: { x: 0.15, y: 0.15 },
    subject: { x: 0.5, y: 0.5 },
    far: { x: 0.9, y: 0.9 },
  },
};

describe("depthAt", () => {
  it("rect : un point dedans prend la profondeur de sa couche", () => {
    expect(depthAt(tiny, 90, 90)).toBe(1);
  });

  it("cercle : dedans, la couche proche l'emporte sur le fond", () => {
    expect(depthAt(tiny, 50, 50)).toBe(0.5);
  });

  it("cercle : juste à l'extérieur, on retombe sur le fond", () => {
    expect(depthAt(tiny, 50, 71)).toBe(1);
  });

  it("polygone : dedans et dehors du triangle", () => {
    expect(depthAt(tiny, 15, 15)).toBe(0.2);
    expect(depthAt(tiny, 28, 28)).toBe(1);
  });

  it("rien ne recouvre le point : profondeur 1", () => {
    expect(depthAt(tiny, -50, -50)).toBe(1);
  });
});

describe("findScene", () => {
  it("retrouve une scène par son identifiant", () => {
    expect(findScene("rue").id).toBe("rue");
  });

  it("identifiant inconnu : première scène", () => {
    expect(findScene("default")).toBe(SCENES[0]);
  });
});

describe("données des scènes", () => {
  it("il y a une scène pour chaque identifiant déclaré, sans doublon", () => {
    expect(SCENES.map((s) => s.id).sort()).toEqual([...SCENE_IDS].sort());
  });

  for (const scene of SCENES) {
    describe(scene.id, () => {
      it("les couches vont du plus loin au plus proche, profondeurs dans [0, 1]", () => {
        const depths = scene.layers.map((l) => l.depth);
        expect(depths).toEqual([...depths].sort((a, b) => b - a));
        expect(depths.every((d) => d >= 0 && d <= 1)).toBe(true);
      });

      it("chaque couche contient au moins une forme", () => {
        expect(scene.layers.every((l) => l.shapes.length > 0)).toBe(true);
      });

      it("les trois points de mise au point sont dans la scène", () => {
        for (const p of Object.values(scene.focusTargets)) {
          expect(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1).toBe(true);
        }
      });

      it("proche < sujet < loin, comme leurs noms l'annoncent", () => {
        const depth = (p: { x: number; y: number }) =>
          depthAt(scene, p.x * scene.width, p.y * scene.height);
        const { near, subject, far } = scene.focusTargets;
        expect(depth(near) < depth(subject)).toBe(true);
        expect(depth(subject) < depth(far)).toBe(true);
      });
    });
  }
});
