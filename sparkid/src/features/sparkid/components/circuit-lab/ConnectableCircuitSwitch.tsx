"use client"

import { useState } from "react"
import CircuitSwitch, {
    type CircuitSwitchAnimation,
    type CircuitSwitchMode,
} from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import PluggerPort from "./PluggerPort"

type Vec3 = [number, number, number]

type ConnectableCircuitSwitchProps = {
    id?: string
    position?: Vec3
    scale?: number

    mode?: CircuitSwitchMode
    defaultMode?: CircuitSwitchMode
    animation?: CircuitSwitchAnimation

    showPorts?: boolean
    disabled?: boolean

    onModeChange?: (nextMode: CircuitSwitchMode) => void
}

export default function ConnectableCircuitSwitch({
                                                     id = "switch-1",
                                                     position = [0, 0, 0],
                                                     scale = 0.72,

                                                     mode,
                                                     defaultMode = "off",
                                                     animation = "idle",

                                                     showPorts = true,
                                                     disabled = false,

                                                     onModeChange,
                                                 }: ConnectableCircuitSwitchProps) {
    const [internalMode, setInternalMode] =
        useState<CircuitSwitchMode>(defaultMode)

    const currentMode = mode ?? internalMode
    const powered = currentMode === "on"

    const handleModeChange = (nextMode: CircuitSwitchMode) => {
        if (!mode) {
            setInternalMode(nextMode)
        }

        onModeChange?.(nextMode)
    }

    return (
        <CircuitSwitch
            position={position}
            scale={scale}
            mode={currentMode}
            animation={animation}
            interactive
            disabled={disabled}
            showConnectors={false}
            showScrews
            showLabels
            showGlow
            onModeChange={handleModeChange}
        >
            {/* Sol yan IN socket */}
            <PluggerPort
                id={`${id}:in`}
                ownerId={id}
                ownerKind="switch"
                kind="socket"
                position={[-0.96, 0.32, 0.22]}
                label="IN"
                ringColor="#2563EB"
                powered={powered}
                visible={showPorts}
                scale={0.44}
                portType="socket"
                orientation="left"
            />

            {/* Sağ yan OUT socket */}
            <PluggerPort
                id={`${id}:out`}
                ownerId={id}
                ownerKind="switch"
                kind="socket"
                position={[0.96, 0.32, 0.22]}
                label="OUT"
                ringColor="#2563EB"
                powered={powered}
                visible={showPorts}
                scale={0.44}
                portType="socket"
                orientation="right"
            />
        </CircuitSwitch>
    )
}