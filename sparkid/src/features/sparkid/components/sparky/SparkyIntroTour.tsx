"use client"

import * as THREE from "three"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrthographicCamera, RoundedBox, Text } from "@react-three/drei"

import SparkyRobot, {
    type SparkyAnimation,
    type SparkyMood,
} from "@/features/sparkid/components/sparky/RobotMascot"

type Vec3 = [number, number, number]

export type SparkyIntroStep = {
    id: string
    message: string
    position: Vec3
    rotationY: number
    mood: SparkyMood
    animation: SparkyAnimation
    durationMs: number
    showBubble?: boolean
}

type SparkyIntroTourProps = {
    onActiveChange?: (active: boolean) => void
    onComplete?: () => void
}

const INTRO_STORAGE_KEY = "sparkid:circuit:intro-seen"

const introSteps: SparkyIntroStep[] = [
    {
        id: "hello",
        message:
            "Merhaba! Ben Sparky. Bugün birlikte kapalı devrenin nasıl çalıştığını keşfedeceğiz.",
        position: [-2.15, -1.05, 0],
        rotationY: 0.18,
        mood: "happy",
        animation: "bob",
        durationMs: 4200,
    },
    {
        id: "playground",
        message:
            "Ortadaki alanda pil, kablo, anahtar ve ampulü kullanarak devreni kuracaksın.",
        position: [1.75, 0.1, 0],
        rotationY: -0.45,
        mood: "thinking",
        animation: "talk",
        durationMs: 4000,
    },
    {
        id: "parts",
        message: "Alttaki Devre Kutusu'ndan parçaları takip edebilirsin.",
        position: [0, -1.55, 0],
        rotationY: 0,
        mood: "success",
        animation: "hover",
        durationMs: 3400,
    },
    {
        id: "missions",
        message: "Sağdaki görevler sana adım adım ne yapacağını gösterecek.",
        position: [2.25, 1.18, 0],
        rotationY: Math.PI,
        mood: "thinking",
        animation: "rotate",
        durationMs: 3600,
    },
    {
        id: "start",
        message: "Hazırsan kabloyu bir bağlantı noktasına takarak başlayalım.",
        position: [-1.95, -1.05, 0],
        rotationY: 0,
        mood: "happy",
        animation: "excited",
        durationMs: 3600,
    },
]

const dockStep: SparkyIntroStep = {
    id: "exit",
    message: "",
    position: [3.55, -2.65, 0],
    rotationY: 0,
    mood: "happy",
    animation: "hover",
    durationMs: 950,
    showBubble: false,
}

function getDockStep() {
    if (typeof window === "undefined") return dockStep

    const isMobile = window.matchMedia("(max-width: 640px)").matches

    if (!isMobile) return dockStep

    return {
        ...dockStep,
        position: [0.95, -2.95, 0] as Vec3,
    }
}

function shouldStartIntro() {
    if (typeof window === "undefined") return false

    const searchParams = new URLSearchParams(window.location.search)
    const forceIntro = searchParams.get("intro") === "1"
    const hasSeenIntro = (() => {
        try {
            return window.localStorage.getItem(INTRO_STORAGE_KEY) === "true"
        } catch {
            return false
        }
    })()

    return forceIntro || !hasSeenIntro
}

function ResponsiveIntroCamera() {
    const { width, height } = useThree((state) => state.size)
    const zoom = Math.min(width / 6.1, height / 3.75)

    return (
        <OrthographicCamera
            makeDefault
            position={[0, 0, 8]}
            zoom={Math.max(72, Math.min(150, zoom))}
            near={0.1}
            far={100}
        />
    )
}

