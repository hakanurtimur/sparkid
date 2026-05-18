"use client"

import type {
    TestLightBulbAnimation,
    TestLightBulbMood,
} from "@/features/sparkid/components/assets/circuit-elements/light-bulb/TestLightBulbGlbConfig"

import PluggerPort from "./PluggerPort"
import LightBulbCharacter from "@/features/sparkid/components/assets/circuit-elements/LightBulbCharacter";

type Vec3 = [number, number, number]

type ConnectableLightBulbProps = {
    id?: string
    position?: Vec3
    scale?: number
    powered?: boolean
    showPorts?: boolean
}

export function ConnectableLightBulb({
                                         id = "bulb",
                                         position = [0, 0, 0],
                                         scale = 0.72,
                                         powered = false,
                                         showPorts = true,
                                     }: ConnectableLightBulbProps) {
    const mood: TestLightBulbMood = powered ? "happy" : "off"
    const animation: TestLightBulbAnimation = powered ? "excited" : "hover"

    return (
        <group position={position} scale={scale}>
            <LightBulbCharacter
                mood={mood}
                animation={animation}
                position={[0, 0, 0]}
                scale={1}

            />

            <PluggerPort
                id={`${id}:a`}
                ownerId={id}
                ownerKind="lightBulb"
                kind="socket"
                position={[-0.78, -0.88, 0.22]}
                label="A"
                ringColor="#f97316"
                powered={powered}
                visible={showPorts}
                scale={0.42}
                portType="socket"
                orientation="left"
            />

            <PluggerPort
                id={`${id}:b`}
                ownerId={id}
                ownerKind="lightBulb"
                kind="socket"
                position={[0.78, -0.88, 0.22]}
                label="B"
                ringColor="#2563EB"
                powered={powered}
                visible={showPorts}
                scale={0.42}
                portType="socket"
                orientation="right"
            />
        </group>
    )
}

export default ConnectableLightBulb
