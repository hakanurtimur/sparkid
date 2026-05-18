import type { ReactNode } from "react"

export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export type GlbAnimationName = string

export type GlbLoopMode = "repeat" | "once"

export type GlbPortalMap = Record<string, ReactNode>

export type GlbAnimationControllerHandle<TAnimation extends string = string> = {
    play: (animation: TAnimation, options?: GlbPlayOptions) => void
    stop: () => void
    stopOne: (animation: TAnimation) => void
}

export type GlbPlayOptions = {
    fade?: number
    loopMode?: GlbLoopMode
    timeScale?: number
    weight?: number
    clampWhenFinished?: boolean
}