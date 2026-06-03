"use client"

import { useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type KidVariant = "boy" | "girl"
type KidAnimation = "idle" | "walk" | "run"
type KidEmote = "normal" | "happy" | "excited" | "sad"

export type LabKidModelProps = {
    variant?: KidVariant
    animation?: KidAnimation
    emote?: KidEmote
    position?: [number, number, number]
    scale?: number
}

export default function LabKidModel({
    variant = "boy",
    animation = "idle",
    emote = "normal",
    position = [0, 0, 0],
    scale = 1,
}: LabKidModelProps) {
    const groupRef = useRef<THREE.Group>(null)
    const url =
        variant === "boy"
            ? "/models/characters/lab-kid-boy.glb"
            : "/models/characters/lab-kid-girl.glb"
    const gltf = useGLTF(url)
    const scene = useMemo(() => {
        const clone = gltf.scene.clone(true)

        clone.traverse((object) => {
            if (object.name === "mesh_27") {
                object.visible = false
            }

            if (object instanceof THREE.Mesh) {
                object.castShadow = true
                object.receiveShadow = true
            }
        })

        return clone
    }, [gltf.scene])

    useFrame((state) => {
        const t = state.clock.elapsedTime
        const root = scene.getObjectByName("KidRoot")
        const head = scene.getObjectByName("HeadPivot")
        const leftArm = scene.getObjectByName("LeftArm")
        const rightArm = scene.getObjectByName("RightArm")
        const leftLeg = scene.getObjectByName("LeftLeg")
        const rightLeg = scene.getObjectByName("RightLeg")
        const isWalk = animation === "walk"
        const isRun = animation === "run"
        const speed = isRun ? 8.5 : isWalk ? 4.4 : 1.5
        const armAmp = isRun ? 0.95 : isWalk ? 0.72 : 0.04
        const legAmp = isRun ? 0.78 : isWalk ? 0.58 : 0.025
        const swing = Math.sin(t * speed)
        const counterSwing = Math.cos(t * speed)

        if (groupRef.current) {
            groupRef.current.position.y =
                position[1] +
                Math.abs(Math.sin(t * speed)) *
                    (isRun ? 0.065 : isWalk ? 0.05 : 0.012)
            groupRef.current.rotation.z =
                Math.sin(t * speed * 0.5) * (isRun ? 0.035 : isWalk ? 0.025 : 0.008)
        }

        if (root) {
            root.rotation.y = Math.sin(t * 0.8) * (isRun ? 0.03 : 0.02)
        }

        if (head) {
            head.rotation.z =
                Math.sin(t * (emote === "excited" ? 6 : 1.6)) *
                (emote === "excited" ? 0.055 : 0.025)

            const headScale =
                emote === "happy"
                    ? 1.04 + Math.sin(t * 5) * 0.01
                    : emote === "sad"
                      ? 0.96
                      : 1

            head.scale.setScalar(headScale)
        }

        if (leftArm) {
            leftArm.rotation.x = -swing * armAmp
            leftArm.rotation.z = counterSwing * armAmp * 0.18
        }

        if (rightArm) {
            rightArm.rotation.x = swing * armAmp
            rightArm.rotation.z = -counterSwing * armAmp * 0.18
        }

        if (leftLeg) {
            leftLeg.rotation.x = swing * legAmp
            leftLeg.rotation.z = -counterSwing * legAmp * 0.1
        }

        if (rightLeg) {
            rightLeg.rotation.x = -swing * legAmp
            rightLeg.rotation.z = counterSwing * legAmp * 0.1
        }
    })

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload("/models/characters/lab-kid-boy.glb")
useGLTF.preload("/models/characters/lab-kid-girl.glb")
