"use client"



import TestBatteryCharacterModel from "@/features/sparkid/components/dev-tools/TestBatteryCharacterModel";
import {TestBatteryAnimation} from "@/features/sparkid/components/dev-tools/TestBatteryTypes";
import PluggerPort from "@/features/sparkid/components/circuit-lab/PluggerPort";

type Vec3 = [number, number, number]

type TestConnectableBatteryProps = {
    id?: string
    position?: Vec3
    scale?: number
    animation?: TestBatteryAnimation
    showPorts?: boolean
}

export function TestConnectableBattery({
                                           id = "battery",
                                           position = [0, 0, 0],
                                           scale = 0.72,
                                           animation = "idle",
                                           showPorts = true,
                                       }: TestConnectableBatteryProps) {
    const powered = animation === "active"

    return (
        <group position={position} scale={scale}>
            <TestBatteryCharacterModel
                animation={animation}
                position={[0, 0, 0]}
                scale={1}
                showEmoteBubble={false}
                showSigns
                showCheeks
                loop
            >
                {showPorts && (
                    <>
                        <PluggerPort
                            id={`${id}:plus`}
                            ownerId={id}
                            ownerKind="battery"
                            kind="socket"
                            position={[0.48, 0.86, 0.84]}
                            label="+"
                            ringColor="#f97316"
                            powered={powered}
                            visible
                            scale={0.52}
                            portType="socket"
                        />

                        <PluggerPort
                            id={`${id}:minus`}
                            ownerId={id}
                            ownerKind="battery"
                            kind="socket"
                            position={[0.48, -1.22, 0.84]}
                            label="-"
                            ringColor="#2563EB"
                            powered={powered}
                            visible
                            scale={0.52}
                            portType="socket"
                        />
                    </>
                )}
            </TestBatteryCharacterModel>
        </group>
    )
}

export default TestConnectableBattery