function IntroStage({
                        step,
                        stepIndex,
                        closing,
                    }: {
    step: SparkyIntroStep
    stepIndex: number
    closing: boolean
}) {
    const guideRef = useRef<THREE.Group>(null)
    const [initialPosition] = useState<Vec3>(() => step.position)
    const [initialRotationY] = useState(() => step.rotationY)
    const targetPositionRef = useRef(new THREE.Vector3(...step.position))
    const targetRotationYRef = useRef(step.rotationY)

    useEffect(() => {
        targetPositionRef.current.set(...step.position)
        targetRotationYRef.current = step.rotationY
    }, [step])

    useFrame((state) => {
        const guide = guideRef.current
        if (!guide) return

        const target = targetPositionRef.current
        const t = state.clock.elapsedTime

        guide.position.lerp(target, 0.045)
        guide.position.y += Math.sin(t * 2.1) * 0.0025

        guide.rotation.y = THREE.MathUtils.lerp(
            guide.rotation.y,
            targetRotationYRef.current,
            0.045
        )
    })

    const bubbleX = step.position[0] > 1.4 ? -1.05 : 1.05
    const showBubble = step.showBubble !== false

    return (
        <>
            <ambientLight intensity={1.35} />
            <directionalLight
                position={[2.5, 3.4, 5]}
                intensity={2.2}
                color="#fff8e8"
            />
            <pointLight
                position={[-2.2, -1.1, 2.8]}
                intensity={1.2}
                distance={6}
                color="#35e5f2"
            />

            <group
                ref={guideRef}
                position={initialPosition}
                rotation={[0, initialRotationY, 0]}
            >
                <SparkyRobot
                    mood={step.mood}
                    animation={step.animation}
                    scale={0.42}
                    followPointer={false}
                    showBackDetails
                    showEmoteBubble
                    emoteBubblePosition={[0.62, 0.68, 0.36]}
                    emoteBubbleScale={0.46}
                    emoteBubbleSide="right"
                />

                {showBubble && (
                    <group
                        position={[bubbleX, 0.88, 0.05]}
                        rotation={[0, -step.rotationY, 0]}
                    >
                        <RoundedBox
                            args={[2.05, 0.58, 0.05]}
                            radius={0.12}
                            smoothness={10}
                        >
                            <meshBasicMaterial
                                color="#09224f"
                                transparent
                                opacity={0.96}
                                depthWrite={false}
                            />
                        </RoundedBox>

                        <Text
                            position={[0, 0.02, 0.04]}
                            fontSize={0.082}
                            maxWidth={1.78}
                            lineHeight={1.08}
                            color="#fff8e8"
                            anchorX="center"
                            anchorY="middle"
                            textAlign="center"
                        >
                            {step.message}
                        </Text>
                    </group>
                )}
            </group>

            {!closing && (
                <Text
                    position={[0, -2.02, 0]}
                    fontSize={0.085}
                    color="#b8c7e6"
                    anchorX="center"
                    anchorY="middle"
                >
                    {stepIndex + 1} / {introSteps.length}
                </Text>
            )}
        </>
    )
}

export default function SparkyIntroTour({
                                            onActiveChange,
                                            onComplete,
                                        }: SparkyIntroTourProps) {
    const [isActive, setIsActive] = useState(shouldStartIntro)
    const [stepIndex, setStepIndex] = useState(0)
    const [closing, setClosing] = useState(false)

    const currentStep = introSteps[stepIndex]

    const effectiveStep = useMemo<SparkyIntroStep | undefined>(() => {
        if (closing) return getDockStep()
        if (!currentStep) return undefined
        if (typeof window === "undefined") return currentStep

        const isMobile = window.matchMedia("(max-width: 640px)").matches
        if (!isMobile) return currentStep

        return {
            ...currentStep,
            position: [0, -1.32, 0],
            rotationY: 0,
            durationMs: Math.min(currentStep.durationMs, 3000),
        }
    }, [closing, currentStep])

    useEffect(() => {
        onActiveChange?.(isActive)
    }, [isActive, onActiveChange])

    const completeIntro = useCallback(() => {
        try {
            window.localStorage.setItem(INTRO_STORAGE_KEY, "true")
        } catch {
            // Intro still closes in environments where storage is unavailable.
        }

        setIsActive(false)
        onActiveChange?.(false)
        onComplete?.()
    }, [onActiveChange, onComplete])

    const finishIntro = useCallback(() => {
        if (closing) return

        setClosing(true)
    }, [closing])

    useEffect(() => {
        if (!closing) return

        const timeout = window.setTimeout(() => {
            completeIntro()
        }, dockStep.durationMs)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [closing, completeIntro])

    useEffect(() => {
        if (!isActive || !effectiveStep || closing) return

        const timeout = window.setTimeout(() => {
            if (stepIndex >= introSteps.length - 1) {
                finishIntro()
                return
            }

            setStepIndex((current) => current + 1)
        }, effectiveStep.durationMs)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [closing, effectiveStep, finishIntro, isActive, stepIndex])

    if (!isActive || !effectiveStep) return null

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div
                className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(53,229,242,0.12),transparent_34%),rgba(2,11,31,0.34)] transition-opacity duration-500 ${
                    closing ? "opacity-0" : "opacity-100"
                }`}
            />

            <Canvas
                orthographic
                dpr={[1, 1.25]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                className="absolute inset-0 h-full w-full"
            >
                <ResponsiveIntroCamera />
                <IntroStage
                    step={effectiveStep}
                    stepIndex={stepIndex}
                    closing={closing}
                />
            </Canvas>

            {!closing && (
                <button
                    type="button"
                    onClick={finishIntro}
                    className="pointer-events-auto fixed right-5 top-5 rounded-full border border-[var(--sparkid-border)] bg-[var(--sparkid-card)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--sparkid-cyan)] shadow-[0_14px_34px_rgba(2,11,31,0.35)] transition hover:border-[var(--sparkid-cyan)] hover:text-[var(--sparkid-white)]"
                >
                    Geç
                </button>
            )}
        </div>
    )
}
