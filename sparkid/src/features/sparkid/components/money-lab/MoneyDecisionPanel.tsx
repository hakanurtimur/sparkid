"use client"

import type { MoneyCategory } from "./data/moneyProducts"
import type { MoneyPortId } from "./MoneyConnectionContext"

type MoneyDecisionPanelProps = {
    category: MoneyCategory
    title: string
    description: string
    count: number
    pending?: boolean
    disabled?: boolean
    onPlugClick: (portId: MoneyPortId) => void
    registerPlugRef: (portId: MoneyPortId, element: HTMLButtonElement | null) => void
}

export default function MoneyDecisionPanel({
    category,
    title,
    description,
    count,
    pending = false,
    disabled = false,
    onPlugClick,
    registerPlugRef,
}: MoneyDecisionPanelProps) {
    const portId = `category:${category}` as MoneyPortId

    return (
        <section
            className={`relative rounded-3xl border p-5 transition ${
                pending
                    ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-yellow)]/10 shadow-[0_0_34px_rgba(255,216,74,0.16)]"
                    : "border-[var(--sparkid-cyan)]/30 bg-[var(--sparkid-panel)]/92"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-cyan)]">
                        Decision Panel
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-[var(--sparkid-white)]">
                        {title}
                    </h3>
                    <p className="mt-2 max-w-[17rem] text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                        {description}
                    </p>
                </div>

                <button
                    ref={(element) => registerPlugRef(portId, element)}
                    type="button"
                    disabled={disabled}
                    aria-label={`${title} bağlantı noktası`}
                    onClick={() => onPlugClick(portId)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--sparkid-yellow)] bg-[var(--sparkid-navy-dark)] shadow-[0_0_24px_rgba(255,216,74,0.22)] transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-55"
                >
                    <span className="h-4 w-4 rounded-full bg-[var(--sparkid-yellow)]" />
                </button>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-[var(--sparkid-white)]">
                Bağlı ürün: {count}
            </div>
        </section>
    )
}
