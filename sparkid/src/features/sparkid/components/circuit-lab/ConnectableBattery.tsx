"use client"

import BatteryGlbCharacter from "@/features/sparkid/components/assets/circuit-elements/battery/BatteryGlbCharacter"
import type { TestBatteryAnimation } from "@/features/sparkid/components/assets/circuit-elements/battery/TestBatteryGlbConfig"

import PluggerPort from "./PluggerPort"

type Vec3 = [number, number, number]

type ConnectableBatteryProps = {
    id?: string
    position?: Vec3
    scale?: number
    animation?: TestBatteryAnimation
    showPorts?: boolean
}

export function ConnectableBattery({
                                       id = "battery",
                                       position = [0, 0, 0],
                                       scale = 0.72,
                                       animation = "idle",
                                       showPorts = true,
                                   }: ConnectableBatteryProps) {
    const powered = animation === "active"

    return (
        <BatteryGlbCharacter
            animation={animation}
            position={position}
            scale={scale}
            showEmoteBubble={false}
            showSigns
            showCheeks
        >
            <PluggerPort
                id={`${id}:plus`}
                ownerId={id}
                ownerKind="battery"
                kind="socket"
                position={[0.72, 0.62, 0.28]}
                label="+"
                ringColor="#f97316"
                powered={powered}
                visible={showPorts}
                scale={0.46}
                portType="socket"
                orientation="right"
            />

            <PluggerPort
                id={`${id}:minus`}
                ownerId={id}
                ownerKind="battery"
                kind="socket"
                position={[0.72, -1.08, 0.28]}
                label="-"
                ringColor="#2563EB"
                powered={powered}
                visible={showPorts}
                scale={0.46}
                portType="socket"
                orientation="right"
            />
        </BatteryGlbCharacter>
    )
}

export default ConnectableBattery