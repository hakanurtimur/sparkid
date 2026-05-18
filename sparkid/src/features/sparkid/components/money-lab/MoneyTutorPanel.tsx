"use client"

import { useMemo, useState } from "react"

import SparkyGuideAvatar from "@/features/sparkid/components/circuit-lab/SparkyGuideAvatar"

import type { MoneyProduct } from "./data/moneyProducts"
import type {
    CheckMoneyChoiceResult,
    MoneyChoiceConnection,
} from "./utils/checkMoneyChoice"

export type MoneyTutorAction =
    | "explain_item"
    | "hint"
    | "explain_choice"
    | "simplify"
    | "daily_example"
    | "quiz"
    | "report"

export type MoneyTutorContext = {
    childName?: string
    age?: number
    islandSlug: string
    level: number
    selectedProductId?: string
    connections: MoneyChoiceConnection[]
    wrongConnections?: CheckMoneyChoiceResult["wrongConnections"]
    score?: {
        correct: number
        total: number
    }
}

type MoneyTutorPanelProps = {
    products: MoneyProduct[]
    connections: MoneyChoiceConnection[]
    selectedProductId?: string
    validationResult: CheckMoneyChoiceResult | null
    checked: boolean
    completed: boolean
}

const actions: Array<{
    id: MoneyTutorAction
    label: string
}> = [
    { id: "explain_item", label: "Bunu Bana Anlat" },
    { id: "hint", label: "İpucu Al" },
    { id: "explain_choice", label: "Neden Böyle?" },
    { id: "simplify", label: "Daha Basit Anlat" },
    { id: "quiz", label: "Mini Soru Sor" },
    { id: "report", label: "Rapor Oluştur" },
]

function getCategoryLabel(category: "need" | "want") {
    return category === "need" ? "ihtiyaç" : "istek"
}

function getTutorMessage({
    action,
    products,
    selectedProductId,
    validationResult,
    checked,
    completed,
}: {
    action: MoneyTutorAction
    products: MoneyProduct[]
    selectedProductId?: string
    validationResult: CheckMoneyChoiceResult | null
    checked: boolean
    completed: boolean
}) {
    const selectedProduct = products.find(
        (product) => product.id === selectedProductId,
    )
    const firstWrong = validationResult?.wrongConnections[0]
    const wrongProduct = products.find(
        (product) => product.id === firstWrong?.productId,
    )

    if (completed) {
        return "Harika! Tüm ürünleri doğru sınıflandırdın. Choice Lens kazandın; artık alışverişte ihtiyaç ve istek ayrımını daha net görebilirsin."
    }

    if (action === "explain_item") {
        if (!selectedProduct) {
            return "Bir ürün kartına tıkla, sana onun ihtiyaç mı istek mi olduğunu düşünürken nelere bakabileceğini anlatayım."
        }

        return selectedProduct.shortExplanation
    }

    if (action === "explain_choice") {
        if (firstWrong && wrongProduct) {
            return `${wrongProduct.displayName} için seçimin ${getCategoryLabel(
                firstWrong.selectedCategory,
            )}; doğru cevap ${getCategoryLabel(
                firstWrong.correctCategory,
            )}. ${wrongProduct.shortExplanation}`
        }

        if (!checked) {
            return "Önce ürünleri İhtiyaç veya İstek paneline bağla, sonra Kontrol Et'e bas. Yanlış varsa birlikte inceleyelim."
        }

        return "Şu an yanlış seçim görünmüyor. Eksik ürün kaldıysa onları da bağlayıp tekrar kontrol edebilirsin."
    }

    if (action === "simplify") {
        return "İhtiyaç: onsuz günlük hayat zorlaşır. İstek: güzel olur ama şart değildir."
    }

    if (action === "quiz") {
        return "Mini soru: Okul defteri genelde ihtiyaç mı, istek mi?"
    }

    if (action === "report") {
        if (!validationResult) {
            return "Rapor için önce bağlantıları kurup Kontrol Et'e basmalısın."
        }

        return `Öğrenme raporu: ${validationResult.correctCount}/${validationResult.total} doğru. Eksik ürün: ${validationResult.unconnectedProductIds.length}, yanlış seçim: ${validationResult.wrongCount}.`
    }

    return "Choice Line'ı seç, bir ürün plug'ına tıkla ve sonra İhtiyaç veya İstek panelindeki plug'a bağla."
}

export default function MoneyTutorPanel({
    products,
    connections,
    selectedProductId,
    validationResult,
    checked,
    completed,
}: MoneyTutorPanelProps) {
    const [activeAction, setActiveAction] =
        useState<MoneyTutorAction>("hint")

    const tutorContext = useMemo<MoneyTutorContext>(
        () => ({
            islandSlug: "need-want",
            level: 1,
            selectedProductId,
            connections,
            wrongConnections: validationResult?.wrongConnections,
            score: validationResult
                ? {
                      correct: validationResult.correctCount,
                      total: validationResult.total,
                  }
                : undefined,
        }),
        [connections, selectedProductId, validationResult],
    )

    const message = getTutorMessage({
        action: activeAction,
        products,
        selectedProductId: tutorContext.selectedProductId,
        validationResult,
        checked,
        completed,
    })

    return (
        <section className="rounded-[2rem] border border-[var(--sparkid-cyan)]/25 bg-[var(--sparkid-panel)]/90 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
                <SparkyGuideAvatar
                    size={118}
                    tone={completed ? "success" : checked ? "hint" : "idle"}
                />

                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-cyan)]">
                        Money Tutor
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-[var(--sparkid-white)]">
                        Sparky
                    </h2>
                    <p className="mt-2 min-h-[5rem] text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                        {message}
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
                {actions.map((action) => (
                    <button
                        key={action.id}
                        type="button"
                        onClick={() => setActiveAction(action.id)}
                        className={`rounded-2xl border px-3 py-2 text-xs font-black transition ${
                            activeAction === action.id
                                ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-yellow)]/15 text-[var(--sparkid-white)]"
                                : "border-white/10 bg-white/5 text-[var(--sparkid-muted)] hover:border-[var(--sparkid-cyan)]/45 hover:text-white"
                        }`}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </section>
    )
}
