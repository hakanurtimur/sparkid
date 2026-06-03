"use client"

import { Environment, Sparkles, Stars } from "@react-three/drei"

type IslandEnvironmentProps = {
    accent?: string
    showBackground?: boolean
    effects?: boolean
}

export function IslandEnvironment({
    accent = "#8ef7ff",
    showBackground = true,
    effects = true,
}: IslandEnvironmentProps) {
    return (
        <>
            {showBackground && <color attach="background" args={["#07111f"]} />}
            <fog attach="fog" args={["#07111f", 12, 30]} />

            <hemisphereLight args={["#bcd7ff", "#111827", 0.9]} />

            <directionalLight
                castShadow
                position={[5, 8, 6]}
                intensity={2.35}
                color="#fff1d0"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={1}
                shadow-camera-far={28}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
            />

            <directionalLight
                position={[-5, 4, -4]}
                intensity={1.15}
                color={accent}
            />

            <pointLight
                position={[0, -2.5, 4]}
                color={accent}
                intensity={0.65}
                distance={12}
            />

            {effects && (
                <Environment
                    preset="city"
                    background={false}
                    environmentIntensity={0.28}
                />
            )}

            {effects && (
                <Stars
                    radius={80}
                    depth={35}
                    count={900}
                    factor={2.5}
                    saturation={0}
                    fade
                    speed={0.15}
                />
            )}

            {effects && (
                <Sparkles
                    count={26}
                    scale={[8, 4, 8]}
                    size={1.4}
                    speed={0.18}
                    color={accent}
                    opacity={0.28}
                />
            )}
        </>
    )
}
