"use client"

import * as THREE from "three"
import { useAnimations, useGLTF } from "@react-three/drei"
import { createPortal } from "@react-three/fiber"
import {
    forwardRef,
    type ReactNode,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react"

import TestBatteryFaceLayer from "./TestBatteryFaceLayer"
import type { TestBatteryAnimation, TestVec3 } from "./TestBatteryTypes"
import { TEST_BATTERY_BODY_NODE_NAME } from "./TestBatteryBodyAsset"

export type TestBatteryCharacterModelHandle = {
    play: (animation: TestBatteryAnimation) => void
    stop: () => void
}

type TestBatteryCharacterModelProps = {
    src?: string
    animation?: TestBatteryAnimation
    position?: TestVec3
    scale?: number
    loop?: boolean

    showSigns?: boolean
    showCheeks?: boolean
    showEmoteBubble?: boolean

    children?: ReactNode
}

const DEFAULT_TEST_BATTERY_SRC = "/models/sparkid/test-battery-body.glb"

const EXPORTABLE_ANIMATIONS: TestBatteryAnimation[] = [
    "idle",
    "talk",
    "happy",
    "sad",
    "angry",
    "surprised",
    "active",
    "lowEnergy",
]

function normalizeAnimation(animation: TestBatteryAnimation): TestBatteryAnimation {
    if (animation === "normal") return "idle"
    return animation
}

const TestBatteryCharacterModel = forwardRef<
    TestBatteryCharacterModelHandle,
    TestBatteryCharacterModelProps
>(function TestBatteryCharacterModel(
    {
        src = DEFAULT_TEST_BATTERY_SRC,
        animation = "idle",
        position = [0, 0, 0],
        scale = 1,
        loop = true,

        showSigns = true,
        showCheeks = true,
        showEmoteBubble = true,

        children,
    },
    ref
) {
    const groupRef = useRef<THREE.Group>(null)
    const currentActionNameRef = useRef<string | null>(null)

    const { scene, animations } = useGLTF(src)
    const { actions } = useAnimations(animations, groupRef)

    const motionRoot = useMemo(() => {
        return scene.getObjectByName(TEST_BATTERY_BODY_NODE_NAME)
    }, [scene])

    const stop = useCallback(() => {
        Object.values(actions).forEach((action) => {
            action?.stop()
        })

        currentActionNameRef.current = null
    }, [actions])

    const play = useCallback(
        (nextAnimation: TestBatteryAnimation) => {
            const normalizedAnimation = normalizeAnimation(nextAnimation)

            if (!EXPORTABLE_ANIMATIONS.includes(normalizedAnimation)) return

            const nextAction = actions[normalizedAnimation]

            if (!nextAction) {
                console.warn(`Animation not found: ${normalizedAnimation}`)
                return
            }

            const previousActionName = currentActionNameRef.current
            const previousAction = previousActionName
                ? actions[previousActionName]
                : null

            if (previousAction && previousAction !== nextAction) {
                previousAction.fadeOut(0.12)
            }

            nextAction.reset()
            nextAction.enabled = true
            nextAction.setEffectiveTimeScale(1)
            nextAction.setEffectiveWeight(1)

            if (loop) {
                nextAction.setLoop(THREE.LoopRepeat, Infinity)
            } else {
                nextAction.setLoop(THREE.LoopOnce, 1)
                nextAction.clampWhenFinished = true
            }

            nextAction.fadeIn(0.12).play()

            currentActionNameRef.current = normalizedAnimation
        },
        [actions, loop]
    )

    useImperativeHandle(
        ref,
        () => ({
            play,
            stop,
        }),
        [play, stop]
    )

    useEffect(() => {
        play(animation)

        return () => {
            stop()
        }
    }, [animation, play, stop])

    return (
        <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
            <primitive object={scene} />

            {motionRoot &&
                createPortal(
                    <>
                        <TestBatteryFaceLayer
                            animation={animation}
                            showSigns={showSigns}
                            showCheeks={showCheeks}
                            showEmoteBubble={showEmoteBubble}
                        />

                        {children}
                    </>,
                    motionRoot
                )}
        </group>
    )
})

export default TestBatteryCharacterModel

useGLTF.preload(DEFAULT_TEST_BATTERY_SRC)