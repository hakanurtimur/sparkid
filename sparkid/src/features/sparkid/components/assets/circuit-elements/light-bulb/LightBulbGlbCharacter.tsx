"use client"

import * as THREE from "three"
import { Sparkles } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, type ReactNode } from "react"

import TestLightBulbAnimatedModel from "@/features/sparkid/components/assets/circuit-elements/light-bulb/TestLightBulbAnimatedModel"
import type {
    TestLightBulbAnimation,
    TestLightBulbMood,
} from "@/features/sparkid/components/assets/circuit-elements/light-bulb/TestLightBulbGlbConfig"

type Vec3 = [number, number, number]

type MouthType = "smile" | "sad" | "flat" | "open" | "o"
type BrowType = "normal" | "sad" | "angry" | "closed"

type RenderQuality = "showcase" | "circuit"

type MoodStyle = {
    lightColor: string
    faceColor: string
    glowIntensity: number
    glowOpacity: number
    eyeOpen: number
    eyeWidth: number
    mouth: MouthType
    brow: BrowType
    faceVisible: boolean
    sparkles?: boolean
}

const MOOD_STYLE: Record<TestLightBulbMood, MoodStyle> = {
    off: {
        lightColor: "#94a3b8",
        faceColor: "#94a3b8",
        glowIntensity: 0,
        glowOpacity: 0,
        eyeOpen: 0,
        eyeWidth: 0.08,
        mouth: "flat",
        brow: "closed",
        faceVisible: false,
    },

    idle: {
        lightColor: "#ffd966",
        faceColor: "#3b210b",
        glowIntensity: 1.4,
        glowOpacity: 0.18,
        eyeOpen: 1,
        eyeWidth: 0.075,
        mouth: "smile",
        brow: "normal",
        faceVisible: true,
    },

    happy: {
        lightColor: "#ffd86b",
        faceColor: "#3b210b",
        glowIntensity: 1.5,
        glowOpacity: 0.2,
        eyeOpen: 1.08,
        eyeWidth: 0.08,
        mouth: "open",
        brow: "normal",
        faceVisible: true,
    },

    thinking: {
        lightColor: "#ffd966",
        faceColor: "#3b210b",
        glowIntensity: 1.15,
        glowOpacity: 0.15,
        eyeOpen: 0.82,
        eyeWidth: 0.072,
        mouth: "sad",
        brow: "sad",
        faceVisible: true,
    },

    warning: {
        lightColor: "#f59e0b",
        faceColor: "#7c2d12",
        glowIntensity: 1.8,
        glowOpacity: 0.24,
        eyeOpen: 0.85,
        eyeWidth: 0.075,
        mouth: "sad",
        brow: "angry",
        faceVisible: true,
    },

    success: {
        lightColor: "#a3e635",
        faceColor: "#365314",
        glowIntensity: 2.1,
        glowOpacity: 0.26,
        eyeOpen: 1.1,
        eyeWidth: 0.08,
        mouth: "smile",
        brow: "normal",
        faceVisible: true,
        sparkles: true,
    },

    talking: {
        lightColor: "#ffd966",
        faceColor: "#3b210b",
        glowIntensity: 1.7,
        glowOpacity: 0.22,
        eyeOpen: 0.95,
        eyeWidth: 0.076,
        mouth: "open",
        brow: "normal",
        faceVisible: true,
    },

    sleepy: {
        lightColor: "#ffd966",
        faceColor: "#3b210b",
        glowIntensity: 0.85,
        glowOpacity: 0.12,
        eyeOpen: 0.25,
        eyeWidth: 0.08,
        mouth: "flat",
        brow: "closed",
        faceVisible: true,
    },
}

