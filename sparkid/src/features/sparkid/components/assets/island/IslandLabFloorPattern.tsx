"use client"

export type LabFloorPatternTheme =
    | "power"
    | "switch"
    | "fault"
    | "series"
    | "parallel"
    | "free"

type Vec3 = [number, number, number]

type ThemeColors = {
    base: string
    tileA: string
    tileB: string
    metal: string
    line: string
    accent: string
    emissive: string
}

const THEMES: Record<LabFloorPatternTheme, ThemeColors> = {
    power: {
        base: "#173d74",
        tileA: "#4d5c67",
        tileB: "#5d5852",
        metal: "#45484d",
        line: "#00aaff",
        accent: "#ffaa00",
        emissive: "#00aaff",
    },
    switch: {
        base: "#263746",
        tileA: "#4d565f",
        tileB: "#3f4850",
        metal: "#47494e",
        line: "#57dfff",
        accent: "#ef4444",
        emissive: "#00bfff",
    },
    fault: {
        base: "#2f2a2a",
        tileA: "#3a3433",
        tileB: "#4a3f3b",
        metal: "#47464a",
        line: "#ff2400",
        accent: "#ff7043",
        emissive: "#ff2400",
    },
    series: {
        base: "#3f3849",
        tileA: "#5b5362",
        tileB: "#4f4758",
        metal: "#434654",
        line: "#8b35ff",
        accent: "#ffd36b",
        emissive: "#8b35ff",
    },
    parallel: {
        base: "#263f38",
        tileA: "#40584b",
        tileB: "#35483f",
        metal: "#3f4c48",
        line: "#00e676",
        accent: "#5cffb2",
        emissive: "#00e676",
    },
    free: {
        base: "#46525a",
        tileA: "#5d6468",
        tileB: "#4d565f",
        metal: "#434d56",
        line: "#00e5ff",
        accent: "#ffffff",
        emissive: "#00e5ff",
    },
}

function MiniMetalPlate({
    position,
    color,
    line,
    emissive,
}: {
    position: Vec3
    color: string
    line: string
    emissive: string
}) {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.34, 0.055, 0.3]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.28}
                    roughness={0.5}
                />
            </mesh>

            <mesh position={[0, 0.04, 0]}>
                <boxGeometry args={[0.2, 0.014, 0.035]} />
                <meshStandardMaterial
                    color={line}
                    emissive={emissive}
                    emissiveIntensity={1.35}
                    roughness={0.32}
                />
            </mesh>
        </group>
    )
}

function StoneTile({
    position,
    rotation = 0,
    color,
}: {
    position: Vec3
    rotation?: number
    color: string
}) {
    return (
        <mesh
            position={position}
            rotation={[0, rotation, 0]}
            scale={[0.34, 0.045, 0.3]}
            castShadow
            receiveShadow
        >
            <cylinderGeometry args={[0.5, 0.56, 1, 6]} />
            <meshStandardMaterial color={color} roughness={0.96} flatShading />
        </mesh>
    )
}

function GlowLine({
    position,
    rotation = 0,
    width = 0.5,
    color,
}: {
    position: Vec3
    rotation?: number
    width?: number
    color: string
    emissive: string
}) {
    return (
        <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]}>
            <planeGeometry args={[width, 0.045]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.78}
                depthWrite={false}
            />
        </mesh>
    )
}

function GlowDot({
    position,
    color,
    emissive,
    radius = 0.045,
}: {
    position: Vec3
    color: string
    emissive: string
    radius?: number
}) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[radius, 14, 10]} />
            <meshStandardMaterial
                color={color}
                emissive={emissive}
                emissiveIntensity={1.8}
                roughness={0.24}
            />
        </mesh>
    )
}

