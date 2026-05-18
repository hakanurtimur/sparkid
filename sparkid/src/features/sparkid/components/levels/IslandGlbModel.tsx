"use client"

import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

type IslandGlbModelProps = {
    modelPath: string
}

export default function IslandGlbModel({ modelPath }: IslandGlbModelProps) {
    const gltf = useGLTF(modelPath)

    const scene = useMemo(() => {
        const clone = gltf.scene.clone(true)

        clone.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })

        return clone
    }, [gltf.scene])

    return <primitive object={scene} />
}

useGLTF.preload("/models/islands/island-01-power__static.glb")