function RuntimeGlow({
                         mood,
                         quality = "showcase",
                     }: {
    mood: TestLightBulbMood
    quality?: RenderQuality
}) {
    const glowRef = useRef<THREE.Mesh>(null)
    const lightRef = useRef<THREE.PointLight>(null)

    const style = MOOD_STYLE[mood]
    const isCircuit = quality === "circuit"
    const isOn = mood !== "off"
    const isHappy = mood === "happy" || mood === "success"

    const intensityMultiplier = isCircuit ? 0.35 : 1
    const opacityMultiplier = isCircuit ? 0.45 : 1
    const distance = isCircuit ? 1.25 : 2.45

    useFrame((state) => {
        const glow = glowRef.current
        const light = lightRef.current

        if (!isOn) return

        const t = state.clock.elapsedTime
        const pulse = 1 + Math.sin(t * (isHappy ? 2.4 : 1.8)) * 0.035

        if (glow) {
            glow.scale.setScalar(pulse)
        }

        if (light) {
            light.intensity = THREE.MathUtils.lerp(
                light.intensity,
                style.glowIntensity * intensityMultiplier * pulse,
                0.08
            )
        }
    })

    if (!isOn) return null

    return (
        <group>
            <mesh
                ref={glowRef}
                position={[0, 0.36, 0.03]}
                scale={[0.46, 0.62, 0.46]}
            >
                <sphereGeometry args={[1, 48, 24]} />
                <meshBasicMaterial
                    color={style.lightColor}
                    transparent
                    opacity={style.glowOpacity * opacityMultiplier}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <pointLight
                ref={lightRef}
                position={[0, 0.3, 0.42]}
                color={style.lightColor}
                intensity={style.glowIntensity * intensityMultiplier}
                distance={distance}
                decay={2}
            />

            {!isCircuit && (
                <>
                    <mesh position={[0.04, 0.58, 0.35]} scale={[0.34, 0.42, 0.08]}>
                        <sphereGeometry args={[1, 32, 16]} />
                        <meshBasicMaterial
                            color={style.lightColor}
                            transparent
                            opacity={0.09}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>

                    <mesh position={[0, -1.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.72, 64]} />
                        <meshBasicMaterial
                            color={style.lightColor}
                            transparent
                            opacity={0.055}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>
                </>
            )}
        </group>
    )
}

function FaceEye({
                     side,
                     color,
                 }: {
    side: -1 | 1
    color: string
}) {
    return (
        <group position={[side * 0.22, 0.02, 0.02]}>
            <mesh scale={[0.075, 0.115, 0.018]}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
            </mesh>

            <mesh position={[0.025, 0.04, 0.018]} scale={[0.023, 0.034, 0.008]}>
                <sphereGeometry args={[1, 16, 8]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    )
}

function FaceBrow({
                      side,
                      type,
                      color,
                  }: {
    side: -1 | 1
    type: BrowType
    color: string
}) {
    let y = 0.19
    let tilt = side * -0.16

    if (type === "sad") {
        tilt = side * 0.28
        y = 0.17
    }

    if (type === "angry") {
        tilt = side * 0.34
        y = 0.16
    }

    if (type === "closed") {
        y = 0.03
        tilt = side * -0.05
    }

    return (
        <group position={[side * 0.22, y, 0.03]} rotation={[0, 0, tilt]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.012, 0.012, 0.14, 16]} />
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
        </group>
    )
}

function FaceMouth({
                       type,
                       color,
                   }: {
    type: MouthType
    color: string
}) {
    const curve = useMemo(() => {
        let controlY = -0.075

        if (type === "sad") controlY = 0.065
        if (type === "flat") controlY = 0

        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.13, 0, 0),
            new THREE.Vector3(0, controlY, 0),
            new THREE.Vector3(0.13, 0, 0)
        )
    }, [type])

    const openShape = useMemo(() => {
        const shape = new THREE.Shape()
        shape.absellipse(0, 0, 0.07, 0.05, 0, Math.PI * 2, false, 0)

        return shape
    }, [])

    if (type === "o") {
        return (
            <mesh position={[0, -0.14, 0.04]}>
                <torusGeometry args={[0.065, 0.012, 14, 48]} />
                <meshStandardMaterial color={color} roughness={0.35} />
            </mesh>
        )
    }

    if (type === "open") {
        return (
            <group position={[0, -0.14, 0.04]}>
                <mesh>
                    <shapeGeometry args={[openShape]} />
                    <meshStandardMaterial
                        color={color}
                        side={THREE.DoubleSide}
                        roughness={0.35}
                    />
                </mesh>

                <mesh position={[0, -0.018, 0.006]} scale={[0.055, 0.025, 0.008]}>
                    <sphereGeometry args={[1, 16, 8]} />
                    <meshStandardMaterial color="#ff6b5f" roughness={0.45} />
                </mesh>
            </group>
        )
    }

    return (
        <mesh position={[0, -0.14, 0.04]}>
            <tubeGeometry args={[curve, 36, 0.012, 10, false]} />
            <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
    )
}

