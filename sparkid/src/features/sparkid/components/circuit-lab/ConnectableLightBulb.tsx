import PluggerPort from "./PluggerPort"
import LightBulbGlb, {
    type LightBulbMood,
} from "@/features/sparkid/components/assets/circuit-elements/LightBulbGlb"

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
    const mood: LightBulbMood = powered ? "happy" : "off"

    return (
        <group position={position} scale={scale}>
            <LightBulbGlb
                mood={mood}
                position={[0, 0, 0]}
                scale={1}
                animated={powered}
                showGlow={powered}
                useRealLight={false}
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
