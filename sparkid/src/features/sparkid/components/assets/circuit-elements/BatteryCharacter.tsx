"use client"

import * as THREE from "three"
import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef, type ReactNode } from "react"

import CharacterEye from "@/features/sparkid/components/sparky/CharacterEye"
import CharacterEyebrow from "@/features/sparkid/components/sparky/CharacterEyebrow"
import CharacterMouth, {
    type CharacterMouthVariant,
} from "@/features/sparkid/components/sparky/CharacterMouth"
import CharacterEmoteBubble, {
    type CharacterEmoteBubbleProps,
    type CharacterEmoteBubbleType,
} from "@/features/sparkid/components/sparky/CharacterEmoteBubble"

type Vec2 = [number, number]
type Vec3 = [number, number, number]

export type BatteryAnimation =
    | "normal"
    | "idle"
    | "talk"
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "active"
    | "lowEnergy"

type BatteryCharacterProps = {
    animation?: BatteryAnimation
    position?: Vec3
    scale?: number
    showSigns?: boolean
    showCheeks?: boolean

    showEmoteBubble?: boolean
    emoteBubbleType?: CharacterEmoteBubbleType | "auto"
    emoteBubbleCustomText?: string
    emoteBubbleProps?: Partial<CharacterEmoteBubbleProps>

    children?: ReactNode

    bodyNodeName?: string
    disableRuntimeAnimation?: boolean
}

type FaceExpression = {
    eyes: {
        openness: number
        lookOffset: Vec2
        blink: boolean
        followPointer: boolean
    }
    brows: {
        leftTilt: number
        rightTilt: number
        yOffset: number
        followPointer: boolean
    }
    mouth: {
        variant: CharacterMouthVariant
        y: number
        width: number
        upperHeight: number
        lowerHeight: number
        curveDepth: number
        lineThickness: number
        tongue: boolean
        openness: number
        animate: boolean
        speed: number
        amount: number
    }
}

const NORMAL_EXPRESSION: FaceExpression = {
    eyes: {
        openness: 1,
        lookOffset: [0, 0],
        blink: true,
        followPointer: true,
    },
    brows: {
        leftTilt: 0.1,
        rightTilt: -0.1,
        yOffset: 0,
        followPointer: true,
    },
    mouth: {
        variant: "open",
        y: -0.13,
        width: 0.27,
        upperHeight: 0.05,
        lowerHeight: 0.13,
        curveDepth: 0.08,
        lineThickness: 0.018,
        tongue: true,
        openness: 1,
        animate: true,
        speed: 2.6,
        amount: 0.08,
    },
}

