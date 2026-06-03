"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef } from "react"
import { Sparkles, useGLTF } from "@react-three/drei"
import { createPortal, useFrame, type ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

type Vec3 = [number, number, number]

export type RewardChestState = "locked" | "closed" | "opening" | "open"

type RewardChestGLBProps = {
    url?: string
    state?: RewardChestState
    position?: Vec3
    rotation?: Vec3
    scale?: number | Vec3
    animate?: boolean
    showGlow?: boolean
    showSparkles?: boolean
    lidOpenAngle?: number
    openProgress?: number
    onClick?: () => void
    children?: ReactNode
}

function clamp01(value: number) {
    return Math.max(0, Math.min(1, value))
}

export default function RewardChestGLB({
    url = "/models/sparkid-reward-chest.glb",
    state = "closed",
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    animate = true,
    showGlow = true,
    showSparkles = true,
    lidOpenAngle = -1.15,
    openProgress,
    onClick,
    children,
}: RewardChestGLBProps) {
    const rootRef = useRef<THREE.Group>(null)
    const gltf = useGLTF(url) as { scene: THREE.Group }
    const lidRef = useRef<THREE.Object3D | null>(null)
    const glowRef = useRef<THREE.Object3D | null>(null)
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
    const rewardSlot = useMemo(
        () => scene.getObjectByName("RewardSlot") ?? null,
        [scene],
    )
    const currentOpenRef = useRef(state === "open" ? 1 : 0)

    useEffect(() => {
        lidRef.current = scene.getObjectByName("LidPivotGroup") ?? null
        glowRef.current = scene.getObjectByName("InnerRewardGlow") ?? null
    }, [scene])

    useFrame((frameState) => {
        const t = frameState.clock.elapsedTime
        let targetOpen = 0

        if (state !== "locked") {
            if (typeof openProgress === "number") {
                targetOpen = clamp01(openProgress)
            } else if (state === "opening") {
                targetOpen = animate ? 0.72 + Math.sin(t * 3.2) * 0.08 : 0.78
            } else if (state === "open") {
                targetOpen = 1
            }
        }

        currentOpenRef.current = THREE.MathUtils.lerp(
            currentOpenRef.current,
            targetOpen,
            animate ? 0.1 : 1,
        )

        if (lidRef.current) {
            lidRef.current.rotation.x = lidOpenAngle * currentOpenRef.current
        }

        if (rootRef.current && animate) {
            let yOffset = Math.sin(t * 1.2) * 0.012
            let zRot = Math.sin(t * 1.05) * 0.004

            if (state === "opening") {
                yOffset = Math.abs(Math.sin(t * 4.4)) * 0.045
                zRot = Math.sin(t * 5.5) * 0.016
            }

            if (state === "locked") {
                yOffset = -0.01 + Math.sin(t * 0.8) * 0.006
                zRot = Math.sin(t * 8) * 0.01
            }

            rootRef.current.position.y = position[1] + yOffset
            rootRef.current.rotation.z = rotation[2] + zRot
        }

        if (glowRef.current) {
            const glowVisible =
                showGlow &&
                (state === "opening" ||
                    state === "open" ||
                    currentOpenRef.current > 0.25)

            glowRef.current.visible = glowVisible
            glowRef.current.scale.setScalar(
                glowVisible ? 1 + Math.sin(t * 3) * 0.045 : 0.001,
            )
        }
    })

    const sparkVisible = showSparkles && showGlow && state !== "locked"
    const sparkleCount = state === "closed" ? 14 : 32
    const sparkleOpacity = state === "closed" ? 0.42 : 1

    return (
        <group
            ref={rootRef}
            position={position}
            rotation={rotation}
            scale={scale}
            onClick={(event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation()
                onClick?.()
            }}
        >
            <primitive object={scene} />

            {sparkVisible && (
                <Sparkles
                    count={sparkleCount}
                    position={[0, 0.72, 0.1]}
                    scale={[1.25, 0.8, 0.85]}
                    size={3.2}
                    speed={0.7}
                    color="#22d3ee"
                    opacity={sparkleOpacity}
                />
            )}

            {showGlow && (
                <>
                    <pointLight
                        position={[0, 0.45, 0]}
                        color="#ffd166"
                        intensity={state === "open" ? 1.8 : 0.8}
                        distance={2.2}
                    />
                    <pointLight
                        position={[0, 0.42, 0.1]}
                        color="#22d3ee"
                        intensity={state === "open" ? 0.9 : 0.45}
                        distance={1.4}
                    />
                </>
            )}

            {rewardSlot && children
                ? createPortal(<group>{children}</group>, rewardSlot)
                : null}
        </group>
    )
}

useGLTF.preload("/models/sparkid-reward-chest.glb")
