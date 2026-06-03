"use client"

import type { SparkyTone } from "./AiTutorPanel"

type SparkyGuideAvatarProps = {
    size?: number
    tone?: SparkyTone
}

const toneGlow: Record<SparkyTone, string> = {
    idle: "rgba(53,229,242,0.38)",
    hint: "rgba(255,216,74,0.38)",
    success: "rgba(69,227,154,0.42)",
    warning: "rgba(255,183,44,0.42)",
    error: "rgba(255,107,107,0.42)",
}

export default function SparkyGuideAvatar({
    size = 132,
    tone = "idle",
}: SparkyGuideAvatarProps) {
    return (
        <div
            className="relative grid shrink-0 place-items-center overflow-hidden rounded-3xl border border-[var(--sparkid-cyan)] bg-[radial-gradient(circle_at_50%_35%,rgba(53,229,242,0.24),rgba(6,26,61,0.95)_68%)] shadow-[0_0_28px_rgba(53,229,242,0.2)]"
            style={{
                width: size,
                height: size,
                boxShadow: `0 0 30px ${toneGlow[tone]}`,
            }}
        >
            <div
                aria-hidden
                className="absolute inset-3 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,248,232,0.16),rgba(53,229,242,0.08)_42%,rgba(2,11,31,0.42))]"
            />
            <div className="relative grid h-[72%] w-[72%] place-items-center rounded-[1.5rem] border border-white/15 bg-[var(--sparkid-navy)] shadow-[inset_0_-14px_24px_rgba(0,0,0,0.32)]">
                <span className="text-5xl font-black text-[var(--sparkid-cyan)] drop-shadow-[0_0_16px_rgba(53,229,242,0.55)]">
                    S
                </span>
                <span className="absolute bottom-3 h-2 w-10 rounded-full bg-[var(--sparkid-yellow)] shadow-[0_0_14px_rgba(255,216,74,0.5)]" />
            </div>
        </div>
    )
}
