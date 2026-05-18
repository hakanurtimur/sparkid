"use client"

import { useMemo, useRef, type MutableRefObject } from "react"

import MoneyDecisionPanel from "./MoneyDecisionPanel"
import { useMoneyConnection, type MoneyPortId } from "./MoneyConnectionContext"
import MoneyLineLayer from "./MoneyLineLayer"
import MoneyProductCardNode from "./MoneyProductCardNode"
import type { MoneyCategory, MoneyProduct } from "./data/moneyProducts"
import type {
    CheckMoneyChoiceResult,
    MoneyChoiceConnection,
} from "./utils/checkMoneyChoice"

type MoneyLabTableProps = {
    products: MoneyProduct[]
    selectedProductId?: string
    selectedToolIsChoiceLine: boolean
    checked: boolean
    connections: MoneyChoiceConnection[]
    validationResult: CheckMoneyChoiceResult | null
    onSelectProduct: (productId: string) => void
}

function getConnectionForProduct(
    productId: string,
    connections: MoneyChoiceConnection[],
) {
    return connections.find((connection) => {
        return connection.fromProductId === productId
    })
}

function getProductStatus({
    product,
    connections,
    checked,
    validationResult,
    pendingPortId,
}: {
    product: MoneyProduct
    connections: MoneyChoiceConnection[]
    checked: boolean
    validationResult: CheckMoneyChoiceResult | null
    pendingPortId: MoneyPortId | null
}) {
    if (pendingPortId === `product:${product.id}`) return "pending"
    if (!checked || !validationResult) return "idle"

    const connection = getConnectionForProduct(product.id, connections)
    if (!connection) return "idle"

    const wrong = validationResult.wrongConnections.some((wrongConnection) => {
        return wrongConnection.productId === product.id
    })

    return wrong ? "wrong" : "correct"
}

function getCategoryCount(
    category: MoneyCategory,
    connections: MoneyChoiceConnection[],
) {
    return connections.filter((connection) => connection.toCategory === category)
        .length
}

export default function MoneyLabTable({
    products,
    selectedProductId,
    selectedToolIsChoiceLine,
    checked,
    connections,
    validationResult,
    onSelectProduct,
}: MoneyLabTableProps) {
    const tableRef = useRef<HTMLDivElement | null>(null)
    const productPlugRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const categoryPlugRefs = useRef<
        Record<MoneyCategory, HTMLButtonElement | null>
    >({
        need: null,
        want: null,
    })

    const moneyConnection = useMoneyConnection()

    const categoryPending = useMemo(
        () => ({
            need: moneyConnection.pendingPortId === "category:need",
            want: moneyConnection.pendingPortId === "category:want",
        }),
        [moneyConnection.pendingPortId],
    )

    const registerProductPlugRef = (
        portId: MoneyPortId,
        element: HTMLButtonElement | null,
    ) => {
        const productId = portId.replace("product:", "")
        productPlugRefs.current[productId] = element
    }

    const registerCategoryPlugRef = (
        portId: MoneyPortId,
        element: HTMLButtonElement | null,
    ) => {
        const category = portId.replace("category:", "") as MoneyCategory
        categoryPlugRefs.current[category] = element
    }

    return (
        <section
            ref={tableRef}
            className="relative min-h-[650px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,rgba(9,34,79,0.88),rgba(6,26,61,0.78))] p-6 shadow-[0_36px_90px_rgba(2,11,31,0.45)]"
        >
            <MoneyLineLayer
                containerRef={
                    tableRef as MutableRefObject<HTMLDivElement | null>
                }
                productPlugRefs={productPlugRefs}
                categoryPlugRefs={categoryPlugRefs}
                connections={connections}
                checked={checked}
                validationResult={validationResult}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-12 bottom-8 h-12 rounded-full bg-black/30 blur-2xl"
            />

            <div className="relative z-30 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
                                Money Task Table
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[var(--sparkid-white)]">
                                Ürünleri doğru alana bağla
                            </h2>
                        </div>

                        <div className="hidden rounded-3xl border border-[var(--sparkid-yellow)]/30 bg-[var(--sparkid-yellow)]/10 px-5 py-4 text-right md:block">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-yellow)]">
                                Wallet
                            </p>
                            <p className="mt-1 text-3xl">◉</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                        {products.map((product) => (
                            <MoneyProductCardNode
                                key={product.id}
                                product={product}
                                selected={selectedProductId === product.id}
                                disabled={!selectedToolIsChoiceLine}
                                status={getProductStatus({
                                    product,
                                    connections,
                                    checked,
                                    validationResult,
                                    pendingPortId: moneyConnection.pendingPortId,
                                })}
                                onSelectProduct={onSelectProduct}
                                onPlugClick={moneyConnection.selectPort}
                                registerPlugRef={registerProductPlugRef}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid content-start gap-4">
                    <MoneyDecisionPanel
                        category="need"
                        title="İhtiyaç"
                        description="Sağlık, okul, güvenlik veya günlük yaşam için gerekli olanlar."
                        count={getCategoryCount("need", connections)}
                        pending={categoryPending.need}
                        disabled={!selectedToolIsChoiceLine}
                        onPlugClick={moneyConnection.selectPort}
                        registerPlugRef={registerCategoryPlugRef}
                    />

                    <MoneyDecisionPanel
                        category="want"
                        title="İstek"
                        description="Güzel, eğlenceli veya keyifli olabilir; ama zorunlu değildir."
                        count={getCategoryCount("want", connections)}
                        pending={categoryPending.want}
                        disabled={!selectedToolIsChoiceLine}
                        onPlugClick={moneyConnection.selectPort}
                        registerPlugRef={registerCategoryPlugRef}
                    />
                </div>
            </div>
        </section>
    )
}
