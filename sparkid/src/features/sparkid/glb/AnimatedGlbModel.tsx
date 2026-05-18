"use client"

import * as THREE from "three"
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js"
import { useAnimations, useGLTF } from "@react-three/drei"
import { createPortal } from "@react-three/fiber"
import {
    Fragment,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react"

import type {
    GlbAnimationControllerHandle,
    GlbPlayOptions,
    GlbPortalMap,
    Vec3,
} from "./glbTypes"

type AnimatedGlbModelProps<TAnimation extends string = string> = {
    src: string
    animation?: TAnimation
    defaultAnimation?: TAnimation
    position?: Vec3
    rotation?: Vec3
    scale?: number | Vec3

    loopMode?: "repeat" | "once"
    fade?: number
    timeScale?: number

    portals?: GlbPortalMap
    visible?: boolean
}

function normalizeScale(scale: number | Vec3): Vec3 {
    if (typeof scale === "number") {
        return [scale, scale, scale]
    }

    return scale
}

const AnimatedGlbModel = forwardRef(function AnimatedGlbModel<
    TAnimation extends string = string,
>(
    {
        src,
        animation,
        defaultAnimation,
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        scale = 1,
        loopMode = "repeat",
        fade = 0.14,
        timeScale = 1,
        portals = {},
        visible = true,
    }: AnimatedGlbModelProps<TAnimation>,
    ref: React.ForwardedRef<GlbAnimationControllerHandle<TAnimation>>
) {
    const rootRef = useRef<THREE.Group>(null)
    const currentActionNameRef = useRef<string | null>(null)

    const gltf = useGLTF(src)

    const scene = useMemo(() => {
        return SkeletonUtils.clone(gltf.scene) as THREE.Group
    }, [gltf.scene])

    const animations = gltf.animations

    const { actions } = useAnimations(animations, rootRef)

    const portalEntries = useMemo(() => {
        return Object.entries(portals)
            .map(([nodeName, content]) => {
                const target = scene.getObjectByName(nodeName)

                return {
                    nodeName,
                    target,
                    content,
                }
            })
            .filter((entry) => Boolean(entry.target) && Boolean(entry.content))
    }, [portals, scene])

    const stop = useCallback(() => {
        Object.values(actions).forEach((action) => {
            action?.stop()
        })

        currentActionNameRef.current = null
    }, [actions])

    const stopOne = useCallback(
        (nextAnimation: TAnimation) => {
            const action = actions[String(nextAnimation)]

            if (!action) return

            action.stop()

            if (currentActionNameRef.current === String(nextAnimation)) {
                currentActionNameRef.current = null
            }
        },
        [actions]
    )

    const play = useCallback(
        (nextAnimation: TAnimation, options?: GlbPlayOptions) => {
            const actionName = String(nextAnimation)
            const nextAction = actions[actionName]

            if (!nextAction) {
                console.warn(`Animation not found: ${actionName}`)
                return
            }

            const localFade = options?.fade ?? fade
            const localLoopMode = options?.loopMode ?? loopMode
            const localTimeScale = options?.timeScale ?? timeScale
            const localWeight = options?.weight ?? 1
            const localClampWhenFinished = options?.clampWhenFinished ?? true

            const previousActionName = currentActionNameRef.current
            const previousAction = previousActionName
                ? actions[previousActionName]
                : null

            if (previousAction && previousAction !== nextAction) {
                previousAction.fadeOut(localFade)
            }

            nextAction.reset()
            nextAction.enabled = true
            nextAction.setEffectiveTimeScale(localTimeScale)
            nextAction.setEffectiveWeight(localWeight)

            if (localLoopMode === "repeat") {
                nextAction.setLoop(THREE.LoopRepeat, Infinity)
                nextAction.clampWhenFinished = false
            } else {
                nextAction.setLoop(THREE.LoopOnce, 1)
                nextAction.clampWhenFinished = localClampWhenFinished
            }

            nextAction.fadeIn(localFade).play()

            currentActionNameRef.current = actionName
        },
        [actions, fade, loopMode, timeScale]
    )

    useImperativeHandle(
        ref,
        () => ({
            play,
            stop,
            stopOne,
        }),
        [play, stop, stopOne]
    )

    useEffect(() => {
        const nextAnimation = animation ?? defaultAnimation

        if (!nextAnimation) return

        play(nextAnimation)
    }, [animation, defaultAnimation, play])

    useEffect(() => {
        return () => {
            stop()
        }
    }, [stop])

    return (
        <group
            ref={rootRef}
            position={position}
            rotation={rotation}
            scale={normalizeScale(scale)}
            visible={visible}
        >
            <primitive object={scene} />

            {portalEntries.map((entry) => {
                if (!entry.target || !entry.content) return null

                return (
                    <Fragment key={entry.nodeName}>
                        {createPortal(entry.content, entry.target)}
                    </Fragment>
                )
            })}
        </group>
    )
})

export default AnimatedGlbModel