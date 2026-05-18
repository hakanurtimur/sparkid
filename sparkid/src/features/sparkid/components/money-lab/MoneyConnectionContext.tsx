"use client"

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import type { MoneyCategory } from "./data/moneyProducts"
import type { MoneyChoiceConnection } from "./utils/checkMoneyChoice"

export type MoneyPortKind = "product" | "category"

export type MoneyPortId = `product:${string}` | `category:${MoneyCategory}`

type MoneyConnectionContextValue = {
    pendingPortId: MoneyPortId | null
    connections: MoneyChoiceConnection[]
    selectPort: (portId: MoneyPortId) => void
    clearPendingPort: () => void
    resetConnections: () => void
    isPendingPort: (portId: MoneyPortId) => boolean
}

type MoneyConnectionProviderProps = {
    children: ReactNode
    enabled: boolean
    connections: MoneyChoiceConnection[]
    onConnectionsChange: (connections: MoneyChoiceConnection[]) => void
    onPendingPortChange?: (portId: MoneyPortId | null) => void
}

const MoneyConnectionContext =
    createContext<MoneyConnectionContextValue | null>(null)

function getPortKind(portId: MoneyPortId): MoneyPortKind {
    return portId.startsWith("product:") ? "product" : "category"
}

function getProductId(portId: MoneyPortId) {
    return portId.replace("product:", "")
}

function getCategory(portId: MoneyPortId): MoneyCategory {
    return portId.replace("category:", "") as MoneyCategory
}

function toMoneyConnection(
    firstPortId: MoneyPortId,
    secondPortId: MoneyPortId,
): MoneyChoiceConnection | null {
    const firstKind = getPortKind(firstPortId)
    const secondKind = getPortKind(secondPortId)

    if (firstKind === secondKind) return null

    const productPortId = firstKind === "product" ? firstPortId : secondPortId
    const categoryPortId =
        firstKind === "category" ? firstPortId : secondPortId

    return {
        id: `choice-${getProductId(productPortId)}`,
        fromProductId: getProductId(productPortId),
        toCategory: getCategory(categoryPortId),
    }
}

export function MoneyConnectionProvider({
    children,
    enabled,
    connections,
    onConnectionsChange,
    onPendingPortChange,
}: MoneyConnectionProviderProps) {
    const [pendingPortId, setPendingPortId] = useState<MoneyPortId | null>(null)

    const updatePendingPort = useCallback(
        (portId: MoneyPortId | null) => {
            setPendingPortId(portId)
            onPendingPortChange?.(portId)
        },
        [onPendingPortChange],
    )

    const clearPendingPort = useCallback(() => {
        updatePendingPort(null)
    }, [updatePendingPort])

    const resetConnections = useCallback(() => {
        updatePendingPort(null)
        onConnectionsChange([])
    }, [onConnectionsChange, updatePendingPort])

    const selectPort = useCallback(
        (portId: MoneyPortId) => {
            if (!enabled) return

            if (!pendingPortId) {
                if (getPortKind(portId) !== "product") return
                updatePendingPort(portId)
                return
            }

            if (pendingPortId === portId) {
                updatePendingPort(null)
                return
            }

            const nextConnection = toMoneyConnection(pendingPortId, portId)
            updatePendingPort(null)

            if (!nextConnection) return

            const nextConnections = connections.filter((connection) => {
                return connection.fromProductId !== nextConnection.fromProductId
            })

            onConnectionsChange([...nextConnections, nextConnection])
        },
        [
            connections,
            enabled,
            onConnectionsChange,
            pendingPortId,
            updatePendingPort,
        ],
    )

    const isPendingPort = useCallback(
        (portId: MoneyPortId) => pendingPortId === portId,
        [pendingPortId],
    )

    const value = useMemo<MoneyConnectionContextValue>(
        () => ({
            pendingPortId,
            connections,
            selectPort,
            clearPendingPort,
            resetConnections,
            isPendingPort,
        }),
        [
            pendingPortId,
            connections,
            selectPort,
            clearPendingPort,
            resetConnections,
            isPendingPort,
        ],
    )

    return (
        <MoneyConnectionContext.Provider value={value}>
            {children}
        </MoneyConnectionContext.Provider>
    )
}

export function useMoneyConnection() {
    const context = useContext(MoneyConnectionContext)

    if (!context) {
        throw new Error(
            "useMoneyConnection must be used inside MoneyConnectionProvider",
        )
    }

    return context
}
