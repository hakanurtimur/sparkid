import { createTransformClip } from "@/features/sparkid/glb"

import { TEST_BATTERY_NODES } from "./TestBatteryGlbConfig"

export function createTestBatteryClips() {
    const idle = createTransformClip({
        name: "idle",
        duration: 2,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.5,
                        position: [0, 0.025, 0],
                        rotation: [0, 0, 0.012],
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
                        rotation: [0, 0, -0.012],
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

    const talk = createTransformClip({
        name: "talk",
        duration: 0.7,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.1,
                        position: [0, 0.025, 0],
                        rotation: [0, 0, 0.025],
                        scale: [0.995, 1.01, 0.995],
                    },
                    {
                        time: 0.2,
                        position: [0, -0.01, 0],
                        rotation: [0, 0, -0.018],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.3,
                        position: [0, 0.02, 0],
                        rotation: [0, 0, 0.02],
                        scale: [0.995, 1.012, 0.995],
                    },
                    {
                        time: 0.4,
                        position: [0, -0.008, 0],
                        rotation: [0, 0, -0.02],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.55,
                        position: [0, 0.018, 0],
                        rotation: [0, 0, 0.014],
                        scale: [0.997, 1.008, 0.997],
                    },
                    {
                        time: 0.7,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const happy = createTransformClip({
        name: "happy",
        duration: 0.55,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.12,
                        position: [0, 0.08, 0],
                        rotation: [0, 0, 0.045],
                        scale: [0.988, 1.025, 0.988],
                    },
                    {
                        time: 0.24,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1.012, 0.985, 1.012],
                    },
                    {
                        time: 0.38,
                        position: [0, 0.06, 0],
                        rotation: [0, 0, -0.045],
                        scale: [0.99, 1.018, 0.99],
                    },
                    {
                        time: 0.55,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const sad = createTransformClip({
        name: "sad",
        duration: 1.4,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.45,
                        position: [0, -0.08, 0],
                        rotation: [-0.04, 0, 0.01],
                        scale: [1.015, 0.97, 1.015],
                    },
                    {
                        time: 0.9,
                        position: [0, -0.07, 0],
                        rotation: [-0.04, 0, -0.01],
                        scale: [1.01, 0.975, 1.01],
                    },
                    {
                        time: 1.4,
                        position: [0, -0.08, 0],
                        rotation: [-0.04, 0, 0.01],
                        scale: [1.015, 0.97, 1.015],
                    },
                ],
            },
        ],
    })

    const angry = createTransformClip({
        name: "angry",
        duration: 0.35,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.05,
                        position: [0.018, 0.01, 0],
                        rotation: [0, 0, 0.018],
                        scale: [1.008, 0.992, 1.008],
                    },
                    {
                        time: 0.1,
                        position: [-0.018, -0.005, 0],
                        rotation: [0, 0, -0.018],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.15,
                        position: [0.016, 0.008, 0],
                        rotation: [0, 0, 0.016],
                        scale: [1.008, 0.992, 1.008],
                    },
                    {
                        time: 0.2,
                        position: [-0.014, -0.004, 0],
                        rotation: [0, 0, -0.016],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.28,
                        position: [0.01, 0.006, 0],
                        rotation: [0, 0, 0.01],
                        scale: [1.004, 0.996, 1.004],
                    },
                    {
                        time: 0.35,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const surprised = createTransformClip({
        name: "surprised",
        duration: 0.6,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.12,
                        position: [0, 0.075, 0],
                        rotation: [0, 0, 0.018],
                        scale: [0.985, 1.035, 0.985],
                    },
                    {
                        time: 0.28,
                        position: [0, 0.035, 0],
                        rotation: [0, 0, -0.014],
                        scale: [1.012, 0.988, 1.012],
                    },
                    {
                        time: 0.45,
                        position: [0, 0.05, 0],
                        rotation: [0, 0, 0.01],
                        scale: [0.996, 1.015, 0.996],
                    },
                    {
                        time: 0.6,
                        position: [0, 0.04, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1.015, 1],
                    },
                ],
            },
        ],
    })

    const active = createTransformClip({
        name: "active",
        duration: 0.8,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.16,
                        position: [0, 0.055, 0],
                        rotation: [0, 0, 0.03],
                        scale: [0.99, 1.028, 0.99],
                    },
                    {
                        time: 0.32,
                        position: [0, 0.015, 0],
                        rotation: [0, 0, -0.018],
                        scale: [1, 1.01, 1],
                    },
                    {
                        time: 0.48,
                        position: [0, 0.05, 0],
                        rotation: [0, 0, 0.026],
                        scale: [0.99, 1.026, 0.99],
                    },
                    {
                        time: 0.64,
                        position: [0, 0.012, 0],
                        rotation: [0, 0, -0.012],
                        scale: [1, 1.008, 1],
                    },
                    {
                        time: 0.8,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                ],
            },
        ],
    })

    const lowEnergy = createTransformClip({
        name: "lowEnergy",
        duration: 1.6,
        targets: [
            {
                nodeName: TEST_BATTERY_NODES.body,
                keyframes: [
                    {
                        time: 0,
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    {
                        time: 0.45,
                        position: [0, -0.105, 0],
                        rotation: [-0.055, 0, 0.012],
                        scale: [1.02, 0.965, 1.02],
                    },
                    {
                        time: 0.9,
                        position: [0, -0.097, 0],
                        rotation: [-0.055, 0, -0.01],
                        scale: [1.018, 0.968, 1.018],
                    },
                    {
                        time: 1.3,
                        position: [0, -0.108, 0],
                        rotation: [-0.055, 0, 0.008],
                        scale: [1.02, 0.965, 1.02],
                    },
                    {
                        time: 1.6,
                        position: [0, -0.105, 0],
                        rotation: [-0.055, 0, 0],
                        scale: [1.02, 0.965, 1.02],
                    },
                ],
            },
        ],
    })

    return [
        idle,
        talk,
        happy,
        sad,
        angry,
        surprised,
        active,
        lowEnergy,
    ]
}