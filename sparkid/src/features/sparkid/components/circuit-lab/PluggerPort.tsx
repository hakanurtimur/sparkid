"use client"

import CircuitPort from "./CircuitPort"
import SparkidPlugger, {
    type PluggerOrientation,
    type PluggerPortType,
    type PluggerStatus,
} from "./SparkidPlugger"
import {
    useCircuitConnections,
    type CircuitOwnerKind,
    type CircuitPortKind,
} from "./CircuitConnectionContext"
import { useCableConnectionMode } from "./CableConnectionModeContext"

type Vec3 = [number, number, number]

type PluggerPortProps = {
    id: string
    ownerId: string
    ownerKind: CircuitOwnerKind
    kind?: CircuitPortKind

    position: Vec3
    label: string

    ringColor?: string
    powered?: boolean
    visible?: boolean
    scale?: number

    portType?: PluggerPortType
    orientation?: PluggerOrientation

    /**
     * Performance için default false.
     * Port başına energy glow/light istemiyoruz.
     */
    allowEnergyStatus?: boolean
}

function getStatus({
                       connected,
                       powered,
                       pending,
                   }: {
    connected: boolean
    powered: boolean
    pending: boolean
}): PluggerStatus {
    if (pending) return "warning"
    if (powered) return "energy"
    if (connected) return "connected"

    return "idle"
}

function getOrientationNormal(orientation: PluggerOrientation): Vec3 {
    if (orientation === "front") return [0, 0, 1]
    if (orientation === "back") return [0, 0, -1]
    if (orientation === "right") return [1, 0, 0]
    if (orientation === "left") return [-1, 0, 0]
    if (orientation === "up") return [0, 1, 0]
    if (orientation === "down") return [0, -1, 0]

    return [0, 0, 1]
}

export default function PluggerPort({
                                        id,
                                        ownerId,
                                        ownerKind,
                                        kind,

                                        position,
                                        label,

                                        ringColor = "#2563EB",
                                        powered = false,
                                        visible = true,
                                        scale = 1,

                                        portType = "socket",
                                        orientation = "front",
                                        allowEnergyStatus = false,
                                    }: PluggerPortProps) {
    const { version, getConnectedPortId } = useCircuitConnections()
    const cableMode = useCableConnectionMode()

    void version

    const isCableMode = cableMode.enabled
    const isSelectable = cableMode.isPortSelectable(id)
    const connected = Boolean(getConnectedPortId(id))
    const pending = cableMode.isPendingPort(id)
    const disabledByGuide = isCableMode && !isSelectable && !connected
    const guideActive = isCableMode && isSelectable && !pending && !connected

    const status = getStatus({
        connected,
        pending,
        powered: allowEnergyStatus && powered,
    })
    const visualStatus: PluggerStatus = disabledByGuide ? "disabled" : status

    const resolvedKind: CircuitPortKind = kind ?? portType
    const normal = getOrientationNormal(orientation)
    const interactive = visible && isCableMode && isSelectable
    const basePlugScale = 0.36
    const cableModeScaleMultiplier = 1.35
    const visualScale =
        scale
        * basePlugScale
        * (isCableMode && isSelectable ? cableModeScaleMultiplier : 1)
    const resolvedCableColor = pending
        ? "#FFB020"
        : guideActive
          ? "#35E5F2"
          : disabledByGuide
            ? "#6B7280"
          : ringColor

    return (
        <group position={position}>
            <CircuitPort
                id={id}
                ownerId={ownerId}
                ownerKind={ownerKind}
                kind={resolvedKind}
                position={[0, 0, 0]}
                normal={normal}
                visible={false}
            />

            {visible && (
                <SparkidPlugger
                    position={[0, 0, 0]}
                    scale={visualScale}
                    portType={portType}
                    status={visualStatus}
                    orientation={orientation}
                    cableColor={resolvedCableColor}
                    energyColor="#FFD84D"
                    interactive={interactive}
                    disabled={disabledByGuide}
                    showLabel
                    showLeds
                    showScrews
                    showGuideDots
                    showGlow
                    label={label}
                    onClick={() => {
                        if (!isCableMode) return
                        cableMode.selectPort(id)
                    }}
                />
            )}
        </group>
    )
}
