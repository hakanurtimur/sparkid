"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import * as THREE from "three"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

type Vec3 = [number, number, number]

export type CircuitSwitchMode = "off" | "on"

export type CircuitSwitchAnimation =
    | "idle"
    | "toggle"
    | "wiggle"
    | "showcase"
    | "none"

type CircuitSwitchGlbProps = {
    modelPath?: string
    position?: Vec3
    rotation?: Vec3
    scale?: number
    mode?: CircuitSwitchMode
    defaultMode?: CircuitSwitchMode
    animation?: CircuitSwitchAnimation
    interactive?: boolean
    disabled?: boolean
    showGlow?: boolean
    useLedLights?: boolean
    onToggle?: (nextMode: CircuitSwitchMode) => void
    onModeChange?: (nextMode: CircuitSwitchMode) => void
    children?: ReactNode
}

const MODEL_PATH = "/models/components/circuit-switch.glb"
const OFF_LEVER_ROTATION_X = 0.92
const ON_LEVER_ROTATION_X = -0.18
const GREEN_EMISSIVE = new THREE.Color("#22c55e")
const RED_EMISSIVE = new THREE.Color("#ef4444")

function lerp(current: number, target: number, speed: number) {
    return THREE.MathUtils.lerp(current, target, speed)
}

function cloneMaterial(material: THREE.Material | THREE.Material[]) {
    if (Array.isArray(material)) {
        return material.map((item) => item.clone())
    }

    return material.clone()
}

function asStandardMaterial(
    material: THREE.Material | THREE.Material[] | undefined,
) {
    if (!material || Array.isArray(material)) return null

    if (material instanceof THREE.MeshStandardMaterial) {
        return material
    }

    return null
}

