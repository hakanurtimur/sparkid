"use client"

import * as THREE from "three"
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react"

export type CircuitPortKind = "plug" | "socket" | "terminal" | "any"

export type CircuitOwnerKind =
    | "battery"
    | "lightBulb"
    | "cable"
    | "switch"
    | "junction"

export type CircuitPortData = {
    id: string
    ownerId: string
    ownerKind: CircuitOwnerKind
    kind: CircuitPortKind
    worldPosition: THREE.Vector3
    worldNormal: THREE.Vector3
    enabled: boolean
}

type FindNearestPortOptions = {
    maxDistance?: number
    excludeIds?: string[]
    movingKind?: CircuitPortKind
}

type InternalEdge = [string, string]

type CircuitConnectionContextValue = {
    version: number

    registerPort: (port: CircuitPortData) => void

    updatePort: (
        id: string,
        worldPosition: THREE.Vector3,
        worldNormal?: THREE.Vector3
    ) => void

    unregisterPort: (id: string) => void

    getPort: (id: string) => CircuitPortData | undefined

    findNearestPort: (
        worldPosition: THREE.Vector3,
        options?: FindNearestPortOptions
    ) => CircuitPortData | null

    connectPorts: (a: string, b: string) => void
    disconnectPort: (id: string) => void
    getConnectedPortId: (id: string) => string | undefined
    getConnectionCount: () => number

    arePortsConnected: (
        startId: string,
        targetId: string,
        internalEdges?: InternalEdge[]
    ) => boolean
}

const CircuitConnectionContext =
    createContext<CircuitConnectionContextValue | null>(null)

function isCompatible(
    movingKind: CircuitPortKind,
    targetKind: CircuitPortKind
) {
    if (movingKind === "any" || targetKind === "any") return true

    if (movingKind === "terminal" && targetKind === "terminal") return true

    return (
        (movingKind === "plug" && targetKind === "socket") ||
        (movingKind === "socket" && targetKind === "plug")
    )
}

export function CircuitConnectionProvider({
                                              children,
                                          }: {
    children: ReactNode
}) {
    const portsRef = useRef<Map<string, CircuitPortData>>(new Map())
    const connectionsRef = useRef<Map<string, string>>(new Map())

    const [version, setVersion] = useState(0)

    const bump = useCallback(() => {
        setVersion((current) => current + 1)
    }, [])

    const registerPort = useCallback(
        (port: CircuitPortData) => {
            portsRef.current.set(port.id, port)
            bump()
        },
        [bump]
    )

    const updatePort = useCallback(
        (
            id: string,
            worldPosition: THREE.Vector3,
            worldNormal?: THREE.Vector3
        ) => {
            const port = portsRef.current.get(id)
            if (!port) return

            port.worldPosition.copy(worldPosition)

            if (worldNormal) {
                port.worldNormal.copy(worldNormal).normalize()
            }
        },
        []
    )

    const unregisterPort = useCallback(
        (id: string) => {
            portsRef.current.delete(id)

            const connectedId = connectionsRef.current.get(id)

            if (connectedId) {
                connectionsRef.current.delete(connectedId)
            }

            connectionsRef.current.delete(id)
            bump()
        },
        [bump]
    )

    const getPort = useCallback((id: string) => {
        return portsRef.current.get(id)
    }, [])

    const findNearestPort = useCallback(
        (
            worldPosition: THREE.Vector3,
            options: FindNearestPortOptions = {}
        ) => {
            const {
                maxDistance = 0.28,
                excludeIds = [],
                movingKind = "any",
            } = options

            let bestPort: CircuitPortData | null = null
            let bestDistance = maxDistance

            portsRef.current.forEach((port) => {
                if (!port.enabled) return
                if (excludeIds.includes(port.id)) return
                if (!isCompatible(movingKind, port.kind)) return

                const distance = port.worldPosition.distanceTo(worldPosition)

                if (distance < bestDistance) {
                    bestDistance = distance
                    bestPort = port
                }
            })

            return bestPort
        },
        []
    )

    const disconnectPortInternal = useCallback((id: string) => {
        const connectedId = connectionsRef.current.get(id)

        if (connectedId) {
            connectionsRef.current.delete(connectedId)
        }

        connectionsRef.current.delete(id)
    }, [])

    const disconnectPort = useCallback(
        (id: string) => {
            disconnectPortInternal(id)
            bump()
        },
        [disconnectPortInternal, bump]
    )

    const connectPorts = useCallback(
        (a: string, b: string) => {
            if (a === b) return

            disconnectPortInternal(a)
            disconnectPortInternal(b)

            connectionsRef.current.set(a, b)
            connectionsRef.current.set(b, a)

            bump()
        },
        [disconnectPortInternal, bump]
    )

    const getConnectedPortId = useCallback((id: string) => {
        return connectionsRef.current.get(id)
    }, [])

    const getConnectionCount = useCallback(() => {
        return connectionsRef.current.size / 2
    }, [])

    const arePortsConnected = useCallback(
        (startId: string, targetId: string, internalEdges: InternalEdge[] = []) => {
            const graph = new Map<string, Set<string>>()

            const addEdge = (a: string, b: string) => {
                if (!graph.has(a)) graph.set(a, new Set())
                if (!graph.has(b)) graph.set(b, new Set())

                graph.get(a)?.add(b)
                graph.get(b)?.add(a)
            }

            connectionsRef.current.forEach((b, a) => {
                addEdge(a, b)
            })

            internalEdges.forEach(([a, b]) => {
                addEdge(a, b)
            })

            const visited = new Set<string>()
            const queue = [startId]

            while (queue.length > 0) {
                const current = queue.shift()
                if (!current) continue

                if (current === targetId) return true
                if (visited.has(current)) continue

                visited.add(current)

                graph.get(current)?.forEach((next) => {
                    if (!visited.has(next)) queue.push(next)
                })
            }

            return false
        },
        []
    )

    const value = useMemo<CircuitConnectionContextValue>(
        () => ({
            version,
            registerPort,
            updatePort,
            unregisterPort,
            getPort,
            findNearestPort,
            connectPorts,
            disconnectPort,
            getConnectedPortId,
            getConnectionCount,
            arePortsConnected,
        }),
        [
            version,
            registerPort,
            updatePort,
            unregisterPort,
            getPort,
            findNearestPort,
            connectPorts,
            disconnectPort,
            getConnectedPortId,
            getConnectionCount,
            arePortsConnected,
        ]
    )

    return (
        <CircuitConnectionContext.Provider value={value}>
            {children}
        </CircuitConnectionContext.Provider>
    )
}

export function useCircuitConnections() {
    const context = useContext(CircuitConnectionContext)

    if (!context) {
        throw new Error(
            "useCircuitConnections must be used inside CircuitConnectionProvider"
        )
    }

    return context
}
