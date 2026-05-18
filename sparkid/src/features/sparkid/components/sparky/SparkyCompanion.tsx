"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"

import SparkyRobot, {
    type SparkyAnimation,
    type SparkyMood,
} from "@/features/sparkid/components/sparky/RobotMascot"

export type SparkyEmotion = "happy" | "thinking" | "warning" | "success"
export type SparkyCompanionPlacement =
    | "bottom-right"
    | "center-right"
    | "bottom-center"
    | "top-right"

type SparkyCompanionProps = {
    emotion?: SparkyEmotion
    message?: string
    compact?: boolean
    showIntro?: boolean
    placement?: SparkyCompanionPlacement
    actionLabel?: string
    onAction?: () => void
    truncateMessage?: boolean
}

const DEFAULT_MESSAGE = "Merhaba! Ben Sparky. Devreni birlikte yakalım."

const emotionToMood: Record<SparkyEmotion, SparkyMood> = {
    happy: "happy",
    thinking: "thinking",
    warning: "warning",
    success: "success",
}

const emotionToAnimation: Record<SparkyEmotion, SparkyAnimation> = {
    happy: "bob",
    thinking: "hover",
    warning: "bob",
    success: "excited",
}

function getShortMessage(message: string) {
    if (message.length <= 72) return message

    return `${message.slice(0, 69).trim()}...`
}

const placementClasses: Record<SparkyCompanionPlacement, string> = {
    "bottom-right":
        "inset-x-0 bottom-4 justify-center px-4 sm:inset-x-auto sm:right-4 sm:justify-end",
    "center-right":
        "inset-x-0 bottom-24 justify-center px-4 sm:inset-x-auto sm:right-5 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 sm:justify-end",
    "bottom-center": "inset-x-0 bottom-5 justify-center px-4",
    "top-right":
        "inset-x-0 top-20 justify-center px-4 sm:inset-x-auto sm:right-5 sm:justify-end",
}

export default function SparkyCompanion({
                                            emotion = "happy",
                                            message = DEFAULT_MESSAGE,
                                            compact = false,
                                            showIntro = false,
                                            placement = "bottom-right",
                                            actionLabel,
                                            onAction,
                                            truncateMessage = true,
                                        }: SparkyCompanionProps) {
    const [introVisible, setIntroVisible] = useState(showIntro)

    useEffect(() => {
        if (!showIntro) return

        const timeout = window.setTimeout(() => {
            setIntroVisible(false)
        }, 3800)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [showIntro])

    const showBubble = !compact || introVisible
    const mood = emotionToMood[emotion]
    const animation = emotionToAnimation[emotion]
    const displayMessage = introVisible
        ? DEFAULT_MESSAGE
        : truncateMessage
            ? getShortMessage(message)
            : message

    return (
        <div
            className={`pointer-events-none fixed z-50 flex transition-all duration-700 motion-reduce:transition-none ${placementClasses[placement]}`}
        >
            <div
                className={`pointer-events-auto flex max-w-[calc(100vw-2rem)] items-end gap-3 transition-all duration-500 motion-reduce:transition-none ${
                    introVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-95"
                }`}
            >
                {showBubble && (
                    <div className="mb-3 max-w-[240px] rounded-3xl border border-[var(--sparkid-border)] bg-[var(--sparkid-card)] px-4 py-3 shadow-[0_18px_45px_rgba(2,11,31,0.36)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-cyan)]">
                            Sparky
                        </p>
                        <p className="mt-1 text-sm font-bold leading-5 text-[var(--sparkid-white)]">
                            {displayMessage}
                        </p>
                        {actionLabel && (
                            <button
                                type="button"
                                onClick={onAction}
                                className="mt-3 rounded-full border border-[var(--sparkid-border)] bg-[var(--sparkid-panel)] px-3 py-1.5 text-xs font-black text-[var(--sparkid-cyan)] transition hover:border-[var(--sparkid-cyan)] hover:text-[var(--sparkid-white)]"
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                )}

                <div className="h-24 w-24 origin-bottom rounded-full border border-[var(--sparkid-border)] bg-[var(--sparkid-panel)] shadow-[0_18px_45px_rgba(2,11,31,0.38)] transition duration-300 hover:scale-105 sm:h-28 sm:w-28">
                    <Canvas
                        camera={{ position: [0, 0.08, 4.2], fov: 34 }}
                        dpr={1}
                        gl={{ antialias: true, alpha: true }}
                        className="h-full w-full"
                    >
                        <ambientLight intensity={1.8} />
                        <directionalLight position={[2, 3, 4]} intensity={2.2} />
                        <pointLight
                            position={[-1.4, 1.2, 2.2]}
                            intensity={1.1}
                            color="#35e5f2"
                        />
                        <SparkyRobot
                            mood={mood}
                            animation={animation}
                            scale={0.7}
                            position={[0, -0.1, 0]}
                            followPointer={false}
                            showBackDetails={false}
                            showEmoteBubble={false}
                        />
                    </Canvas>
                </div>
            </div>
        </div>
    )
}