export default function CircuitSwitchGlb({
                                             modelPath = MODEL_PATH,
                                             position = [0, 0, 0],
                                             rotation = [0, 0, 0],
                                             scale = 1,
                                             mode,
                                             defaultMode = "off",
                                             animation = "idle",
                                             interactive = true,
                                             disabled = false,
                                             showGlow = true,
                                             useLedLights = false,
                                             onToggle,
                                             onModeChange,
                                             children,
                                         }: CircuitSwitchGlbProps) {
    const gltf = useGLTF(modelPath)

    const [internalMode, setInternalMode] =
        useState<CircuitSwitchMode>(defaultMode)
    const [hovered, setHovered] = useState(false)

    const currentMode = mode ?? internalMode

    const rootRef = useRef<THREE.Group>(null)
    const leverPivotRef = useRef<THREE.Object3D | null>(null)
    const greenMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)
    const redMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null)
    const greenLightRef = useRef<THREE.PointLight>(null)
    const redLightRef = useRef<THREE.PointLight>(null)
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
    const lastModeRef = useRef<CircuitSwitchMode>(currentMode)
    const flashRef = useRef(0)

    const scene = useMemo(() => {
        const clone = gltf.scene.clone(true)

        clone.traverse((object) => {
            const mesh = object as THREE.Mesh

            if (!mesh.isMesh) return

            mesh.castShadow = true
            mesh.receiveShadow = true
            mesh.material = cloneMaterial(mesh.material)
        })

        return clone
    }, [gltf.scene])

    useEffect(() => {
        leverPivotRef.current =
            scene.getObjectByName("CIRCUIT_SWITCH_LEVER_PIVOT") ?? null

        const greenLed = scene.getObjectByName(
            "CIRCUIT_SWITCH_LED_GREEN",
        ) as THREE.Mesh | null
        const redLed = scene.getObjectByName(
            "CIRCUIT_SWITCH_LED_RED",
        ) as THREE.Mesh | null

        greenMaterialRef.current = asStandardMaterial(greenLed?.material)
        redMaterialRef.current = asStandardMaterial(redLed?.material)

        if (greenMaterialRef.current) {
            greenMaterialRef.current.emissive.copy(GREEN_EMISSIVE)
            greenMaterialRef.current.toneMapped = false
        }

        if (redMaterialRef.current) {
            redMaterialRef.current.emissive.copy(RED_EMISSIVE)
            redMaterialRef.current.toneMapped = false
        }
    }, [scene])

    const setCursor = (cursor: string) => {
        if (typeof document === "undefined") return
        document.body.style.cursor = cursor
    }

    const toggleMode = () => {
        if (disabled) return

        const nextMode: CircuitSwitchMode = currentMode === "on" ? "off" : "on"

        if (!mode) {
            setInternalMode(nextMode)
        }

        flashRef.current = 1
        onToggle?.(nextMode)
        onModeChange?.(nextMode)
    }

    useFrame((frameState, delta) => {
        const t = frameState.clock.elapsedTime
        const leverPivot = leverPivotRef.current

        if (lastModeRef.current !== currentMode) {
            lastModeRef.current = currentMode
            flashRef.current = 1
        }

        flashRef.current = Math.max(0, flashRef.current - delta * 3.8)

        const modeMix = currentMode === "on" ? 1 : 0

        if (leverPivot) {
            const targetLeverRotationX = THREE.MathUtils.lerp(
                OFF_LEVER_ROTATION_X,
                ON_LEVER_ROTATION_X,
                modeMix,
            )

            leverPivot.rotation.x = lerp(
                leverPivot.rotation.x,
                targetLeverRotationX,
                0.16,
            )
        }

        const flash = flashRef.current
        const activeAmount = disabled ? 0 : modeMix
        const inactiveAmount = disabled ? 0.15 : 1 - modeMix

        if (greenMaterialRef.current) {
            greenMaterialRef.current.emissiveIntensity = lerp(
                greenMaterialRef.current.emissiveIntensity,
                0.15 + activeAmount * 2.1 + flash * 1.15,
                0.16,
            )
        }

        if (redMaterialRef.current) {
            redMaterialRef.current.emissiveIntensity = lerp(
                redMaterialRef.current.emissiveIntensity,
                0.15 + inactiveAmount * 1.55,
                0.16,
            )
        }

        if (useLedLights && greenLightRef.current) {
            greenLightRef.current.intensity = lerp(
                greenLightRef.current.intensity,
                activeAmount * 0.9 + flash * 0.9,
                0.16,
            )
        }

        if (useLedLights && redLightRef.current) {
            redLightRef.current.intensity = lerp(
                redLightRef.current.intensity,
                inactiveAmount * 0.65,
                0.16,
            )
        }

        if (glowMaterialRef.current) {
            const hoverGlow = hovered && !disabled ? 0.16 : 0
            const activeGlow = activeAmount * 0.16
            const flashGlow = flash * 0.34

            glowMaterialRef.current.opacity = lerp(
                glowMaterialRef.current.opacity,
                Math.max(hoverGlow, activeGlow, flashGlow),
                0.14,
            )
        }

        if (rootRef.current) {
            rootRef.current.position.y = position[1]
            rootRef.current.rotation.y = rotation[1]

            if (animation === "idle") {
                rootRef.current.position.y += Math.sin(t * 1.1) * 0.002
            }

            if (animation === "showcase") {
                rootRef.current.rotation.y += Math.sin(t * 0.45) * 0.18
            }

            if (animation === "wiggle") {
                rootRef.current.rotation.z = Math.sin(t * 8) * 0.012
            } else {
                rootRef.current.rotation.z = rotation[2]
            }
        }
    })

    return (
        <group
            ref={rootRef}
            position={position}
            rotation={rotation}
            scale={[scale, scale, scale]}
        >
            <primitive object={scene} position={[
                0, 0.8, 0.4
            ]} />

            {children}

            {showGlow && (
                <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.12, 32]} />
                    <meshBasicMaterial
                        ref={glowMaterialRef}
                        color={currentMode === "on" ? "#22c55e" : "#00b8ff"}
                        transparent
                        opacity={0}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {useLedLights && (
                <>
                    <pointLight
                        ref={greenLightRef}
                        position={[-0.45, 0.52, 0.68]}
                        color="#22c55e"
                        intensity={0}
                        distance={1.2}
                    />

                    <pointLight
                        ref={redLightRef}
                        position={[0.45, 0.52, 0.68]}
                        color="#ef4444"
                        intensity={0.65}
                        distance={1.1}
                    />
                </>
            )}

            {interactive && (
                <mesh
                    name="CIRCUIT_SWITCH_HIT_AREA"
                    position={[0, 0.58, 0]}
                    onClick={(event: ThreeEvent<MouseEvent>) => {
                        event.stopPropagation()
                        toggleMode()
                    }}
                    onPointerOver={(event) => {
                        event.stopPropagation()
                        if (disabled) return

                        setHovered(true)
                        setCursor("pointer")
                    }}
                    onPointerOut={(event) => {
                        event.stopPropagation()
                        setHovered(false)
                        setCursor("auto")
                    }}
                >
                    <boxGeometry args={[2.05, 1.55, 1.45]} />
                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        depthWrite={false}
                    />
                </mesh>
            )}
        </group>
    )
}

useGLTF.preload(MODEL_PATH)
