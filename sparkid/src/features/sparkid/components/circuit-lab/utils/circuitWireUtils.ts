import type { CircuitPortPair } from "../types"

export type CircuitWireLike = {
    fromPortId: string
    toPortId: string
}

export function hasWireBetween(
    wires: CircuitWireLike[],
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

export function hasWireForPortPair(
    wires: CircuitWireLike[],
    pair: CircuitPortPair,
) {
    return hasWireBetween(wires, pair.fromPortId, pair.toPortId)
}

export function hasAllPortPairWires(
    wires: CircuitWireLike[],
    pairs: CircuitPortPair[],
) {
    return pairs.every((pair) => hasWireForPortPair(wires, pair))
}
