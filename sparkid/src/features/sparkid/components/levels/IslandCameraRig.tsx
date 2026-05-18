"use client"

import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

type IslandCameraRigProps = {
    target?: [number, number, number]
}

export default function IslandCameraRig({
    target = [0, 0.2, 0],
}: IslandCameraRigProps) {
    const { camera } = useThree()

    useEffect(() => {
        camera.lookAt(new THREE.Vector3(...target))
        camera.updateProjectionMatrix()
    }, [camera, target])

    return null
}
