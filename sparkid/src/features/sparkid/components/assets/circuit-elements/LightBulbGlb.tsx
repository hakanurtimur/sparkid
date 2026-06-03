"use client"

import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

type Vec3 = [number, number, number]

export type LightBulbMood =
    | "off"
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy"

type LightBulbGlbProps = {
    modelPath?: string
    position?: Vec3
    rotation?: Vec3
    scale?: number
    mood?: LightBulbMood
    animated?: boolean
    followPointer?: boolean
    showGlow?: boolean
    useRealLight?: boolean
    disabled?: boolean
}

type RuntimeMoodConfig = {
    lightColor: string
    glassColor: string
    faceColor: string
    glowOpacity: number
    glowIntensity: number
    filamentOpacity: number
    faceVisible: boolean
}

const MODEL_PATH = "/models/components/light-bulb-character.glb"

const MOODS: Record<LightBulbMood, RuntimeMoodConfig> = {
    off: {
        lightColor: "#94a3b8",
        glassColor: "#dbe4ea",
        faceColor: "#94a3b8",
        glowOpacity: 0,
        glowIntensity: 0,
        filamentOpacity: 0.12,
        faceVisible: false,
    },
    idle: {
        lightColor: "#ffd966",
        glassColor: "#fff7db",
        faceColor: "#3b210b",
        glowOpacity: 0.12,
        glowIntensity: 0.75,
        filamentOpacity: 1,
        faceVisible: true,
    },
    happy: {
        lightColor: "#ffd86b",
        glassColor: "#fff3c4",
        faceColor: "#3b210b",
        glowOpacity: 0.26,
        glowIntensity: 1.45,
        filamentOpacity: 1,
        faceVisible: true,
    },
    thinking: {
        lightColor: "#ffd966",
        glassColor: "#fff7db",
        faceColor: "#3b210b",
        glowOpacity: 0.09,
        glowIntensity: 0.65,
        filamentOpacity: 0.75,
        faceVisible: true,
    },
    warning: {
        lightColor: "#f59e0b",
        glassColor: "#ffedd5",
        faceColor: "#7c2d12",
        glowOpacity: 0.16,
        glowIntensity: 1,
        filamentOpacity: 1,
        faceVisible: true,
    },
    success: {
        lightColor: "#a3e635",
        glassColor: "#ecfccb",
        faceColor: "#365314",
        glowOpacity: 0.3,
        glowIntensity: 1.65,
        filamentOpacity: 1,
        faceVisible: true,
    },
    talking: {
        lightColor: "#ffd966",
        glassColor: "#fff7db",
        faceColor: "#3b210b",
        glowOpacity: 0.12,
        glowIntensity: 0.75,
        filamentOpacity: 1,
        faceVisible: true,
    },
    sleepy: {
        lightColor: "#ffd966",
        glassColor: "#fff7db",
        faceColor: "#3b210b",
        glowOpacity: 0.06,
        glowIntensity: 0.42,
        filamentOpacity: 0.5,
        faceVisible: true,
    },
}

function cloneMaterial(material: THREE.Material | THREE.Material[]) {
    if (Array.isArray(material)) {
        return material.map((item) => item.clone())
    }

    return material.clone()
}

function asMaterial(
    material: THREE.Material | THREE.Material[] | undefined,
): THREE.Material | null {
    if (!material || Array.isArray(material)) return null
    return material
}

function getSingleMaterial(
    material: THREE.Material | THREE.Material[] | undefined,
): THREE.Material | null {
    return asMaterial(material)
}

function asStandardMaterial(
    material: THREE.Material | THREE.Material[] | undefined,
): THREE.MeshStandardMaterial | null {
    if (!material || Array.isArray(material)) return null

    if (material instanceof THREE.MeshStandardMaterial) {
        return material
    }

    return null
}

function asBasicMaterial(
    material: THREE.Material | THREE.Material[] | undefined,
): THREE.MeshBasicMaterial | null {
    if (!material || Array.isArray(material)) return null

    if (material instanceof THREE.MeshBasicMaterial) {
        return material
    }

    return null
}

