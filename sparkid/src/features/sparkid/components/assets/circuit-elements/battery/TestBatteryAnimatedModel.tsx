"use client"

import type { ReactNode } from "react"

import { AnimatedGlbModel } from "@/features/sparkid/glb"

import {
    TEST_BATTERY_MODEL_PATH,
    TEST_BATTERY_NODES,
    type TestBatteryAnimation,
} from "./TestBatteryGlbConfig"

type Vec3 = [number, number, number]

type TestBatteryAnimatedModelProps = {
    animation?: TestBatteryAnimation
    position?: Vec3
    scale?: number
    children?: ReactNode
}

export default function TestBatteryAnimatedModel({
                                                     animation = "idle",
                                                     position = [0, 0, 0],
                                                     scale = 1,
                                                     children,
                                                 }: TestBatteryAnimatedModelProps) {
    return (
        <AnimatedGlbModel
            src={TEST_BATTERY_MODEL_PATH}
            animation={animation}
            defaultAnimation="idle"
            position={position}
            scale={scale}
            portals={{
                [TEST_BATTERY_NODES.body]: children,
            }}
        />
    )
}