import * as THREE from "three"

import { TEST_BATTERY_BODY_NODE_NAME } from "./TestBatteryBodyAsset"

export type TestBatteryClipName =
    | "idle"
    | "talk"
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "active"
    | "lowEnergy"

type Vec3 = [number, number, number]

function flattenVec3(values: Vec3[]) {
    return values.flatMap(([x, y, z]) => [x, y, z])
}

function flattenEuler(values: Vec3[]) {
    return values.flatMap(([x, y, z]) => {
        const quaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(x, y, z)
        )

        return quaternion.toArray()
    })
}

function createBodyClip(args: {
    name: TestBatteryClipName
    duration: number
    times: number[]
    positions: Vec3[]
    rotations: Vec3[]
    scales: Vec3[]
}) {
    const positionTrack = new THREE.VectorKeyframeTrack(
        `${TEST_BATTERY_BODY_NODE_NAME}.position`,
        args.times,
        flattenVec3(args.positions)
    )

    const rotationTrack = new THREE.QuaternionKeyframeTrack(
        `${TEST_BATTERY_BODY_NODE_NAME}.quaternion`,
        args.times,
        flattenEuler(args.rotations)
    )

    const scaleTrack = new THREE.VectorKeyframeTrack(
        `${TEST_BATTERY_BODY_NODE_NAME}.scale`,
        args.times,
        flattenVec3(args.scales)
    )

    const clip = new THREE.AnimationClip(args.name, args.duration, [
        positionTrack,
        rotationTrack,
        scaleTrack,
    ])

    clip.optimize()

    return clip
}

export function createTestBatteryAnimationClips() {
    const idle = createBodyClip({
        name: "idle",
        duration: 2,
        times: [0, 0.5, 1, 1.5, 2],
        positions: [
            [0, 0, 0],
            [0, 0.025, 0],
            [0, 0, 0],
            [0, -0.018, 0],
            [0, 0, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.012],
            [0, 0, 0],
            [0, 0, -0.012],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
    })

    const talk = createBodyClip({
        name: "talk",
        duration: 0.7,
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7],
        positions: [
            [0, 0, 0],
            [0, 0.025, 0],
            [0, -0.01, 0],
            [0, 0.02, 0],
            [0, -0.008, 0],
            [0, 0.018, 0],
            [0, 0, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.025],
            [0, 0, -0.018],
            [0, 0, 0.02],
            [0, 0, -0.02],
            [0, 0, 0.014],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [0.995, 1.01, 0.995],
            [1, 1, 1],
            [0.995, 1.012, 0.995],
            [1, 1, 1],
            [0.997, 1.008, 0.997],
            [1, 1, 1],
        ],
    })

    const happy = createBodyClip({
        name: "happy",
        duration: 0.55,
        times: [0, 0.12, 0.24, 0.38, 0.55],
        positions: [
            [0, 0, 0],
            [0, 0.08, 0],
            [0, 0, 0],
            [0, 0.06, 0],
            [0, 0, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.045],
            [0, 0, 0],
            [0, 0, -0.045],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [0.988, 1.025, 0.988],
            [1.012, 0.985, 1.012],
            [0.99, 1.018, 0.99],
            [1, 1, 1],
        ],
    })

    const sad = createBodyClip({
        name: "sad",
        duration: 1.4,
        times: [0, 0.45, 0.9, 1.4],
        positions: [
            [0, 0, 0],
            [0, -0.08, 0],
            [0, -0.07, 0],
            [0, -0.08, 0],
        ],
        rotations: [
            [0, 0, 0],
            [-0.04, 0, 0.01],
            [-0.04, 0, -0.01],
            [-0.04, 0, 0.01],
        ],
        scales: [
            [1, 1, 1],
            [1.015, 0.97, 1.015],
            [1.01, 0.975, 1.01],
            [1.015, 0.97, 1.015],
        ],
    })

    const angry = createBodyClip({
        name: "angry",
        duration: 0.35,
        times: [0, 0.05, 0.1, 0.15, 0.2, 0.28, 0.35],
        positions: [
            [0, 0, 0],
            [0.018, 0.01, 0],
            [-0.018, -0.005, 0],
            [0.016, 0.008, 0],
            [-0.014, -0.004, 0],
            [0.01, 0.006, 0],
            [0, 0, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.018],
            [0, 0, -0.018],
            [0, 0, 0.016],
            [0, 0, -0.016],
            [0, 0, 0.01],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [1.008, 0.992, 1.008],
            [1, 1, 1],
            [1.008, 0.992, 1.008],
            [1, 1, 1],
            [1.004, 0.996, 1.004],
            [1, 1, 1],
        ],
    })

    const surprised = createBodyClip({
        name: "surprised",
        duration: 0.6,
        times: [0, 0.12, 0.28, 0.45, 0.6],
        positions: [
            [0, 0, 0],
            [0, 0.075, 0],
            [0, 0.035, 0],
            [0, 0.05, 0],
            [0, 0.04, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.018],
            [0, 0, -0.014],
            [0, 0, 0.01],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [0.985, 1.035, 0.985],
            [1.012, 0.988, 1.012],
            [0.996, 1.015, 0.996],
            [1, 1.015, 1],
        ],
    })

    const active = createBodyClip({
        name: "active",
        duration: 0.8,
        times: [0, 0.16, 0.32, 0.48, 0.64, 0.8],
        positions: [
            [0, 0, 0],
            [0, 0.055, 0],
            [0, 0.015, 0],
            [0, 0.05, 0],
            [0, 0.012, 0],
            [0, 0, 0],
        ],
        rotations: [
            [0, 0, 0],
            [0, 0, 0.03],
            [0, 0, -0.018],
            [0, 0, 0.026],
            [0, 0, -0.012],
            [0, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [0.99, 1.028, 0.99],
            [1, 1.01, 1],
            [0.99, 1.026, 0.99],
            [1, 1.008, 1],
            [1, 1, 1],
        ],
    })

    const lowEnergy = createBodyClip({
        name: "lowEnergy",
        duration: 1.6,
        times: [0, 0.45, 0.9, 1.3, 1.6],
        positions: [
            [0, 0, 0],
            [0, -0.105, 0],
            [0, -0.097, 0],
            [0, -0.108, 0],
            [0, -0.105, 0],
        ],
        rotations: [
            [0, 0, 0],
            [-0.055, 0, 0.012],
            [-0.055, 0, -0.01],
            [-0.055, 0, 0.008],
            [-0.055, 0, 0],
        ],
        scales: [
            [1, 1, 1],
            [1.02, 0.965, 1.02],
            [1.018, 0.968, 1.018],
            [1.02, 0.965, 1.02],
            [1.02, 0.965, 1.02],
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