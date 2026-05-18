"use client"

import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"

export type CircuitCameraView = "front" | "left" | "right" | "top" | "close"

type CameraPreset = {
    position: [number, number, number]
    target: [number, number, number]
}

type CircuitCameraRigProps = {
    view: CircuitCameraView
}

const cameraPresets: Record<CircuitCameraView, CameraPreset> = {
    front: {
        position: [3.8, 2.35, 4.55],
        target: [0, 0.52, 0],
    },
    left: {
        position: [-4.4, 2.25, 3.35],
        target: [0, 0.52, 0],
    },
    right: {
        position: [4.4, 2.25, 3.35],
        target: [0, 0.52, 0],
    },
    top: {
        position: [0, 5.25, 0.95],
        target: [0, 0.45, 0],
    },
    close: {
        position: [2.65, 1.85, 3.05],
        target: [0, 0.65, 0],
    },
}

const targetPosition = new THREE.Vector3()
const lookAtTarget = new THREE.Vector3()

export default function CircuitCameraRig({ view }: CircuitCameraRigProps) {
    const camera = useThree((state) => state.camera)

    useFrame(() => {
        const preset = cameraPresets[view]

        targetPosition.set(...preset.position)
        lookAtTarget.set(...preset.target)

        camera.position.lerp(targetPosition, 0.075)
        camera.lookAt(lookAtTarget)
        camera.updateProjectionMatrix()
    })

    return null
}
