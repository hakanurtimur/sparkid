import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"

import { hasWireBetween, type CircuitWireLike } from "./circuitWireUtils"

export type FreeLabCircuitType = "simple" | "switch" | "series" | "parallel"

export type FreeLabCircuitDetection = {
    circuitType: FreeLabCircuitType | null
    powered: boolean
    poweredBulbIds: string[]
}

type Graph = Map<string, Set<string>>

const BATTERY_PLUS = "battery:plus"
const BATTERY_MINUS = "battery:minus"

const BULBS = [
    { id: "bulb", a: "bulb:a", b: "bulb:b" },
    { id: "bulb-2", a: "bulb-2:a", b: "bulb-2:b" },
]

function addEdge(graph: Graph, fromPortId: string, toPortId: string) {
    if (!graph.has(fromPortId)) graph.set(fromPortId, new Set())
    if (!graph.has(toPortId)) graph.set(toPortId, new Set())

    graph.get(fromPortId)?.add(toPortId)
    graph.get(toPortId)?.add(fromPortId)
}

function createExternalGraph(wires: CircuitWireLike[], switchMode: CircuitSwitchMode) {
    const graph: Graph = new Map()

    wires.forEach((wire) => {
        addEdge(graph, wire.fromPortId, wire.toPortId)
    })

    if (switchMode === "on") {
        addEdge(graph, "switch-1:in", "switch-1:out")
    }

    return graph
}

function cloneGraph(graph: Graph) {
    const nextGraph: Graph = new Map()

    graph.forEach((neighbors, portId) => {
        nextGraph.set(portId, new Set(neighbors))
    })

    return nextGraph
}

function areConnected(graph: Graph, startPortId: string, targetPortId: string) {
    const visited = new Set<string>()
    const queue = [startPortId]

    while (queue.length > 0) {
        const currentPortId = queue.shift()
        if (!currentPortId) continue
        if (currentPortId === targetPortId) return true
        if (visited.has(currentPortId)) continue

        visited.add(currentPortId)

        graph.get(currentPortId)?.forEach((nextPortId) => {
            if (!visited.has(nextPortId)) queue.push(nextPortId)
        })
    }

    return false
}

function createGraphForBulbPowerCheck(
    baseGraph: Graph,
    testedBulb: (typeof BULBS)[number],
) {
    const graph = cloneGraph(baseGraph)

    BULBS.forEach((bulb) => {
        if (bulb.id === testedBulb.id) return

        addEdge(graph, bulb.a, bulb.b)
    })

    return graph
}

function isBulbPowered(baseGraph: Graph, bulb: (typeof BULBS)[number]) {
    const graph = createGraphForBulbPowerCheck(baseGraph, bulb)
    const plusToA = areConnected(graph, BATTERY_PLUS, bulb.a)
    const minusToB = areConnected(graph, BATTERY_MINUS, bulb.b)
    const plusToB = areConnected(graph, BATTERY_PLUS, bulb.b)
    const minusToA = areConnected(graph, BATTERY_MINUS, bulb.a)

    return (plusToA && minusToB) || (plusToB && minusToA)
}

function usesSwitch(wires: CircuitWireLike[]) {
    return wires.some((wire) => {
        return wire.fromPortId.startsWith("switch-1:")
            || wire.toPortId.startsWith("switch-1:")
    })
}

function hasSeriesBridge(wires: CircuitWireLike[]) {
    return hasWireBetween(wires, "bulb:b", "bulb-2:a")
        || hasWireBetween(wires, "bulb:a", "bulb-2:b")
        || hasWireBetween(wires, "bulb-2:b", "bulb:a")
        || hasWireBetween(wires, "bulb-2:a", "bulb:b")
}

function hasParallelBranches(wires: CircuitWireLike[]) {
    const bulbOneBranch =
        (
            hasWireBetween(wires, BATTERY_PLUS, "bulb:a")
            && hasWireBetween(wires, "bulb:b", BATTERY_MINUS)
        )
        || (
            hasWireBetween(wires, BATTERY_PLUS, "bulb:b")
            && hasWireBetween(wires, "bulb:a", BATTERY_MINUS)
        )

    const bulbTwoBranch =
        (
            hasWireBetween(wires, BATTERY_PLUS, "bulb-2:a")
            && hasWireBetween(wires, "bulb-2:b", BATTERY_MINUS)
        )
        || (
            hasWireBetween(wires, BATTERY_PLUS, "bulb-2:b")
            && hasWireBetween(wires, "bulb-2:a", BATTERY_MINUS)
        )

    return bulbOneBranch && bulbTwoBranch
}

function detectCircuitType({
                               wires,
                               switchMode,
                               poweredBulbIds,
                           }: {
    wires: CircuitWireLike[]
    switchMode: CircuitSwitchMode
    poweredBulbIds: string[]
}): FreeLabCircuitType | null {
    if (poweredBulbIds.length <= 0) return null

    if (poweredBulbIds.length >= 2 && hasParallelBranches(wires)) {
        return "parallel"
    }

    if (poweredBulbIds.length >= 2 && hasSeriesBridge(wires)) {
        return "series"
    }

    if (switchMode === "on" && usesSwitch(wires)) {
        return "switch"
    }

    return "simple"
}

export function detectFreeLabCircuit({
    wires,
    switchMode,
}: {
    wires: CircuitWireLike[]
    switchMode: CircuitSwitchMode
}): FreeLabCircuitDetection {
    const graph = createExternalGraph(wires, switchMode)
    const poweredBulbIds = BULBS
        .filter((bulb) => isBulbPowered(graph, bulb))
        .map((bulb) => bulb.id)

    return {
        circuitType: detectCircuitType({ wires, switchMode, poweredBulbIds }),
        powered: poweredBulbIds.length > 0,
        poweredBulbIds,
    }
}
