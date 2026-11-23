import { z } from "zod";

// état du sim 
// champ state du preset / futures routes API et messages entre pc et mobile

// z.strictObject refuse les champs inconnus
export const simulatorStateSchema = z.strictObject({
    version: z.literal(1),
    mode: z.enum(["GENERAL", "PROFILE"]),
    sceneId: z.string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
    focal: z.number().min(1).max(2000),
    aperture: z.number().min(0.7).max(64),
    ratio: z.strictObject({
        value: z.string().regex(/^[1-9]\d?:[1-9]\d?$/),
        orientation: z.enum(["landscape", "portrait"]),
    }),
    tilt: z.number().min(-45).max(45),
    focusPoint: z.strictObject({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
    }).optional(),
});

export type SimulatorState = z.infer<typeof simulatorStateSchema>;
export const DEFAULT_SIMULATOR_STATE: SimulatorState = {
    version: 1,
    mode: "GENERAL",
    sceneId: "default",
    focal: 35,
    aperture: 2.8,
    ratio: {
        value: "3:2",
        orientation: "landscape",
    },
    tilt: 0,
};