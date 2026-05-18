type StageLightingProps = {
    energetic?: boolean
    shadows?: boolean
    shadowMapSize?: number
}

export default function StageLighting({
                                          energetic = false,
                                          shadows = true,
                                          shadowMapSize = 1024,
                                      }: StageLightingProps) {
    return (
        <>
            {/* Genel yumuşak aydınlatma */}
            <ambientLight intensity={1.15} />

            <hemisphereLight
                args={["#ffffff", "#ffdca8", 1.45]}
            />

            {/* Ana ön ışık - karakterin yüzünü açar */}
            <directionalLight
                castShadow={shadows}
                position={[0, 3.6, 5.5]}
                intensity={2.35}
                color="#fff8ec"
                shadow-mapSize-width={shadowMapSize}
                shadow-mapSize-height={shadowMapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={12}
                shadow-camera-left={-4}
                shadow-camera-right={4}
                shadow-camera-top={4}
                shadow-camera-bottom={-4}
            />

            {/* Sol dolgu ışığı - gölgeleri yumuşatır */}
            <pointLight
                position={[-3.2, 1.6, 3.4]}
                intensity={1.35}
                distance={8}
                color="#dff4ff"
            />

            {/* Sağ sıcak dolgu */}
            <pointLight
                position={[3.2, 1.2, 2.8]}
                intensity={0.9}
                distance={7}
                color="#fff0cf"
            />

            {/* Arkadan rim light - karakteri fondan ayırır */}
            <directionalLight
                position={[-2.8, 2.4, -3.2]}
                intensity={1.15}
                color="#7dd3fc"
            />

            {/* Battery active modda cyan glow daha tatlı patlasın */}
            {energetic && (
                <pointLight
                    position={[0, 0.35, 2.1]}
                    intensity={1.8}
                    distance={4.2}
                    color="#00e5ff"
                />
            )}
        </>
    )
}
