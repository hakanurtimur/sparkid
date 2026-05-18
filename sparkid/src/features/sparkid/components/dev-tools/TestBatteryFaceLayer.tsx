"use client"

import * as THREE from "three"
import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"



import type { TestBatteryAnimation, TestVec2, TestVec3 } from "./TestBatteryTypes"
import CharacterEmoteBubble, {
    CharacterEmoteBubbleProps,
    CharacterEmoteBubbleType
} from "@/features/sparkid/components/sparky/CharacterEmoteBubble";
import CharacterEye from "@/features/sparkid/components/sparky/CharacterEye";
import CharacterEyebrow from "@/features/sparkid/components/sparky/CharacterEyebrow";
import CharacterMouth, {CharacterMouthVariant} from "@/features/sparkid/components/sparky/CharacterMouth";

type TestFaceExpression = {
    eyes: {
        openness: number
        lookOffset: TestVec2
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

const TEST_NORMAL_EXPRESSION: TestFaceExpression = {
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

const TEST_EXPRESSIONS: Record<TestBatteryAnimation, TestFaceExpression> = {
    normal: TEST_NORMAL_EXPRESSION,
    idle: TEST_NORMAL_EXPRESSION,

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

function getTestBatteryEmoteBubbleProps(
    animation: TestBatteryAnimation
): CharacterEmoteBubbleProps {
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

type TestCheekProps = {
    position: TestVec3
    active?: boolean
}

function TestCheek({ position, active = false }: TestCheekProps) {
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

function TestEnergyGlowSide({ side }: { side: -1 | 1 }) {
    const glowRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        const glow = glowRef.current
        if (!glow) return

        const pulse = (Math.sin(state.clock.elapsedTime * 8 + side * 0.8) + 1) / 2

        glow.scale.setScalar(0.94 + pulse * 0.12)
        glow.position.x = side * (0.775 + pulse * 0.012)
    })

    return (
        <group
            ref={glowRef}
            position={[side * 0.775, -0.12, 0.32]}
            rotation={[0, side * 0.42, 0]}
        >
            <pointLight color="#00e5ff" intensity={1.25} distance={1.15} />

            <mesh position={[0, 0.12, 0]}>
                <capsuleGeometry args={[0.035, 0.1, 10, 18]} />
                <meshStandardMaterial
                    color="#9effff"
                    emissive="#00e5ff"
                    emissiveIntensity={2.5}
                    roughness={0.18}
                    metalness={0}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[0, -0.06, 0]}>
                <capsuleGeometry args={[0.033, 0.08, 10, 18]} />
                <meshStandardMaterial
                    color="#8bfaff"
                    emissive="#00d5ff"
                    emissiveIntensity={2.2}
                    roughness={0.18}
                    metalness={0}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[0, -0.22, 0]}>
                <capsuleGeometry args={[0.03, 0.055, 10, 18]} />
                <meshStandardMaterial
                    color="#76f7ff"
                    emissive="#00c8ff"
                    emissiveIntensity={1.8}
                    roughness={0.18}
                    metalness={0}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

function TestActiveAura() {
    const auraRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        const aura = auraRef.current
        if (!aura) return

        const pulse = (Math.sin(state.clock.elapsedTime * 5.5) + 1) / 2

        aura.scale.x = 1 + pulse * 0.025
        aura.scale.y = 1 + pulse * 0.035
        aura.scale.z = 1 + pulse * 0.025
    })

    return (
        <group ref={auraRef}>
            <pointLight
                position={[0, -0.1, 0.85]}
                color="#00e5ff"
                intensity={1.4}
                distance={2.1}
            />

            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.78, 0.018, 12, 96]} />
                <meshBasicMaterial
                    color="#00e5ff"
                    transparent
                    opacity={0.22}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.83, 0.01, 12, 96]} />
                <meshBasicMaterial
                    color="#76f7ff"
                    transparent
                    opacity={0.12}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}

type TestBatteryFaceLayerProps = {
    animation?: TestBatteryAnimation
    showSigns?: boolean
    showCheeks?: boolean
    showEmoteBubble?: boolean
    emoteBubbleType?: CharacterEmoteBubbleType | "auto"
    emoteBubbleCustomText?: string
    emoteBubbleProps?: Partial<CharacterEmoteBubbleProps>
}

export default function TestBatteryFaceLayer({
                                                 animation = "idle",
                                                 showSigns = true,
                                                 showCheeks = true,
                                                 showEmoteBubble = true,
                                                 emoteBubbleType = "auto",
                                                 emoteBubbleCustomText,
                                                 emoteBubbleProps,
                                             }: TestBatteryFaceLayerProps) {
    const expression = TEST_EXPRESSIONS[animation] ?? TEST_EXPRESSIONS.idle
    const isActive = animation === "active"
    const isLowEnergy = animation === "lowEnergy"

    const autoEmoteBubble = getTestBatteryEmoteBubbleProps(animation)

    const finalEmoteBubble: CharacterEmoteBubbleProps = {
        ...autoEmoteBubble,
        ...(emoteBubbleType !== "auto"
            ? {
                type: emoteBubbleType,
                customText: emoteBubbleCustomText,
            }
            : {}),
        ...emoteBubbleProps,
    }

    return (
        <group name="TestBatteryFaceLayer">
            {isActive && (
                <>
                    <TestActiveAura />
                    <TestEnergyGlowSide side={-1} />
                    <TestEnergyGlowSide side={1} />
                </>
            )}

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
                    <TestCheek position={[-0.455, -0.08, 0.742]} active={isActive} />
                    <TestCheek position={[0.455, -0.08, 0.742]} active={isActive} />
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
    )
}