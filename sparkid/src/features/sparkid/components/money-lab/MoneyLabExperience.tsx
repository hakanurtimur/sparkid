"use client"

import { useMemo, useState } from "react"

import MoneyLabTable from "./MoneyLabTable"
import {
    MoneyConnectionProvider,
    type MoneyPortId,
} from "./MoneyConnectionContext"
import MoneyPartsTray, { type MoneyTool } from "./MoneyPartsTray"
import MoneyTutorPanel from "./MoneyTutorPanel"
import { moneyProducts } from "./data/moneyProducts"
import {
    checkMoneyChoice,
    type CheckMoneyChoiceResult,
    type MoneyChoiceConnection,
} from "./utils/checkMoneyChoice"

function getStatusCopy({
    checked,
    validationResult,
}: {
    checked: boolean
    validationResult: CheckMoneyChoiceResult | null
}) {
    if (!checked || !validationResult) {
        return "Choice Line ile ürünleri İhtiyaç veya İstek paneline bağla."
    }

    if (validationResult.isComplete) {
        return "Choice Lens kazandın!"
    }

    return `${validationResult.correctCount}/${validationResult.total} doğru. Eksik: ${validationResult.unconnectedProductIds.length}, yanlış: ${validationResult.wrongCount}.`
}

export default function MoneyLabExperience() {
    const [selectedTool, setSelectedTool] = useState<MoneyTool | null>(
        "choiceLine",
    )
    const [connections, setConnections] = useState<MoneyChoiceConnection[]>([])
    const [pendingPortId, setPendingPortId] = useState<MoneyPortId | null>(null)
    const [validationResult, setValidationResult] =
        useState<CheckMoneyChoiceResult | null>(null)
    const [checked, setChecked] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<string>()

    const completed = Boolean(validationResult?.isComplete)
    const selectedToolIsChoiceLine = selectedTool === "choiceLine"

    const statusCopy = getStatusCopy({
        checked,
        validationResult,
    })

    const connectedCount = connections.length

    const handleConnectionsChange = (nextConnections: MoneyChoiceConnection[]) => {
        setConnections(nextConnections)
        setChecked(false)
        setValidationResult(null)
    }

    const handleCheck = () => {
        setValidationResult(
            checkMoneyChoice({
                connections,
                products: moneyProducts,
            }),
        )
        setChecked(true)
    }

    const handleReset = () => {
        setSelectedTool("choiceLine")
        setConnections([])
        setPendingPortId(null)
        setValidationResult(null)
        setChecked(false)
        setSelectedProductId(undefined)
    }

    const helperText = useMemo(() => {
        if (pendingPortId?.startsWith("product:")) {
            return "Şimdi İhtiyaç veya İstek plug'ına tıkla."
        }

        if (selectedTool === "hint") {
            return "İhtiyaç, olmazsa olmazdır. İstek, güzel ama şart olmayan şeydir."
        }

        return "Önce Choice Line'ı seç, sonra ürün plug'ından kategori plug'ına bağla."
    }, [pendingPortId, selectedTool])

    return (
        <main className="relative min-h-screen overflow-hidden bg-[var(--sparkid-navy-dark)] text-[var(--sparkid-white)]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-75"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_52%_44%,rgba(53,229,242,0.12),rgba(2,11,31,0.52)_54%,rgba(2,11,31,0.92)_100%)]"
            />

            <MoneyConnectionProvider
                enabled={selectedToolIsChoiceLine}
                connections={connections}
                onConnectionsChange={handleConnectionsChange}
                onPendingPortChange={setPendingPortId}
            >
                <section className="relative z-10 grid min-h-screen gap-5 p-4 lg:grid-cols-[196px_minmax(0,1fr)_390px] lg:p-5">
                    <aside className="order-2 lg:order-1">
                        <MoneyPartsTray
                            selectedTool={selectedTool}
                            onSelectTool={setSelectedTool}
                            onReset={handleReset}
                        />
                    </aside>

                    <div className="order-1 min-w-0 lg:order-2">
                        <header className="mb-4 rounded-[2rem] border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-xl">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
                                        Need or Want Island
                                    </p>
                                    <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--sparkid-white)]">
                                        İhtiyaç mı, İstek mi?
                                    </h1>
                                    <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                                        {helperText}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-secondary)]">
                                            Bağlantı
                                        </p>
                                        <p className="mt-1 text-lg font-black">
                                            {connectedCount}/{moneyProducts.length}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCheck}
                                        className="rounded-2xl bg-[var(--sparkid-yellow)] px-5 py-4 text-sm font-black text-[var(--sparkid-navy-dark)] shadow-[0_18px_40px_rgba(255,216,74,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--sparkid-orange)]"
                                    >
                                        Kontrol Et
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-[var(--sparkid-white)]">
                                {statusCopy}
                            </p>
                        </header>

                        <MoneyLabTable
                            products={moneyProducts}
                            selectedProductId={selectedProductId}
                            selectedToolIsChoiceLine={selectedToolIsChoiceLine}
                            checked={checked}
                            connections={connections}
                            validationResult={validationResult}
                            onSelectProduct={setSelectedProductId}
                        />
                    </div>

                    <aside className="order-3">
                        <MoneyTutorPanel
                            products={moneyProducts}
                            connections={connections}
                            selectedProductId={selectedProductId}
                            validationResult={validationResult}
                            checked={checked}
                            completed={completed}
                        />
                    </aside>
                </section>
            </MoneyConnectionProvider>
        </main>
    )
}
