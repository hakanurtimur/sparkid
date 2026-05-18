import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"

export type CircuitPowerWire = {
    fromPortId: string
    toPortId: string
}

export type CircuitPowerState = {
    hasBatteryToSwitch: boolean
    hasSwitchToBulb: boolean
    hasBulbToBattery: boolean
    isCircuitComplete: boolean
    powered: boolean
}

type CheckCircuitPowerInput = {
    wires: CircuitPowerWire[]
    switchMode: CircuitSwitchMode
}

function hasWireBetween(
    wires: CircuitPowerWire[],
    firstPortId: string,
    secondPortId: string,
) {
    return wires.some((wire) => {
        const forward =
            wire.fromPortId === firstPortId && wire.toPortId === secondPortId

        const reverse =
            wire.fromPortId === secondPortId && wire.toPortId === firstPortId

        return forward || reverse
    })
}

function hasAnyWireBetweenGroups(
    wires: CircuitPowerWire[],
    firstPortIds: string[],
    secondPortIds: string[],
) {
    return firstPortIds.some((firstPortId) => {
        return secondPortIds.some((secondPortId) => {
            return hasWireBetween(wires, firstPortId, secondPortId)
        })
    })
}

function arePortsConnected(
    wires: CircuitPowerWire[],
    startPortId: string,
    targetPortId: string,
    internalEdges: Array<[string, string]>,
) {
    const graph = new Map<string, Set<string>>()

    const addEdge = (firstPortId: string, secondPortId: string) => {
        if (!graph.has(firstPortId)) graph.set(firstPortId, new Set())
        if (!graph.has(secondPortId)) graph.set(secondPortId, new Set())

        graph.get(firstPortId)?.add(secondPortId)
        graph.get(secondPortId)?.add(firstPortId)
    }

    wires.forEach((wire) => {
        addEdge(wire.fromPortId, wire.toPortId)
    })

    internalEdges.forEach(([firstPortId, secondPortId]) => {
        addEdge(firstPortId, secondPortId)
    })

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

export function checkCircuitPower({
    wires,
    switchMode,
}: CheckCircuitPowerInput): CircuitPowerState {
    const batteryPorts = ["battery:plus", "battery:minus"]
    const switchPorts = ["switch-1:in", "switch-1:out"]
    const bulbPorts = ["bulb:a", "bulb:b"]

    const hasBatteryToSwitch = hasAnyWireBetweenGroups(
        wires,
        batteryPorts,
        switchPorts,
    )

    const hasSwitchToBulb = hasAnyWireBetweenGroups(
        wires,
        switchPorts,
        bulbPorts,
    )

    const hasBulbToBattery = hasAnyWireBetweenGroups(
        wires,
        bulbPorts,
        batteryPorts,
    )

    const completeInternalEdges: Array<[string, string]> = [
        ["switch-1:in", "switch-1:out"],
        ["bulb:a", "bulb:b"],
    ]

    const poweredInternalEdges =
        switchMode === "on"
            ? completeInternalEdges
            : ([["bulb:a", "bulb:b"]] as Array<[string, string]>)

    const isCircuitComplete = arePortsConnected(
        wires,
        "battery:plus",
        "battery:minus",
        completeInternalEdges,
    )

    const powered = arePortsConnected(
        wires,
        "battery:plus",
        "battery:minus",
        poweredInternalEdges,
    )

    return {
        hasBatteryToSwitch,
        hasSwitchToBulb,
        hasBulbToBattery,
        isCircuitComplete,
        powered: switchMode === "on" && powered,
    }
}
