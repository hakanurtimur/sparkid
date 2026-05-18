"use client"

import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"

import SparkyRobot, {
    type SparkyAnimation,
    type SparkyMood,
} from "@/features/sparkid/components/sparky/RobotMascot"

import type { SparkyTone } from "./AiTutorPanel"

type SparkyGuideAvatarProps = {
    size?: number
    tone?: SparkyTone
}

function getSparkyMood(tone: SparkyTone): SparkyMood {
    if (tone === "success") return "success"
    if (tone === "warning" || tone === "error") return "warning"
    if (tone === "hint") return "thinking"

    return "talking"
}

function getSparkyAnimation(tone: SparkyTone): SparkyAnimation {
    if (tone === "success") return "excited"

    return "talk"
}

export default function SparkyGuideAvatar({
    size = 132,
    tone = "idle",
}: SparkyGuideAvatarProps) {
    const mood = getSparkyMood(tone)
    const animation = getSparkyAnimation(tone)

    return (
        <div
            className="relative shrink-0 overflow-hidden rounded-3xl border border-[var(--sparkid-cyan)] bg-[radial-gradient(circle_at_50%_35%,rgba(53,229,242,0.2),rgba(6,26,61,0.95)_68%)] shadow-[0_0_28px_rgba(53,229,242,0.2)]"
            style={{
                width: size,
                height: size,
            }}
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{
                    position: [0, 0.04, 4.2],
                    fov: 34,
                    near: 0.1,
                    far: 20,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
            >
                <ambientLight intensity={1.1} />
                <directionalLight
                    position={[2.4, 3.2, 3.8]}
                    intensity={2.2}
                    color="#fff8e8"
                />
                <pointLight
                    position={[-1.6, 1.2, 2.8]}
                    intensity={0.9}
                    color="#35E5F2"
                />
                <Environment preset="city" />

                <group position={[0, -0.08, 0]} rotation={[0.02, -0.22, 0]}>
                    <SparkyRobot
                        mood={mood}
                        animation={animation}
                        scale={0.82}
                        followPointer
                        showBackDetails={false}
                        showEmoteBubble
                        emoteBubblePosition={[1, 0.68, 0.58]}
                        emoteBubbleScale={0.38}
                        emoteBubbleSide="right"
                        emoteBubbleBillboard
                    />
                </group>
            </Canvas>
        </div>
    )
}