const EXPRESSIONS: Record<BatteryAnimation, FaceExpression> = {
    normal: NORMAL_EXPRESSION,
    idle: NORMAL_EXPRESSION,

    talk: {
        eyes: {
            openness: 0.95,
            lookOffset: [0, 0],
            blink: true,
            followPointer: true,
        },
        brows: {
            leftTilt: 0.08,
            rightTilt: -0.08,
            yOffset: 0.015,
            followPointer: true,
        },
        mouth: {
            variant: "open",
            y: -0.14,
            width: 0.29,
            upperHeight: 0.05,
            lowerHeight: 0.16,
            curveDepth: 0.08,
            lineThickness: 0.018,
            tongue: true,
            openness: 1,
            animate: true,
            speed: 9,
            amount: 0.75,
        },
    },

    happy: {
        eyes: {
            openness: 0.68,
            lookOffset: [0, 0.018],
            blink: false,
            followPointer: true,
        },
        brows: {
            leftTilt: 0.18,
            rightTilt: -0.18,
            yOffset: 0.045,
            followPointer: true,
        },
        mouth: {
            variant: "open",
            y: -0.14,
            width: 0.35,
            upperHeight: 0.06,
            lowerHeight: 0.18,
            curveDepth: 0.08,
            lineThickness: 0.018,
            tongue: true,
            openness: 1.08,
            animate: true,
            speed: 5,
            amount: 0.16,
        },
    },

    sad: {
        eyes: {
            openness: 0.62,
            lookOffset: [0, -0.035],
            blink: true,
            followPointer: false,
        },
        brows: {
            leftTilt: 0.34,
            rightTilt: -0.34,
            yOffset: 0.02,
            followPointer: false,
        },
        mouth: {
            variant: "sad",
            y: -0.13,
            width: 0.25,
            upperHeight: 0.04,
            lowerHeight: 0.08,
            curveDepth: 0.075,
            lineThickness: 0.017,
            tongue: false,
            openness: 1,
            animate: false,
            speed: 1,
            amount: 0,
        },
    },

    angry: {
        eyes: {
            openness: 0.56,
            lookOffset: [0, 0],
            blink: false,
            followPointer: true,
        },
        brows: {
            leftTilt: -0.42,
            rightTilt: 0.42,
            yOffset: -0.025,
            followPointer: true,
        },
        mouth: {
            variant: "flat",
            y: -0.13,
            width: 0.24,
            upperHeight: 0.03,
            lowerHeight: 0.06,
            curveDepth: 0,
            lineThickness: 0.018,
            tongue: false,
            openness: 1,
            animate: false,
            speed: 1,
            amount: 0,
        },
    },

    surprised: {
        eyes: {
            openness: 1.25,
            lookOffset: [0, 0.022],
            blink: false,
            followPointer: false,
        },
        brows: {
            leftTilt: 0,
            rightTilt: 0,
            yOffset: 0.095,
            followPointer: false,
        },
        mouth: {
            variant: "o",
            y: -0.15,
            width: 0.16,
            upperHeight: 0.06,
            lowerHeight: 0.115,
            curveDepth: 0.08,
            lineThickness: 0.018,
            tongue: false,
            openness: 1,
            animate: true,
            speed: 3,
            amount: 0.12,
        },
    },

    active: {
        eyes: {
            openness: 1.06,
            lookOffset: [0, 0.012],
            blink: true,
            followPointer: true,
        },
        brows: {
            leftTilt: 0.12,
            rightTilt: -0.12,
            yOffset: 0.026,
            followPointer: true,
        },
        mouth: {
            variant: "open",
            y: -0.14,
            width: 0.31,
            upperHeight: 0.055,
            lowerHeight: 0.165,
            curveDepth: 0.08,
            lineThickness: 0.018,
            tongue: true,
            openness: 1.08,
            animate: true,
            speed: 8.5,
            amount: 0.45,
        },
    },

    lowEnergy: {
        eyes: {
            openness: 0.34,
            lookOffset: [0, -0.04],
            blink: false,
            followPointer: false,
        },
        brows: {
            leftTilt: 0.28,
            rightTilt: -0.28,
            yOffset: -0.018,
            followPointer: false,
        },
        mouth: {
            variant: "sad",
            y: -0.14,
            width: 0.22,
            upperHeight: 0.04,
            lowerHeight: 0.07,
            curveDepth: 0.055,
            lineThickness: 0.016,
            tongue: false,
            openness: 1,
            animate: false,
            speed: 1,
            amount: 0,
        },
    },
}