function PatternDetails({
    theme,
    colors,
}: {
    theme: LabFloorPatternTheme
    colors: ThemeColors
}) {
    if (theme === "fault") {
        return (
            <>
                <GlowLine
                    position={[-0.2, 0.078, -0.08]}
                    rotation={-0.35}
                    width={0.46}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0.16, 0.08, 0.12]}
                    rotation={0.25}
                    width={0.52}
                    color={colors.accent}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0.02, 0.082, 0.28]}
                    rotation={-0.12}
                    width={0.32}
                    color={colors.line}
                    emissive={colors.emissive}
                />
            </>
        )
    }

    if (theme === "series") {
        return (
            <>
                <GlowLine
                    position={[0, 0.078, 0]}
                    width={0.78}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowDot position={[-0.28, 0.13, 0]} color={colors.accent} emissive={colors.accent} />
                <GlowDot position={[0, 0.13, 0]} color={colors.accent} emissive={colors.accent} />
                <GlowDot position={[0.28, 0.13, 0]} color={colors.accent} emissive={colors.accent} />
            </>
        )
    }

    if (theme === "parallel") {
        return (
            <>
                <GlowLine
                    position={[0, 0.078, -0.18]}
                    width={0.78}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0, 0.078, 0]}
                    width={0.78}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0, 0.078, 0.18]}
                    width={0.78}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowDot position={[-0.42, 0.13, 0]} color={colors.accent} emissive={colors.emissive} />
                <GlowDot position={[0.42, 0.13, 0]} color={colors.accent} emissive={colors.emissive} />
            </>
        )
    }

    if (theme === "switch") {
        return (
            <>
                <GlowLine
                    position={[0, 0.078, -0.1]}
                    width={0.68}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0.06, 0.08, 0.1]}
                    rotation={-0.5}
                    width={0.5}
                    color={colors.accent}
                    emissive={colors.accent}
                />
                <GlowDot position={[0.28, 0.13, 0.25]} color={colors.accent} emissive={colors.accent} />
            </>
        )
    }

    if (theme === "free") {
        return (
            <>
                <GlowLine
                    position={[0, 0.078, 0]}
                    width={0.7}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowLine
                    position={[0, 0.079, 0]}
                    rotation={Math.PI / 2}
                    width={0.7}
                    color={colors.line}
                    emissive={colors.emissive}
                />
                <GlowDot position={[0, 0.13, 0]} color={colors.accent} emissive={colors.emissive} />
            </>
        )
    }

    return (
        <>
            <GlowLine
                position={[-0.05, 0.078, 0.02]}
                rotation={-0.55}
                width={0.52}
                color={colors.accent}
                emissive={colors.accent}
            />
            <GlowLine
                position={[0.1, 0.08, -0.08]}
                rotation={0.52}
                width={0.42}
                color={colors.line}
                emissive={colors.emissive}
            />
            <GlowDot position={[0.24, 0.13, 0.2]} color={colors.accent} emissive={colors.accent} />
        </>
    )
}

export function IslandLabFloorPattern({
    theme,
}: {
    theme: LabFloorPatternTheme
}) {
    const colors = THEMES[theme]
    const isMetalTheme = theme === "power" || theme === "switch" || theme === "free"

    return (
        <group>
            <mesh position={[0, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.92, 0.98, 0.045, 40]} />
                <meshStandardMaterial
                    color={colors.base}
                    roughness={0.7}
                    metalness={0.12}
                />
            </mesh>

            <group name="LAB_FLOOR_MINI_PATTERN">
                {[-0.36, 0, 0.36].map((x, xi) =>
                    [-0.32, 0, 0.32].map((z, zi) => {
                        const key = `${x}-${z}`

                        if (isMetalTheme) {
                            return (
                                <MiniMetalPlate
                                    key={key}
                                    position={[x, 0.045, z]}
                                    color={colors.metal}
                                    line={colors.line}
                                    emissive={colors.emissive}
                                />
                            )
                        }

                        return (
                            <StoneTile
                                key={key}
                                position={[x, 0.045, z]}
                                rotation={(xi + zi) * 0.42}
                                color={(xi + zi) % 2 === 0 ? colors.tileA : colors.tileB}
                            />
                        )
                    }),
                )}
            </group>

            <mesh position={[0, 0.076, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.76, 0.018, 8, 56]} />
                <meshStandardMaterial
                    color={colors.line}
                    emissive={colors.emissive}
                    emissiveIntensity={1.45}
                    roughness={0.32}
                />
            </mesh>

            <PatternDetails theme={theme} colors={colors} />
        </group>
    )
}