export default function LightBulbGlb({
                                         modelPath = MODEL_PATH,
                                         position = [0, 0, 0],
                                         rotation = [0, 0, 0],
                                         scale = 1,
                                         mood = "idle",
                                         animated = false,
                                         followPointer = false,
                                         showGlow = true,
                                         useRealLight = false,
                                         disabled = false,
                                     }: LightBulbGlbProps) {
    const gltf = useGLTF(modelPath)

    const bodyRef = useRef<THREE.Group>(null)
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
    const lightRef = useRef<THREE.PointLight>(null)
    const glassShellMaterialRef = useRef<THREE.Material | null>(null)
    const innerGlowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
    const filamentMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
    const filamentHaloMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
    const faceMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([])
    const faceGroupRef = useRef<THREE.Object3D | null>(null)

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
        const glassShell = scene.getObjectByName(
            "LIGHT_BULB_GLASS_SHELL",
        ) as THREE.Mesh | null
        const innerGlow = scene.getObjectByName(
            "LIGHT_BULB_INNER_GLOW_CORE",
        ) as THREE.Mesh | null
        const filament = scene.getObjectByName(
            "LIGHT_BULB_FILAMENT_MAIN",
        ) as THREE.Mesh | null
        const filamentHalo = scene.getObjectByName(
            "LIGHT_BULB_FILAMENT_HALO",
        ) as THREE.Mesh | null
        const faceGroup = scene.getObjectByName("LIGHT_BULB_FACE_IDLE")

        glassShellMaterialRef.current = getSingleMaterial(glassShell?.material)
        innerGlowMaterialRef.current = asBasicMaterial(innerGlow?.material)
        filamentMaterialRef.current = asBasicMaterial(filament?.material)
        filamentHaloMaterialRef.current = asBasicMaterial(filamentHalo?.material)
        faceGroupRef.current = faceGroup ?? null

        const faceMaterials: THREE.MeshStandardMaterial[] = []

        faceGroup?.traverse((object) => {
            const mesh = object as THREE.Mesh

            if (!mesh.isMesh) return

            const isFaceColorMesh =
                object.name.includes("EYE") ||
                object.name.includes("BROW") ||
                object.name.includes("MOUTH")

            if (!isFaceColorMesh) return

            const material = asStandardMaterial(mesh.material)

            if (material) {
                faceMaterials.push(material)
            }
        })

        faceMaterialsRef.current = faceMaterials
    }, [scene])

    useEffect(() => {
        const config = MOODS[mood]
        const lightColor = new THREE.Color(config.lightColor)

        if (glassShellMaterialRef.current) {
            const material = glassShellMaterialRef.current

            if ("color" in material && material.color instanceof THREE.Color) {
                material.color.set(config.glassColor)
            }

            if ("opacity" in material) {
                material.opacity = disabled ? 0.2 : mood === "off" ? 0.24 : 0.38
            }

            material.transparent = true
            material.needsUpdate = true
        }

        if (innerGlowMaterialRef.current) {
            innerGlowMaterialRef.current.color.set(lightColor)
            innerGlowMaterialRef.current.opacity =
                showGlow && !disabled ? config.glowOpacity : 0
            innerGlowMaterialRef.current.needsUpdate = true
        }

        if (filamentMaterialRef.current) {
            filamentMaterialRef.current.color.set(lightColor)
            filamentMaterialRef.current.opacity = disabled
                ? 0.08
                : config.filamentOpacity
            filamentMaterialRef.current.needsUpdate = true
        }

        if (filamentHaloMaterialRef.current) {
            filamentHaloMaterialRef.current.color.set(lightColor)
            filamentHaloMaterialRef.current.opacity =
                mood !== "off" && !disabled ? config.glowOpacity * 0.72 : 0
            filamentHaloMaterialRef.current.needsUpdate = true
        }

        faceMaterialsRef.current.forEach((material) => {
            material.color.set(config.faceColor)
            material.needsUpdate = true
        })

        if (faceGroupRef.current) {
            faceGroupRef.current.visible = !disabled && config.faceVisible
        }

        if (glowMaterialRef.current) {
            glowMaterialRef.current.color.set(lightColor)
            glowMaterialRef.current.opacity = showGlow && !disabled
                ? config.glowOpacity * 0.82
                : 0
        }

        if (lightRef.current) {
            lightRef.current.color.set(lightColor)
            lightRef.current.intensity = useRealLight && !disabled
                ? config.glowIntensity
                : 0
        }
    }, [mood, disabled, showGlow, useRealLight])

    useFrame((state, delta) => {
        if (!animated && !useRealLight) return

        const config = MOODS[mood]
        const t = state.clock.elapsedTime
        const body = bodyRef.current

        if (animated && body) {
            const pointerX = followPointer ? state.pointer.x : 0
            const pointerY = followPointer ? state.pointer.y : 0
            const targetY = Math.sin(t * 1.15) * 0.012
            const targetRotY = pointerX * 0.08
            const targetRotX = -pointerY * 0.025
            const targetRotZ = Math.sin(t * 1.05) * 0.008

            body.position.y = THREE.MathUtils.damp(body.position.y, targetY, 7, delta)
            body.rotation.x = THREE.MathUtils.damp(body.rotation.x, targetRotX, 7, delta)
            body.rotation.y = THREE.MathUtils.damp(body.rotation.y, targetRotY, 7, delta)
            body.rotation.z = THREE.MathUtils.damp(body.rotation.z, targetRotZ, 7, delta)
        }

        if (useRealLight && lightRef.current) {
            const pulse = 1 + Math.sin(t * 1.8) * 0.035

            lightRef.current.intensity = THREE.MathUtils.damp(
                lightRef.current.intensity,
                disabled ? 0 : config.glowIntensity * pulse,
                6,
                delta,
            )
        }
    })

    return (
        <group
            position={position}
            rotation={rotation}
            scale={[scale, scale, scale]}
        >
            <group ref={bodyRef}>
                <primitive object={scene} />
            </group>

            {showGlow && (
                <mesh
                    name="LIGHT_BULB_RUNTIME_GROUND_GLOW"
                    position={[0, -1.13, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                >
                    <circleGeometry args={[0.72, 48]} />
                    <meshBasicMaterial
                        ref={glowMaterialRef}
                        color={MOODS[mood].lightColor}
                        transparent
                        opacity={0}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {useRealLight && (
                <pointLight
                    ref={lightRef}
                    position={[0, 0.3, 0.42]}
                    color={MOODS[mood].lightColor}
                    intensity={0}
                    distance={2.25}
                    decay={2}
                />
            )}
        </group>
    )
}

useGLTF.preload(MODEL_PATH)