function getBatteryEmoteBubbleProps(
    animation: BatteryAnimation
): Partial<CharacterEmoteBubbleProps> {
    if (animation === "active") {
        return {
            type: "energy",
            side: "right",
            position: [1.08, 0.68, 0.86],
            scale: 1,
            bubbleColor: "#e9feff",
            accentColor: "#00e5ff",
            floatSpeed: 3.2,
            floatAmplitude: 0.045,
            rotationAmount: 0.07,
            pulse: true,
            billboard: true,
        }
    }

    if (animation === "lowEnergy") {
        return {
            type: "custom",
            customText: "Z",
            side: "right",
            position: [1.02, 0.54, 0.86],
            scale: 0.9,
            bubbleColor: "#eef4ff",
            accentColor: "#5273a7",
            floatSpeed: 1.25,
            floatAmplitude: 0.018,
            rotationAmount: 0.012,
            pulse: false,
            billboard: true,
        }
    }

    if (animation === "talk") {
        return {
            type: "dots",
            side: "right",
            position: [1.08, 0.62, 0.86],
            scale: 0.95,
            bubbleColor: "#fffaf2",
            accentColor: "#1565a9",
            floatSpeed: 2.6,
            floatAmplitude: 0.035,
            rotationAmount: 0.045,
            pulse: true,
            billboard: true,
        }
    }

    if (animation === "happy") {
        return {
            type: "heart",
            side: "right",
            position: [1.08, 0.68, 0.86],
            scale: 0.95,
            bubbleColor: "#fff0f4",
            accentColor: "#ff5b7f",
            floatSpeed: 3,
            floatAmplitude: 0.04,
            rotationAmount: 0.08,
            pulse: true,
            billboard: true,
        }
    }

    if (animation === "sad") {
        return {
            type: "custom",
            customText: "…",
            side: "right",
            position: [1.02, 0.52, 0.86],
            scale: 0.9,
            bubbleColor: "#eef4ff",
            accentColor: "#5273a7",
            floatSpeed: 1.35,
            floatAmplitude: 0.02,
            rotationAmount: 0.014,
            pulse: false,
            billboard: true,
        }
    }

    if (animation === "angry") {
        return {
            type: "alert",
            side: "right",
            position: [1.04, 0.66, 0.86],
            scale: 0.95,
            bubbleColor: "#fff2e8",
            accentColor: "#ff4d2e",
            floatSpeed: 4,
            floatAmplitude: 0.035,
            rotationAmount: 0.08,
            pulse: true,
            billboard: true,
        }
    }

    if (animation === "surprised") {
        return {
            type: "question",
            side: "right",
            position: [1.08, 0.72, 0.86],
            scale: 1,
            bubbleColor: "#fffaf2",
            accentColor: "#1565a9",
            floatSpeed: 2.7,
            floatAmplitude: 0.04,
            rotationAmount: 0.06,
            pulse: true,
            billboard: true,
        }
    }

    return {
        type: "star",
        side: "right",
        position: [1.06, 0.64, 0.86],
        scale: 0.92,
        bubbleColor: "#fff7d6",
        accentColor: "#ffc107",
        floatSpeed: 2.1,
        floatAmplitude: 0.03,
        rotationAmount: 0.04,
        pulse: true,
        billboard: true,
    }
}

type CheekProps = {
    position: Vec3
    active?: boolean
}

function Cheek({ position, active = false }: CheekProps) {
    return (
        <mesh position={position} scale={[0.082, 0.058, 0.014]}>
            <sphereGeometry args={[1, 24, 12]} />
            <meshStandardMaterial
                color={active ? "#ff6f86" : "#ff8c7f"}
                emissive={active ? "#ff375f" : "#000000"}
                emissiveIntensity={active ? 0.25 : 0}
                roughness={0.5}
                metalness={0}
            />
        </mesh>
    )
}

