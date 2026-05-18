import * as THREE from "three"

import type { Vec3 } from "./glbTypes"

type TransformKeyframe = {
    time: number
    position?: Vec3
    rotation?: Vec3
    scale?: Vec3
}

type TransformTarget = {
    nodeName: string
    keyframes: TransformKeyframe[]
}

type CreateTransformClipArgs = {
    name: string
    duration: number
    targets: TransformTarget[]
    optimize?: boolean
}

function hasAtLeastTwo<T>(items: T[]) {
    return items.length >= 2
}

function createVectorTrack(args: {
    propertyPath: string
    keyframes: TransformKeyframe[]
    pick: (keyframe: TransformKeyframe) => Vec3 | undefined
}) {
    const frames = args.keyframes.filter((keyframe) => Boolean(args.pick(keyframe)))

    if (!hasAtLeastTwo(frames)) return null

    const times = frames.map((frame) => frame.time)
    const values = frames.flatMap((frame) => {
        const value = args.pick(frame)

        if (!value) return [0, 0, 0]

        return value
    })

    return new THREE.VectorKeyframeTrack(args.propertyPath, times, values)
}

function createQuaternionTrack(args: {
    propertyPath: string
    keyframes: TransformKeyframe[]
}) {
    const frames = args.keyframes.filter((keyframe) => Boolean(keyframe.rotation))

    if (!hasAtLeastTwo(frames)) return null

    const times = frames.map((frame) => frame.time)

    const values = frames.flatMap((frame) => {
        const rotation = frame.rotation ?? [0, 0, 0]

        const quaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(rotation[0], rotation[1], rotation[2])
        )

        return quaternion.toArray()
    })

    return new THREE.QuaternionKeyframeTrack(args.propertyPath, times, values)
}

export function createTransformClip({
                                        name,
                                        duration,
                                        targets,
                                        optimize = true,
                                    }: CreateTransformClipArgs) {
    const tracks: THREE.KeyframeTrack[] = []

    for (const target of targets) {
        const positionTrack = createVectorTrack({
            propertyPath: `${target.nodeName}.position`,
            keyframes: target.keyframes,
            pick: (keyframe) => keyframe.position,
        })

        const rotationTrack = createQuaternionTrack({
            propertyPath: `${target.nodeName}.quaternion`,
            keyframes: target.keyframes,
        })

        const scaleTrack = createVectorTrack({
            propertyPath: `${target.nodeName}.scale`,
            keyframes: target.keyframes,
            pick: (keyframe) => keyframe.scale,
        })

        if (positionTrack) tracks.push(positionTrack)
        if (rotationTrack) tracks.push(rotationTrack)
        if (scaleTrack) tracks.push(scaleTrack)
    }

    const clip = new THREE.AnimationClip(name, duration, tracks)

    if (optimize) {
        clip.optimize()
    }

    return clip
}