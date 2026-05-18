"use client"

import type { MoneyProduct } from "./data/moneyProducts"
import type { MoneyPortId } from "./MoneyConnectionContext"

type MoneyProductCardStatus = "idle" | "pending" | "correct" | "wrong"

type MoneyProductCardNodeProps = {
    product: MoneyProduct
    status?: MoneyProductCardStatus
    disabled?: boolean
    selected?: boolean
    onSelectProduct?: (productId: string) => void
    onPlugClick: (portId: MoneyPortId) => void
    registerPlugRef: (portId: MoneyPortId, element: HTMLButtonElement | null) => void
}

const statusClassName: Record<MoneyProductCardStatus, string> = {
    idle: "border-white/10 bg-[var(--sparkid-card)] shadow-[0_16px_36px_rgba(2,11,31,0.22)]",
    pending:
        "border-[var(--sparkid-cyan)] bg-[var(--sparkid-panel)] shadow-[0_0_34px_rgba(53,229,242,0.22)]",
    correct:
        "border-emerald-300/70 bg-emerald-400/10 shadow-[0_0_30px_rgba(69,227,154,0.18)]",
    wrong:
        "animate-pulse border-orange-300/70 bg-orange-400/10 shadow-[0_0_30px_rgba(255,183,44,0.18)]",
}

export default function MoneyProductCardNode({
    product,
    status = "idle",
    disabled = false,
    selected = false,
    onSelectProduct,
    onPlugClick,
    registerPlugRef,
}: MoneyProductCardNodeProps) {
    const portId = `product:${product.id}` as MoneyPortId

    return (
        <article
            className={`relative min-h-[132px] rounded-3xl border p-4 transition ${statusClassName[status]} ${
                selected ? "ring-2 ring-[var(--sparkid-yellow)]/70" : ""
            }`}
            onClick={() => onSelectProduct?.(product.id)}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                        {product.emoji}
                    </div>
                    <h3 className="mt-3 text-base font-black text-[var(--sparkid-white)]">
                        {product.displayName}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sparkid-secondary)]">
                        Product Card
                    </p>
                </div>

                <button
                    ref={(element) => registerPlugRef(portId, element)}
                    type="button"
                    disabled={disabled}
                    aria-label={`${product.displayName} bağlantı noktası`}
                    onClick={(event) => {
                        event.stopPropagation()
                        onSelectProduct?.(product.id)
                        onPlugClick(portId)
                    }}
                    className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--sparkid-cyan)] bg-[var(--sparkid-navy-dark)] shadow-[0_0_18px_rgba(53,229,242,0.24)] transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-55"
                >
                    <span className="h-3.5 w-3.5 rounded-full bg-[var(--sparkid-cyan)]" />
                </button>
            </div>
        </article>
    )
}
