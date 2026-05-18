"use client"

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import { useCircuitConnections } from "./CircuitConnectionContext"

export type CableWireConnection = {
    id: string
    fromPortId: string
    toPortId: string
}

type CableConnectionModeContextValue = {
    enabled: boolean
    pendingPortId: string | null
    wires: CableWireConnection[]
    maxWires: number
    selectPort: (portId: string) => void
    clearPendingPort: () => void
    clearWires: () => void
    isPendingPort: (portId: string) => boolean
}

type CableConnectionModeProviderProps = {
    children: ReactNode
    enabled: boolean
    maxWires?: number
    modeToken?: number
    onWireCreate?: (wire: CableWireConnection) => void
    onWiresChange?: (wires: CableWireConnection[]) => void
    onPendingPortChange?: (portId: string | null) => void
}

const fallbackValue: CableConnectionModeContextValue = {
    enabled: false,
    pendingPortId: null,
    wires: [],
    maxWires: 3,
    selectPort: () => {},
    clearPendingPort: () => {},
    clearWires: () => {},
    isPendingPort: () => false,
}

const CableConnectionModeContext =
    createContext<CableConnectionModeContextValue | null>(null)

function hasSameWire(
    wires: CableWireConnection[],
    fromPortId: string,
    toPortId: string,
) {
    return wires.some((wire) => {
        const sameDirection =
            wire.fromPortId === fromPortId && wire.toPortId === toPortId

        const reverseDirection =
            wire.fromPortId === toPortId && wire.toPortId === fromPortId

        return sameDirection || reverseDirection
    })
}

function touchesPort(wire: CableWireConnection, portId: string) {
    return wire.fromPortId === portId || wire.toPortId === portId
}

export function CableConnectionModeProvider({
                                                children,
                                                enabled,
                                                maxWires = 3,
                                                modeToken = 0,
                                                onWireCreate,
                                                onWiresChange,
                                                onPendingPortChange,
                                            }: CableConnectionModeProviderProps) {
    const { connectPorts, disconnectPort } = useCircuitConnections()

    const [pendingPort, setPendingPort] = useState<{
        portId: string | null
        modeToken: number
    }>({
        portId: null,
        modeToken,
    })
    const [wires, setWires] = useState<CableWireConnection[]>([])

    const pendingPortId =
        enabled && pendingPort.modeToken === modeToken
            ? pendingPort.portId
            : null

    const updatePendingPort = useCallback(
        (nextPortId: string | null) => {
            setPendingPort({
                portId: nextPortId,
                modeToken,
            })
            onPendingPortChange?.(nextPortId)
        },
        [modeToken, onPendingPortChange],
    )

    const clearPendingPort = useCallback(() => {
        if (!pendingPortId) return
        updatePendingPort(null)
    }, [pendingPortId, updatePendingPort])

    const clearWires = useCallback(() => {
        wires.forEach((wire) => {
            disconnectPort(wire.fromPortId)
            disconnectPort(wire.toPortId)
        })

        updatePendingPort(null)
        setWires([])
        onWiresChange?.([])
    }, [disconnectPort, onWiresChange, updatePendingPort, wires])

    const selectPort = useCallback(
        (portId: string) => {
            if (!enabled) return

            if (!pendingPortId) {
                updatePendingPort(portId)
                return
            }

            if (pendingPortId === portId) {
                updatePendingPort(null)
                return
            }

            if (hasSameWire(wires, pendingPortId, portId)) {
                updatePendingPort(null)
                return
            }

            const cleanedWires = wires.filter((wire) => {
                return !touchesPort(wire, pendingPortId) && !touchesPort(wire, portId)
            })

            if (cleanedWires.length >= maxWires) {
                updatePendingPort(null)
                return
            }

            const nextWire: CableWireConnection = {
                id: `wire-${Date.now()}`,
                fromPortId: pendingPortId,
                toPortId: portId,
            }

            connectPorts(pendingPortId, portId)

            const nextWires = [...cleanedWires, nextWire]

            updatePendingPort(null)
            setWires(nextWires)
            onWireCreate?.(nextWire)
            onWiresChange?.(nextWires)
        },
        [
            connectPorts,
            enabled,
            maxWires,
            onWireCreate,
            onWiresChange,
            pendingPortId,
            updatePendingPort,
            wires,
        ],
    )

    const isPendingPort = useCallback(
        (portId: string) => {
            return enabled && pendingPortId === portId
        },
        [enabled, pendingPortId],
    )

    const value = useMemo<CableConnectionModeContextValue>(
        () => ({
            enabled,
            pendingPortId,
            wires,
            maxWires,
            selectPort,
            clearPendingPort,
            clearWires,
            isPendingPort,
        }),
        [
            enabled,
            pendingPortId,
            wires,
            maxWires,
            selectPort,
            clearPendingPort,
            clearWires,
            isPendingPort,
        ],
    )

    return (
        <CableConnectionModeContext.Provider value={value}>
            {children}
        </CableConnectionModeContext.Provider>
    )
}

export function useCableConnectionMode() {
    return useContext(CableConnectionModeContext) ?? fallbackValue
}