function FrontBodyHighlight() {
    return (
        <group>
            <mesh position={[-0.28, 0.05, 0.735]} scale={[0.055, 0.58, 0.008]}>
                <sphereGeometry args={[1, 24, 12]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.16}
                    roughness={0.2}
                    metalness={0}
                    depthWrite={false}
                />
            </mesh>

            <mesh position={[0.32, -0.18, 0.728]} scale={[0.03, 0.28, 0.006]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.09}
                    roughness={0.2}
                    metalness={0}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

function BatteryShell({ active = false }: { active?: boolean }) {
    const yellowCapMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const yellowLipMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const darkCapMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const bottomInsetMaterialRef = useRef<THREE.MeshStandardMaterial>(null)

    const topGlowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
    const bottomGlowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        const pulse = active ? (Math.sin(t * 5.4) + 1) / 2 : 0

        const yellowIntensity = active ? 0.38 + pulse * 0.28 : 0
        const darkIntensity = active ? 0.22 + pulse * 0.18 : 0

        if (yellowCapMaterialRef.current) {
            yellowCapMaterialRef.current.emissive.set(active ? "#ffb703" : "#000000")
            yellowCapMaterialRef.current.emissiveIntensity = yellowIntensity
        }

        if (yellowLipMaterialRef.current) {
            yellowLipMaterialRef.current.emissive.set(active ? "#ffd84d" : "#000000")
            yellowLipMaterialRef.current.emissiveIntensity = active
                ? 0.45 + pulse * 0.32
                : 0
        }

        if (darkCapMaterialRef.current) {
            darkCapMaterialRef.current.emissive.set(active ? "#0ea5e9" : "#000000")
            darkCapMaterialRef.current.emissiveIntensity = darkIntensity
        }

        if (bottomInsetMaterialRef.current) {
            bottomInsetMaterialRef.current.emissive.set(active ? "#38bdf8" : "#000000")
            bottomInsetMaterialRef.current.emissiveIntensity = active
                ? 0.32 + pulse * 0.22
                : 0
        }

        if (topGlowMaterialRef.current) {
            topGlowMaterialRef.current.opacity = active ? 0.16 + pulse * 0.1 : 0
        }

        if (bottomGlowMaterialRef.current) {
            bottomGlowMaterialRef.current.opacity = active ? 0.14 + pulse * 0.09 : 0
        }
    })

    return (
        <>
            {/* Main blue plastic body */}
            <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.72, 0.72, 1.68, 96]} />
                <meshStandardMaterial
                    color="#1688e8"
                    roughness={0.31}
                    metalness={0.08}
                />
            </mesh>

            <FrontBodyHighlight />

            {/* Yellow top cap */}
            <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
                <cylinderGeometry args={[0.735, 0.735, 0.46, 96]} />
                <meshStandardMaterial
                    ref={yellowCapMaterialRef}
                    color="#ffc20f"
                    roughness={0.27}
                    metalness={0.08}
                />
            </mesh>

            {/* Yellow cap soft glow only */}
            <mesh position={[0, 0.82, 0]} scale={[1.035, 1.035, 1.035]}>
                <cylinderGeometry args={[0.745, 0.745, 0.48, 96]} />
                <meshBasicMaterial
                    ref={topGlowMaterialRef}
                    color="#ffd84d"
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                />
            </mesh>

            {/* Dark bottom cap */}
            <mesh castShadow receiveShadow position={[0, -1.24, 0]}>
                <cylinderGeometry args={[0.735, 0.735, 0.42, 96]} />
                <meshStandardMaterial
                    ref={darkCapMaterialRef}
                    color="#0d2a4a"
                    roughness={0.5}
                    metalness={0.18}
                />
            </mesh>

            {/* Dark cap subtle blue glow only */}
            <mesh position={[0, -1.24, 0]} scale={[1.035, 1.035, 1.035]}>
                <cylinderGeometry args={[0.745, 0.745, 0.43, 96]} />
                <meshBasicMaterial
                    ref={bottomGlowMaterialRef}
                    color="#38bdf8"
                    transparent
                    opacity={0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    toneMapped={false}
                />
            </mesh>

            {/* Top seam */}
            <mesh position={[0, 0.59, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.722, 0.012, 12, 96]} />
                <meshStandardMaterial
                    color="#0b4d8b"
                    roughness={0.32}
                    metalness={0.18}
                />
            </mesh>

            {/* Bottom seam */}
            <mesh position={[0, -1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.722, 0.012, 12, 96]} />
                <meshStandardMaterial
                    color="#08213d"
                    roughness={0.45}
                    metalness={0.18}
                />
            </mesh>

            {/* Yellow top lip */}
            <mesh position={[0, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.63, 0.035, 16, 96]} />
                <meshStandardMaterial
                    ref={yellowLipMaterialRef}
                    color="#ffcf22"
                    roughness={0.25}
                    metalness={0.1}
                />
            </mesh>

            {/* Metal base plate */}
            <mesh castShadow receiveShadow position={[0, 1.12, 0]}>
                <cylinderGeometry args={[0.39, 0.42, 0.09, 80]} />
                <meshStandardMaterial
                    color="#d8d0c5"
                    roughness={0.2}
                    metalness={0.72}
                />
            </mesh>

            {/* Metal ring detail */}
            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.31, 0.34, 0.08, 80]} />
                <meshStandardMaterial
                    color="#f0ebe2"
                    roughness={0.18}
                    metalness={0.78}
                />
            </mesh>

            {/* Positive terminal */}
            <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
                <cylinderGeometry args={[0.22, 0.25, 0.14, 80]} />
                <meshStandardMaterial
                    color="#8f867c"
                    roughness={0.16}
                    metalness={0.86}
                />
            </mesh>

            {/* Terminal top highlight */}
            <mesh castShadow receiveShadow position={[0, 1.385, 0]}>
                <cylinderGeometry args={[0.17, 0.18, 0.025, 64]} />
                <meshStandardMaterial
                    color="#fff8ef"
                    roughness={0.14}
                    metalness={0.92}
                />
            </mesh>

            {/* Bottom rubber inset */}
            <mesh position={[0, -1.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.04, 16, 80]} />
                <meshStandardMaterial
                    ref={bottomInsetMaterialRef}
                    color="#07182c"
                    roughness={0.6}
                    metalness={0.1}
                />
            </mesh>
        </>
    )
}

