"use client"

import {
    useLayoutEffect,
    useState,
    type MutableRefObject,
} from "react"

import type { MoneyCategory } from "./data/moneyProducts"
import type { MoneyChoiceConnection } from "./utils/checkMoneyChoice"
import type { CheckMoneyChoiceResult } from "./utils/checkMoneyChoice"

type MoneyLineLayerProps = {
    containerRef: MutableRefObject<HTMLDivElement | null>
    productPlugRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>
    categoryPlugRefs: MutableRefObject<Record<MoneyCategory, HTMLButtonElement | null>>
    connections: MoneyChoiceConnection[]
    checked: boolean
    validationResult: CheckMoneyChoiceResult | null
}

type LineGeometry = {
    id: string
    path: string
    status: "idle" | "correct" | "wrong"
}

function getCenter(
    element: HTMLElement,
    containerRect: DOMRect,
) {
    const rect = element.getBoundingClientRect()

    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
    }
}

function getLineStatus(
    connection: MoneyChoiceConnection,
    checked: boolean,
    validationResult: CheckMoneyChoiceResult | null,
): LineGeometry["status"] {
    if (!checked || !validationResult) return "idle"

    const wrong = validationResult.wrongConnections.some((wrongConnection) => {
        return wrongConnection.productId === connection.fromProductId
    })

    return wrong ? "wrong" : "correct"
}

export default function MoneyLineLayer({
    containerRef,
    productPlugRefs,
    categoryPlugRefs,
    connections,
    checked,
    validationResult,
}: MoneyLineLayerProps) {
    const [lines, setLines] = useState<LineGeometry[]>([])

    useLayoutEffect(() => {
        const updateLines = () => {
            const container = containerRef.current
            if (!container) return

            const containerRect = container.getBoundingClientRect()

            const nextLines = connections.flatMap((connection) => {
                const productPlug =
                    productPlugRefs.current[connection.fromProductId]
                const categoryPlug =
                    categoryPlugRefs.current[connection.toCategory]

                if (!productPlug || !categoryPlug) return []

                const from = getCenter(productPlug, containerRect)
                const to = getCenter(categoryPlug, containerRect)
                const bend = Math.max(Math.abs(to.x - from.x) * 0.35, 80)
                const path = `M ${from.x} ${from.y} C ${from.x + bend} ${from.y}, ${to.x - bend} ${to.y}, ${to.x} ${to.y}`

                return [
                    {
                        id: connection.id,
                        path,
                        status: getLineStatus(
                            connection,
                            checked,
                            validationResult,
                        ),
                    },
                ]
            })

            setLines(nextLines)
        }

        updateLines()
        window.addEventListener("resize", updateLines)

        return () => {
            window.removeEventListener("resize", updateLines)
        }
    }, [
        categoryPlugRefs,
        checked,
        connections,
        containerRef,
        productPlugRefs,
        validationResult,
    ])

    return (
        <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
        >
            {lines.map((line) => {
                const color =
                    line.status === "correct"
                        ? "#45E39A"
                        : line.status === "wrong"
                          ? "#FFB72C"
                          : "#35E5F2"

                return (
                    <g key={line.id}>
                        <path
                            d={line.path}
                            fill="none"
                            stroke={color}
                            strokeWidth={12}
                            strokeLinecap="round"
                            opacity={0.14}
                        />
                        <path
                            d={line.path}
                            fill="none"
                            stroke={color}
                            strokeWidth={4}
                            strokeLinecap="round"
                            className={
                                line.status === "wrong" ? "animate-pulse" : ""
                            }
                        />
                    </g>
                )
            })}
        </svg>
    )
}