function LightBulbFaceLayer({ mood }: { mood: TestLightBulbMood }) {
    const groupRef = useRef<THREE.Group>(null)
    const leftEyeRef = useRef<THREE.Group>(null)
    const rightEyeRef = useRef<THREE.Group>(null)
    const mouthRef = useRef<THREE.Group>(null)

    const nextBlink = useRef(1.4)
    const blinkStart = useRef(-10)

    const style = MOOD_STYLE[mood]

    useFrame((state) => {
        const group = groupRef.current
        const leftEye = leftEyeRef.current
        const rightEye = rightEyeRef.current
        const mouth = mouthRef.current

        if (!style.faceVisible) return
        if (!group || !leftEye || !rightEye || !mouth) return

        const t = state.clock.elapsedTime

        let blinkPower = 0

        if (mood !== "warning" && mood !== "success" && mood !== "sleepy") {
            if (t > nextBlink.current) {
                blinkStart.current = t
                nextBlink.current = t + THREE.MathUtils.randFloat(2.2, 5.2)
            }

            const elapsed = t - blinkStart.current

            if (elapsed >= 0 && elapsed <= 0.16) {
                blinkPower = Math.sin((elapsed / 0.16) * Math.PI)
            }
        }

        const eyeY = THREE.MathUtils.clamp(
            style.eyeOpen * (1 - blinkPower * 0.92),
            0.05,
            1.25
        )

        leftEye.scale.y = THREE.MathUtils.lerp(leftEye.scale.y, eyeY, 0.32)
        rightEye.scale.y = THREE.MathUtils.lerp(rightEye.scale.y, eyeY, 0.32)

        leftEye.scale.x = THREE.MathUtils.lerp(
            leftEye.scale.x,
            style.eyeWidth / 0.075,
            0.2
        )

        rightEye.scale.x = THREE.MathUtils.lerp(
            rightEye.scale.x,
            style.eyeWidth / 0.075,
            0.2
        )

        const mouthPulse =
            mood === "talking"
                ? THREE.MathUtils.lerp(0.72, 1.35, (Math.sin(t * 10) + 1) / 2)
                : 1 + Math.sin(t * 2.2) * 0.02

        mouth.scale.y = THREE.MathUtils.lerp(mouth.scale.y, mouthPulse, 0.2)

        group.position.y = THREE.MathUtils.lerp(
            group.position.y,
            mood === "success" ? 0.52 : mood === "thinking" ? 0.46 : 0.49,
            0.08
        )
    })

    if (!style.faceVisible) return null

    return (
        <group ref={groupRef} position={[0, 0.49, 0.69]}>
            <group ref={leftEyeRef}>
                <FaceEye side={-1} color={style.faceColor} />
            </group>

            <group ref={rightEyeRef}>
                <FaceEye side={1} color={style.faceColor} />
            </group>

            <FaceBrow side={-1} type={style.brow} color={style.faceColor} />
            <FaceBrow side={1} type={style.brow} color={style.faceColor} />

            <mesh position={[-0.35, -0.08, 0.025]} scale={[0.07, 0.045, 0.012]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color="#ff8b5c"
                    roughness={0.45}
                    transparent
                    opacity={0.82}
                />
            </mesh>

            <mesh position={[0.35, -0.08, 0.025]} scale={[0.07, 0.045, 0.012]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color="#ff8b5c"
                    roughness={0.45}
                    transparent
                    opacity={0.82}
                />
            </mesh>

            <group ref={mouthRef}>
                <FaceMouth type={style.mouth} color={style.faceColor} />
            </group>
        </group>
    )
}

type LightBulbGlbCharacterProps = {
    mood?: TestLightBulbMood
    animation?: TestLightBulbAnimation
    position?: Vec3
    scale?: number
    quality?: RenderQuality
    showFace?: boolean
    showSparkles?: boolean
    children?: ReactNode
}

export default function LightBulbGlbCharacter({
                                                  mood = "off",
                                                  animation = "hover",
                                                  position = [0, 0, 0],
                                                  scale = 1,
                                                  quality = "showcase",
                                                  showFace,
                                                  showSparkles,
                                                  children,
                                              }: LightBulbGlbCharacterProps) {
    const isCircuit = quality === "circuit"
    const style = MOOD_STYLE[mood]

    const shouldShowFace = showFace ?? !isCircuit
    const shouldShowSparkles = showSparkles ?? !isCircuit

    return (
        <TestLightBulbAnimatedModel
            animation={animation}
            position={position}
            scale={scale}
        >
            <RuntimeGlow mood={mood} quality={quality} />

            {shouldShowFace && <LightBulbFaceLayer mood={mood} />}

            {shouldShowSparkles && style.sparkles && (
                <Sparkles
                    count={22}
                    position={[0, 0.7, 0.65]}
                    scale={[1.5, 1.1, 0.7]}
                    size={3.5}
                    speed={0.75}
                    color={style.lightColor}
                />
            )}

            {children}
        </TestLightBulbAnimatedModel>
    )
}