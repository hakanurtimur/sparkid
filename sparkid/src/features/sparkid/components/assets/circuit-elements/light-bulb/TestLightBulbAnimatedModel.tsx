"use client"

import type { ReactNode } from "react"

import { AnimatedGlbModel } from "@/features/sparkid/glb"

import {
    TEST_LIGHT_BULB_MODEL_PATH,
    TEST_LIGHT_BULB_NODES,
    type TestLightBulbAnimation,
} from "./TestLightBulbGlbConfig"

type Vec3 = [number, number, number]

type TestLightBulbAnimatedModelProps = {
    animation?: TestLightBulbAnimation
    position?: Vec3
    scale?: number
    children?: ReactNode
}

export default function TestLightBulbAnimatedModel({
                                                       animation = "hover",
                                                       position = [0, 0, 0],
                                                       scale = 1,
                                                       children,
                                                   }: TestLightBulbAnimatedModelProps) {
    return (
        <AnimatedGlbModel
            src={TEST_LIGHT_BULB_MODEL_PATH}
            animation={animation}
            defaultAnimation="hover"
            position={position}
            scale={scale}
            portals={{
                [TEST_LIGHT_BULB_NODES.body]: children,
            }}
        />
    )
}