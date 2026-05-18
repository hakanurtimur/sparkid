"use client"

import * as THREE from "three"
import { Line } from "@react-three/drei"
import { useMemo } from "react"

import { useCableConnectionMode } from "./CableConnectionModeContext"
import { useCircuitConnections } from "./CircuitConnectionContext"

type AutoCableLayerProps = {
    active?: boolean
}

type AutoCableWireProps = {
    fromPortId: string
    toPortId: string
    active?: boolean
    color?: string
    activeColor?: string
    lineWidth?: number
}

function getCablePoints(from: THREE.Vector3, to: THREE.Vector3) {
    const distance = from.distanceTo(to)

    const lift = Math.min(Math.max(distance * 0.18, 0.08), 0.26)

    const mid = from.clone().lerp(to, 0.5)
    mid.y += lift

    const curve = new THREE.QuadraticBezierCurve3(from, mid, to)

    return curve.getPoints(18)
}

function AutoCableWire({
                           fromPortId,
                           toPortId,
                           active = false,
                           color = "#2563EB",
                           activeColor = "#FFD84D",
                           lineWidth = 5,
                       }: AutoCableWireProps) {
    const { version, getPort } = useCircuitConnections()

    const points = useMemo(() => {
        void version

        const fromPort = getPort(fromPortId)
        const toPort = getPort(toPortId)

        if (!fromPort || !toPort) return null

        const from = fromPort.worldPosition.clone()
        const to = toPort.worldPosition.clone()

        return getCablePoints(from, to)
    }, [fromPortId, getPort, toPortId, version])

    if (!points) return null

    return (
        <Line
            points={points}
            color={active ? activeColor : color}
            lineWidth={lineWidth}
            transparent
            opacity={active ? 1 : 0.92}
            depthWrite={false}
            toneMapped={false}
        />
    )
}

export default function AutoCableLayer({ active = false }: AutoCableLayerProps) {
    const { wires } = useCableConnectionMode()

    return (
        <group name="SparkidAutoCableLayer" renderOrder={20}>
            {wires.map((wire, index) => (
                <AutoCableWire
                    key={wire.id}
                    fromPortId={wire.fromPortId}
                    toPortId={wire.toPortId}
                    active={active}
                    color={
                        index === 0
                            ? "#2563EB"
                            : index === 1
                                ? "#0ea5e9"
                                : "#38bdf8"
                    }
                    activeColor="#FFD84D"
                    lineWidth={active ? 6 : 5}
                />
            ))}
        </group>
    )
}
