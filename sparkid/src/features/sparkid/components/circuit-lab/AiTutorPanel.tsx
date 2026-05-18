"use client"

import { useEffect, useState } from "react"

import SparkyGuideAvatar from "./SparkyGuideAvatar"

export type SparkyTone = "idle" | "hint" | "success" | "warning" | "error"

export type SparkyMessage = {
    title: string
    message: string
    tone?: SparkyTone
    stepLabel?: string
}

type AiTutorPanelProps = {
    sparkyMessage: SparkyMessage
}

const toneClassName: Record<SparkyTone, string> = {
    idle: "text-[var(--sparkid-cyan)]",
    hint: "text-[var(--sparkid-yellow)]",
    success: "text-emerald-300",
    warning: "text-orange-300",
    error: "text-red-300",
}

const tonePanelClassName: Record<SparkyTone, string> = {
    idle: "border-[var(--sparkid-border)] shadow-[0_18px_45px_rgba(2,11,31,0.24)]",
    hint: "border-[var(--sparkid-yellow)]/40 shadow-[0_18px_45px_rgba(255,216,74,0.12)]",
    success: "border-emerald-300/40 shadow-[0_18px_45px_rgba(69,227,154,0.12)]",
    warning: "border-orange-300/40 shadow-[0_18px_45px_rgba(255,183,44,0.12)]",
    error: "border-red-300/40 shadow-[0_18px_45px_rgba(255,107,107,0.12)]",
}

function TypedTutorMessage({ message }: { message: string }) {
    const [typedMessage, setTypedMessage] = useState("")

    useEffect(() => {
        let nextIndex = 0
        let interval: number | undefined

        const timeout = window.setTimeout(() => {
            setTypedMessage("")

            interval = window.setInterval(() => {
                nextIndex += 1
                setTypedMessage(message.slice(0, nextIndex))

                if (nextIndex >= message.length) {
                    window.clearInterval(interval)
                }
            }, 18)
        }, 80)

        return () => {
            window.clearTimeout(timeout)
            if (interval) window.clearInterval(interval)
        }
    }, [message])

    return (
        <p className="mt-4 min-h-[4.5rem] text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
            {typedMessage}
            {typedMessage.length < message.length && (
                <span className="ml-0.5 inline-block h-4 w-1 translate-y-0.5 animate-pulse rounded-full bg-[var(--sparkid-cyan)]" />
            )}
        </p>
    )
}

export default function AiTutorPanel({ sparkyMessage }: AiTutorPanelProps) {
    const tone = sparkyMessage.tone ?? "idle"

    return (
        <section
            className={`rounded-3xl border bg-[var(--sparkid-panel)] p-5 ${tonePanelClassName[tone]}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <SparkyGuideAvatar size={132} tone={tone} />

                    <div className="min-w-0">
                        <p
                            className={`text-[10px] font-black uppercase tracking-[0.2em] ${toneClassName[tone]}`}
                        >
                            AI Rehber
                        </p>

                        <h2 className="mt-1 text-xl font-black text-[var(--sparkid-white)]">
                            Sparky
                        </h2>

                        <p className="mt-1 text-xs font-black text-[var(--sparkid-secondary)]">
                            {sparkyMessage.title}
                        </p>
                    </div>
                </div>

                {sparkyMessage.stepLabel && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
                        {sparkyMessage.stepLabel}
                    </span>
                )}
            </div>

            <TypedTutorMessage
                key={sparkyMessage.message}
                message={sparkyMessage.message}
            />
        </section>
    )
}
