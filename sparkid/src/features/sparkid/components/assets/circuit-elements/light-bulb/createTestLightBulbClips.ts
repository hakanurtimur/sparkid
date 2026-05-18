import { createTransformClip } from "@/features/sparkid/glb"

import { TEST_LIGHT_BULB_NODES } from "./TestLightBulbGlbConfig"

export function createTestLightBulbClips() {
    const nodeName = TEST_LIGHT_BULB_NODES.body

    const hover = createTransformClip({
        name: "hover",
        duration: 2,
        targets: [
            {
                nodeName,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.5,
                        position: [0, 0.018, 0],
                        rotation: [0, 0, 0.015],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 1,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 1.5,
                        position: [0, -0.018, 0],
                        rotation: [0, 0, -0.015],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 2,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const bob = createTransformClip({
        name: "bob",
        duration: 1.2,
        targets: [
            {
                nodeName,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.3,
                        position: [0, 0.035, 0],
                        rotation: [0, 0, 0.025],
                        scale: [0.992, 1.012, 0.992],
                    },
                    {
                        time: 0.6,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1.006, 0.994, 1.006],
                    },
                    {
                        time: 0.9,
                        position: [0, -0.035, 0],
                        rotation: [0, 0, -0.025],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 1.2,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const rotate = createTransformClip({
        name: "rotate",
        duration: 2.8,
        targets: [
            {
                nodeName,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.7,
                        position: [0, 0.02, 0],
                        rotation: [0, 0.75, 0.01],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 1.4,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 2.1,
                        position: [0, -0.02, 0],
                        rotation: [0, -0.75, -0.01],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 2.8,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const excited = createTransformClip({
        name: "excited",
        duration: 0.65,
        targets: [
            {
                nodeName,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.13,
                        position: [0, 0.075, 0],
                        rotation: [0, 0, 0.055],
                        scale: [0.975, 1.045, 0.975],
                    },
                    {
                        time: 0.26,
                        position: [0, 0.012, 0],
                        rotation: [0, 0, -0.04],
                        scale: [1.025, 0.975, 1.025],
                    },
                    {
                        time: 0.42,
                        position: [0, 0.06, 0],
                        rotation: [0, 0, 0.042],
                        scale: [0.985, 1.03, 0.985],
                    },
                    {
                        time: 0.65,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const talk = createTransformClip({
        name: "talk",
        duration: 0.75,
        targets: [
            {
                nodeName,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.12,
                        position: [0, 0.032, 0],
                        rotation: [0, 0, 0.026],
                        scale: [0.995, 1.012, 0.995],
                    },
                    {
                        time: 0.24,
                        position: [0, -0.01, 0],
                        rotation: [0, 0, -0.02],
                        scale: [1.006, 0.994, 1.006],
                    },
                    {
                        time: 0.38,
                        position: [0, 0.028, 0],
                        rotation: [0, 0, 0.022],
                        scale: [0.997, 1.01, 0.997],
                    },
                    {
                        time: 0.52,
                        position: [0, -0.008, 0],
                        rotation: [0, 0, -0.018],
                        scale: [1.004, 0.996, 1.004],
                    },
                    {
                        time: 0.75,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    return [hover, bob, rotate, excited, talk]
}