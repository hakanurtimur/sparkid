"use client"

import type { ReactNode } from "react"

import TestBatteryAnimatedModel from "@/features/sparkid/components/assets/circuit-elements/battery/TestBatteryAnimatedModel"
import type { TestBatteryAnimation } from "@/features/sparkid/components/assets/circuit-elements/battery/TestBatteryGlbConfig"
import TestBatteryFaceLayer from "@/features/sparkid/components/dev-tools/TestBatteryFaceLayer"

type Vec3 = [number, number, number]

type BatteryGlbCharacterProps = {
    animation?: TestBatteryAnimation
    position?: Vec3
    scale?: number

    showSigns?: boolean
    showCheeks?: boolean
    showEmoteBubble?: boolean

    children?: ReactNode
}

export default function BatteryGlbCharacter({
                                                animation = "idle",
                                                position = [0, 0, 0],
                                                scale = 1,

                                                showSigns = true,
                                                showCheeks = true,
                                                showEmoteBubble = true,

                                                children,
                                            }: BatteryGlbCharacterProps) {
    return (
        <TestBatteryAnimatedModel
            animation={animation}
            position={position}
            scale={scale}
        >
            <TestBatteryFaceLayer
                animation={animation}
                showSigns={showSigns}
                showCheeks={showCheeks}
                showEmoteBubble={showEmoteBubble}
            />

            {children}
        </TestBatteryAnimatedModel>
    )
}