"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
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
    isPortSelectable: (portId: string) => boolean
    selectPort: (portId: string) => void
    removeWire: (wireId: string) => void
    clearPendingPort: () => void
    clearWires: () => void
    isPendingPort: (portId: string) => boolean
}

type CableConnectionModeProviderProps = {
    children: ReactNode
    enabled: boolean
    maxWires?: number
    allowedPortIds?: string[]
    sharedPortIds?: string[]
    initialWires?: CableWireConnection[]
    modeToken?: number
    onWireCreate?: (wire: CableWireConnection) => void
    onWireRemove?: (wire: CableWireConnection) => void
    onWiresChange?: (wires: CableWireConnection[]) => void
    onPendingPortChange?: (portId: string | null) => void
}

const fallbackValue: CableConnectionModeContextValue = {
    enabled: false,
    pendingPortId: null,
    wires: [],
    maxWires: 3,
    isPortSelectable: () => false,
    selectPort: () => {},
    removeWire: () => {},
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
                                                allowedPortIds,
                                                sharedPortIds,
                                                initialWires = [],
                                                modeToken = 0,
                                                onWireCreate,
                                                onWireRemove,
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
    const [wires, setWires] = useState<CableWireConnection[]>(initialWires)

    useEffect(() => {
        initialWires.forEach((wire) => {
            connectPorts(wire.fromPortId, wire.toPortId)
        })

        onWiresChange?.(initialWires)
    }, [connectPorts, initialWires, onWiresChange])

    const pendingPortId =
        enabled && pendingPort.modeToken === modeToken
            ? pendingPort.portId
            : null

    const allowedPortIdSet = useMemo(() => {
        if (!allowedPortIds) return null

        return new Set(allowedPortIds)
    }, [allowedPortIds])

    const sharedPortIdSet = useMemo(() => {
        if (!sharedPortIds) return null

        return new Set(sharedPortIds)
    }, [sharedPortIds])

    const isPortSelectable = useCallback(
        (portId: string) => {
            return enabled && (!allowedPortIdSet || allowedPortIdSet.has(portId))
        },
        [allowedPortIdSet, enabled],
    )

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
            if (!isPortSelectable(portId)) return

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
                const touchesPending = touchesPort(wire, pendingPortId)
                const touchesTarget = touchesPort(wire, portId)
                const pendingCanShare = sharedPortIdSet?.has(pendingPortId)
                const targetCanShare = sharedPortIdSet?.has(portId)

                return !(touchesPending && !pendingCanShare)
                    && !(touchesTarget && !targetCanShare)
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
            isPortSelectable,
            maxWires,
            onWireCreate,
            onWiresChange,
            pendingPortId,
            sharedPortIdSet,
            updatePendingPort,
            wires,
        ],
    )

    const removeWire = useCallback(
        (wireId: string) => {
            const removedWire = wires.find((wire) => wire.id === wireId)
            if (!removedWire) return

            disconnectPort(removedWire.fromPortId)
            disconnectPort(removedWire.toPortId)
            updatePendingPort(null)

            const nextWires = wires.filter((wire) => wire.id !== wireId)

            setWires(nextWires)
            onWireRemove?.(removedWire)
            onWiresChange?.(nextWires)
        },
        [
            disconnectPort,
            onWireRemove,
            onWiresChange,
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
            isPortSelectable,
            selectPort,
            removeWire,
            clearPendingPort,
            clearWires,
            isPendingPort,
        }),
        [
            enabled,
            pendingPortId,
            wires,
            maxWires,
            isPortSelectable,
            selectPort,
            removeWire,
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