export default function BatteryCharacter({
                                             animation = "normal",
                                             position = [0, 0, 0],
                                             scale = 1,
                                             showSigns = true,
                                             showCheeks = true,

                                             showEmoteBubble = true,
                                             emoteBubbleType = "auto",
                                             emoteBubbleCustomText,
                                             emoteBubbleProps,

                                             children,
                                             bodyNodeName = "TestBatteryBody",
                                             disableRuntimeAnimation = false,
                                         }: BatteryCharacterProps) {
    const bodyRef = useRef<THREE.Group>(null)

    const expression = EXPRESSIONS[animation] ?? EXPRESSIONS.normal
    const mode = animation === "normal" ? "idle" : animation
    const isActive = animation === "active"
    const isLowEnergy = animation === "lowEnergy"

    const autoEmoteBubble = getBatteryEmoteBubbleProps(animation)

    const finalEmoteBubble: Partial<CharacterEmoteBubbleProps> = {
        ...autoEmoteBubble,
        ...(emoteBubbleType !== "auto"
            ? {
                type: emoteBubbleType,
                customText: emoteBubbleCustomText,
            }
            : {}),
        ...emoteBubbleProps,
    }

    useFrame((state) => {
        if (disableRuntimeAnimation) return
        const body = bodyRef.current
        if (!body) return

        const t = state.clock.elapsedTime

        let targetY = 0
        let targetRotZ = 0
        let targetRotX = 0
        let targetScaleX = 1
        let targetScaleY = 1
        let targetScaleZ = 1

        if (mode === "idle") {
            targetY = Math.sin(t * 1.5) * 0.025
            targetRotZ = Math.sin(t * 1.1) * 0.012
        }

        if (mode === "talk") {
            targetY = Math.sin(t * 10) * 0.025
            targetRotZ = Math.sin(t * 7) * 0.025
        }

        if (mode === "happy") {
            const bounce = Math.abs(Math.sin(t * 5.5))

            targetY = bounce * 0.08
            targetRotZ = Math.sin(t * 6) * 0.045
            targetScaleY = 1 + bounce * 0.025
            targetScaleX = 1 - bounce * 0.012
            targetScaleZ = 1 - bounce * 0.012
        }

        if (mode === "sad") {
            targetY = -0.08 + Math.sin(t * 1.2) * 0.01
            targetRotX = -0.04
            targetRotZ = Math.sin(t * 1.1) * 0.01
        }

        if (mode === "angry") {
            targetY = Math.sin(t * 18) * 0.01
            targetRotZ = Math.sin(t * 22) * 0.018
        }

        if (mode === "surprised") {
            targetY = 0.04 + Math.sin(t * 4) * 0.015
            targetRotZ = Math.sin(t * 3) * 0.018
            targetScaleY = 1.015
        }

        if (mode === "active") {
            const pulse = (Math.sin(t * 8) + 1) / 2

            targetY = Math.abs(Math.sin(t * 5.6)) * 0.055
            targetRotZ = Math.sin(t * 6.5) * 0.03
            targetScaleY = 1.01 + pulse * 0.018
            targetScaleX = 1 - pulse * 0.01
            targetScaleZ = 1 - pulse * 0.01
        }

        if (mode === "lowEnergy") {
            targetY = -0.105 + Math.sin(t * 1.1) * 0.008
            targetRotX = -0.055
            targetRotZ = Math.sin(t * 0.9) * 0.012
            targetScaleX = 1.02
            targetScaleY = 0.965
            targetScaleZ = 1.02
        }

        body.position.y = THREE.MathUtils.lerp(body.position.y, targetY, 0.1)
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, targetRotZ, 0.12)
        body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, targetRotX, 0.1)

        body.scale.x = THREE.MathUtils.lerp(body.scale.x, targetScaleX, 0.12)
        body.scale.y = THREE.MathUtils.lerp(body.scale.y, targetScaleY, 0.12)
        body.scale.z = THREE.MathUtils.lerp(body.scale.z, targetScaleZ, 0.12)
    })

    return (
        <group position={position} scale={[scale, scale, scale]}>
            <group ref={bodyRef} name={bodyNodeName}>
                <BatteryShell active={isActive} />

                {children}


                {showSigns && (
                    <>
                        <Text
                            position={[0, 0.37, 0.755]}
                            fontSize={0.36}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            +
                        </Text>

                        <Text
                            position={[0, -0.72, 0.755]}
                            fontSize={0.31}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            −
                        </Text>
                    </>
                )}

                <CharacterEyebrow
                    position={[-0.255, 0.295 + expression.brows.yOffset, 0.758]}
                    tilt={expression.brows.leftTilt}
                    length={0.22}
                    thickness={0.017}
                    color="#151515"
                    followPointer={expression.brows.followPointer}
                    followRange={[0.018, 0.014]}
                    followSpeed={0.1}
                />

                <CharacterEyebrow
                    position={[0.255, 0.295 + expression.brows.yOffset, 0.758]}
                    tilt={expression.brows.rightTilt}
                    length={0.22}
                    thickness={0.017}
                    color="#151515"
                    followPointer={expression.brows.followPointer}
                    followRange={[0.018, 0.014]}
                    followSpeed={0.1}
                />

                <CharacterEye
                    position={[-0.255, 0.075, 0.755]}
                    scale={[0.095, 0.135, 0.026]}
                    color="#050505"
                    openness={expression.eyes.openness}
                    lookOffset={expression.eyes.lookOffset}
                    blink={expression.eyes.blink}
                    followPointer={expression.eyes.followPointer}
                    followRange={[0.052, 0.04]}
                    highlight
                    highlightPosition={[-0.026, 0.046, 0.026]}
                    highlightScale={[0.026, 0.034, 0.01]}
                />

                <CharacterEye
                    position={[0.255, 0.075, 0.755]}
                    scale={[0.095, 0.135, 0.026]}
                    color="#050505"
                    openness={expression.eyes.openness}
                    lookOffset={expression.eyes.lookOffset}
                    blink={expression.eyes.blink}
                    followPointer={expression.eyes.followPointer}
                    followRange={[0.052, 0.04]}
                    highlight
                    highlightPosition={[-0.026, 0.046, 0.026]}
                    highlightScale={[0.026, 0.034, 0.01]}
                />

                {showCheeks && (
                    <>
                        <Cheek position={[-0.455, -0.08, 0.742]} active={isActive} />
                        <Cheek position={[0.455, -0.08, 0.742]} active={isActive} />
                    </>
                )}

                <CharacterMouth
                    position={[0, expression.mouth.y, 0.765]}
                    variant={expression.mouth.variant}
                    width={expression.mouth.width}
                    upperHeight={expression.mouth.upperHeight}
                    lowerHeight={expression.mouth.lowerHeight}
                    curveDepth={expression.mouth.curveDepth}
                    lineThickness={expression.mouth.lineThickness}
                    tongue={expression.mouth.tongue}
                    openness={expression.mouth.openness}
                    animate={expression.mouth.animate}
                    animationSpeed={expression.mouth.speed}
                    animationAmount={expression.mouth.amount}
                    followPointer={false}
                />

                {isLowEnergy && (
                    <mesh position={[0, -0.01, 0.747]} scale={[0.33, 0.035, 0.01]}>
                        <sphereGeometry args={[1, 24, 8]} />
                        <meshStandardMaterial
                            color="#0a3c69"
                            transparent
                            opacity={0.18}
                            roughness={0.5}
                            depthWrite={false}
                        />
                    </mesh>
                )}

                {showEmoteBubble && (
                    <CharacterEmoteBubble
                        {...finalEmoteBubble}
                        visible={finalEmoteBubble.visible ?? true}
                        billboard={finalEmoteBubble.billboard ?? true}
                    />
                )}
            </group>
        </group>
    )
}
