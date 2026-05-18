"use client"

import * as THREE from "three"
import { RoundedBox, Text } from "@react-three/drei"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import {
    FreePlayIcon,
    ParallelCircuitIcon,
    SeriesCircuitIcon,
    WarningIcon,
} from "./SparkidModeIcons"

type Vec3 = [number, number, number]

export type SparkidBlockKind =
    | "battery"
    | "bulb"
    | "switch"
    | "cable"
    | "energy"
    | "turn"
    | "reset"
    | "question"
    | "warning"
    | "series-circuit"
    | "parallel-circuit"
    | "free-play"

export type SparkidBlockButtonState =
    | "idle"
    | "hover"
    | "pressed"
    | "selected"
    | "disabled"

type SparkidBlockButtonTheme = {
    title: string
    subtitle: string
    icon: string
    color: string
    darkColor: string
    glowColor: string
    textColor: string
}

export type SparkidBlockButtonProps = {
    position?: Vec3
    scale?: number

    selected?: boolean
    disabled?: boolean
    interactive?: boolean

    showLabel?: boolean
    showConnectors?: boolean
    showIndicators?: boolean

    onPress?: (kind: SparkidBlockKind) => void
    onClick?: (kind: SparkidBlockKind) => void
    onHoverChange?: (kind: SparkidBlockKind, hovered: boolean) => void
}

const BLOCK_THEMES: Record<SparkidBlockKind, SparkidBlockButtonTheme> = {
    battery: {
        title: "PİL",
        subtitle: "Enerji",
        icon: "▣",
        color: "#2563eb",
        darkColor: "#123f9b",
        glowColor: "#38bdf8",
        textColor: "#ffffff",
    },
    bulb: {
        title: "AMPUL",
        subtitle: "Işık",
        icon: "☼",
        color: "#14b8a6",
        darkColor: "#087b72",
        glowColor: "#fef08a",
        textColor: "#ffffff",
    },
    switch: {
        title: "ANAHTAR",
        subtitle: "Aç/Kapat",
        icon: "⌁",
        color: "#8b5cf6",
        darkColor: "#5b21b6",
        glowColor: "#c084fc",
        textColor: "#ffffff",
    },
    cable: {
        title: "KABLO",
        subtitle: "Bağlantı",
        icon: "∿",
        color: "#06b6d4",
        darkColor: "#08718b",
        glowColor: "#67e8f9",
        textColor: "#ffffff",
    },
    energy: {
        title: "ENERJİ",
        subtitle: "Akış",
        icon: "⚡",
        color: "#fbbf24",
        darkColor: "#b77904",
        glowColor: "#fde047",
        textColor: "#ffffff",
    },
    turn: {
        title: "DÖNÜŞ",
        subtitle: "90°",
        icon: "↪",
        color: "#06b6d4",
        darkColor: "#08718b",
        glowColor: "#67e8f9",
        textColor: "#ffffff",
    },
    reset: {
        title: "SIFIRLA",
        subtitle: "Baştan",
        icon: "↺",
        color: "#475569",
        darkColor: "#1e293b",
        glowColor: "#cbd5e1",
        textColor: "#ffffff",
    },
    question: {
        title: "SORU",
        subtitle: "İpucu",
        icon: "?",
        color: "#f97316",
        darkColor: "#b63d08",
        glowColor: "#fb923c",
        textColor: "#ffffff",
    },
    warning: {
        title: "UYARI",
        subtitle: "Kontrol",
        icon: "!",
        color: "#FFB72C",
        darkColor: "#B45309",
        glowColor: "#FFD84A",
        textColor: "#ffffff",
    },
    "series-circuit": {
        title: "SERİ",
        subtitle: "Devre",
        icon: "S",
        color: "#35E5F2",
        darkColor: "#13BBD1",
        glowColor: "#67E8F9",
        textColor: "#ffffff",
    },
    "parallel-circuit": {
        title: "PARALEL",
        subtitle: "Devre",
        icon: "P",
        color: "#8B5CFF",
        darkColor: "#6336E8",
        glowColor: "#C4B5FD",
        textColor: "#ffffff",
    },
    "free-play": {
        title: "ÖZGÜR",
        subtitle: "Alan",
        icon: "*",
        color: "#45E39A",
        darkColor: "#15803D",
        glowColor: "#86EFAC",
        textColor: "#ffffff",
    },
}

function lerp(current: number, target: number, speed: number) {
    return THREE.MathUtils.lerp(current, target, speed)
}

function setCursor(cursor: string) {
    if (typeof document === "undefined") return
    document.body.style.cursor = cursor
}

function BlockConnector({
                            side,
                        }: {
    side: -1 | 1
}) {
    return (
        <group position={[side * 0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.115, 0.115, 0.16, 36]} />
                <meshStandardMaterial
                    color="#d4af37"
                    roughness={0.22}
                    metalness={0.72}
                />
            </mesh>

            <mesh position={[0, side * 0.07, 0]}>
                <cylinderGeometry args={[0.072, 0.072, 0.035, 32]} />
                <meshStandardMaterial
                    color="#6f4b0b"
                    roughness={0.32}
                    metalness={0.38}
                />
            </mesh>
        </group>
    )
}

function BlockScrew({
                        position,
                    }: {
    position: Vec3
}) {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.012, 18]} />
                <meshStandardMaterial
                    color="#d4af37"
                    roughness={0.3}
                    metalness={0.7}
                />
            </mesh>
        </group>
    )
}

function IndicatorLights({
                             active,
                             color,
                         }: {
    active: boolean
    color: string
}) {
    return (
        <group position={[0, -0.405, 0.305]}>
            <RoundedBox args={[0.28, 0.07, 0.035]} radius={0.025} smoothness={6}>
                <meshStandardMaterial
                    color="#101820"
                    roughness={0.4}
                    metalness={0.15}
                />
            </RoundedBox>

            {[-0.08, 0, 0.08].map((x, index) => (
                <mesh key={index} position={[x, 0.004, 0.025]} scale={[0.018, 0.018, 0.018]}>
                    <sphereGeometry args={[1, 12, 8]} />
                    <meshStandardMaterial
                        color={active ? color : "#374151"}
                        emissive={active ? color : "#000000"}
                        emissiveIntensity={active ? 1.7 : 0}
                        roughness={0.2}
                        metalness={0}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    )
}

function IconMaterial({ opacity = 1 }: { opacity?: number }) {
    return (
        <meshBasicMaterial
            color="#ffffff"
            transparent={opacity < 1}
            opacity={opacity}
            toneMapped={false}
        />
    )
}

function BatteryIcon() {
    return (
        <group position={[0, 0.035, 0.37]}>
            <mesh position={[0, 0.15, 0]}>
                <boxGeometry args={[0.2, 0.028, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0, -0.15, 0]}>
                <boxGeometry args={[0.2, 0.028, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[-0.1, 0, 0]}>
                <boxGeometry args={[0.028, 0.3, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0.1, 0, 0]}>
                <boxGeometry args={[0.028, 0.3, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0, 0.19, 0]}>
                <boxGeometry args={[0.08, 0.04, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0.035, 0, 0.012]}>
                <boxGeometry args={[0.025, 0.17, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[-0.035, 0, 0.012]}>
                <boxGeometry args={[0.025, 0.17, 0.026]} />
                <IconMaterial />
            </mesh>
        </group>
    )
}

function BulbIcon() {
    return (
        <group position={[0, 0.035, 0.37]}>
            <mesh position={[0, 0.065, 0]} scale={[1, 1, 0.08]}>
                <torusGeometry args={[0.12, 0.026, 12, 40]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0, -0.065, 0]}>
                <boxGeometry args={[0.09, 0.09, 0.026]} />
                <IconMaterial />
            </mesh>

            {[-0.033, 0, 0.033].map((y) => (
                <mesh key={y} position={[0, -0.09 + y, 0.014]}>
                    <boxGeometry args={[0.13, 0.018, 0.024]} />
                    <IconMaterial />
                </mesh>
            ))}
        </group>
    )
}

function SwitchIcon() {
    return (
        <group position={[0, 0.035, 0.37]}>
            <mesh position={[0, -0.12, 0]}>
                <boxGeometry args={[0.28, 0.04, 0.026]} />
                <IconMaterial />
            </mesh>

            <mesh position={[-0.055, -0.035, 0]} rotation={[0, 0, -0.8]}>
                <cylinderGeometry args={[0.024, 0.024, 0.24, 18]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0.06, 0.06, 0]} scale={[0.045, 0.045, 0.02]}>
                <sphereGeometry args={[1, 16, 8]} />
                <IconMaterial />
            </mesh>

            <mesh position={[-0.105, -0.105, 0]} scale={[0.032, 0.032, 0.018]}>
                <sphereGeometry args={[1, 16, 8]} />
                <IconMaterial />
            </mesh>
        </group>
    )
}

function CableIcon() {
    return (
        <group position={[0, 0.035, 0.37]}>
            <mesh position={[-0.11, 0.075, 0]} rotation={[0, 0, -Math.PI / 2]}>
                <torusGeometry args={[0.11, 0.026, 12, 40, Math.PI]} />
                <IconMaterial />
            </mesh>

            <mesh position={[0.11, -0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.11, 0.026, 12, 40, Math.PI]} />
                <IconMaterial />
            </mesh>
        </group>
    )
}

function TextIcon({
                      icon,
                      fontSize = 0.28,
                  }: {
    icon: string
    fontSize?: number
}) {
    const offsets: Vec3[] = [
        [0, 0.025, 0.38],
        [0.006, 0.025, 0.381],
        [-0.006, 0.025, 0.381],
        [0, 0.031, 0.381],
        [0, 0.019, 0.381],
    ]

    return (
        <group>
            {offsets.map((position, index) => (
                <Text
                    key={index}
                    position={position}
                    fontSize={fontSize}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={900}
                >
                    {icon}
                </Text>
            ))}
        </group>
    )
}

function SparkidBlockButtonBase({
                                    kind,
                                    position = [0, 0, 0],
                                    scale = 1,

                                    selected = false,
                                    disabled = false,
                                    interactive = true,

                                    showLabel = true,
                                    showConnectors = true,
                                    showIndicators = true,

                                    onPress,
                                    onClick,
                                    onHoverChange,
                                }: SparkidBlockButtonProps & {
    kind: SparkidBlockKind
}) {
    const theme = BLOCK_THEMES[kind]

    const rootRef = useRef<THREE.Group>(null)
    const bodyRef = useRef<THREE.Group>(null)
    const frontMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
    const pointLightRef = useRef<THREE.PointLight>(null)

    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const active = selected || hovered || pressed

    const glowColor = useMemo(() => new THREE.Color(theme.glowColor), [theme.glowColor])

    const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()
        setHovered(true)
        setCursor("pointer")
        onHoverChange?.(kind, true)
    }

    const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive) return

        event.stopPropagation()
        setHovered(false)
        setPressed(false)
        setCursor("auto")
        onHoverChange?.(kind, false)
    }

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()
        setPressed(true)
        onPress?.(kind)
    }

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()
        setPressed(false)
        onClick?.(kind)
    }

    useFrame((state) => {
        const body = bodyRef.current
        if (!body) return

        const t = state.clock.elapsedTime
        const pulse = (Math.sin(t * 4.8) + 1) / 2

        let targetY = 0
        let targetRotZ = Math.sin(t * 1.4) * 0.006
        let targetScaleX = 1
        let targetScaleY = 1
        let targetScaleZ = 1
        let glowOpacity = 0
        let lightIntensity = 0
        let emissiveIntensity = 0.12

        if (hovered && !disabled) {
            targetY += 0.035
            targetScaleX = 1.035
            targetScaleY = 1.035
            targetScaleZ = 1.035
            glowOpacity = 0.18
            lightIntensity = 0.45
            emissiveIntensity = 0.32
        }

        if (selected && !disabled) {
            targetY += 0.055
            targetScaleX = 1.055
            targetScaleY = 1.055
            targetScaleZ = 1.055
            glowOpacity = 0.28 + pulse * 0.12
            lightIntensity = 0.85 + pulse * 0.25
            emissiveIntensity = 0.55 + pulse * 0.2
        }

        if (pressed && !disabled) {
            targetY -= 0.035
            targetScaleX = 1.08
            targetScaleY = 0.92
            targetScaleZ = 1.08
            targetRotZ = Math.sin(t * 18) * 0.018
            glowOpacity = 0.38
            lightIntensity = 1.2
            emissiveIntensity = 0.8
        }

        if (disabled) {
            targetY -= 0.015
            targetScaleY = 0.96
            glowOpacity = 0
            lightIntensity = 0
            emissiveIntensity = 0
        }

        body.position.y = lerp(body.position.y, targetY, 0.16)
        body.rotation.z = lerp(body.rotation.z, targetRotZ, 0.12)

        body.scale.x = lerp(body.scale.x, targetScaleX, 0.16)
        body.scale.y = lerp(body.scale.y, targetScaleY, 0.16)
        body.scale.z = lerp(body.scale.z, targetScaleZ, 0.16)

        if (frontMaterialRef.current) {
            frontMaterialRef.current.emissive.lerp(glowColor, 0.08)
            frontMaterialRef.current.emissiveIntensity = lerp(
                frontMaterialRef.current.emissiveIntensity,
                emissiveIntensity,
                0.12
            )
        }

        if (glowMaterialRef.current) {
            glowMaterialRef.current.color.lerp(glowColor, 0.08)
            glowMaterialRef.current.opacity = lerp(
                glowMaterialRef.current.opacity,
                glowOpacity,
                0.12
            )
        }

        if (pointLightRef.current) {
            pointLightRef.current.color.lerp(glowColor, 0.08)
            pointLightRef.current.intensity = lerp(
                pointLightRef.current.intensity,
                lightIntensity,
                0.12
            )
        }
    })

    return (
        <group
            ref={rootRef}
            position={position}
            scale={[scale, scale, scale]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <group ref={bodyRef}>
                <pointLight
                    ref={pointLightRef}
                    position={[0, 0.15, 0.7]}
                    color={theme.glowColor}
                    intensity={0}
                    distance={1.6}
                />

                <RoundedBox
                    args={[1.05, 1.05, 0.34]}
                    radius={0.14}
                    smoothness={10}
                    position={[0, -0.005, -0.02]}
                >
                    <meshBasicMaterial
                        ref={glowMaterialRef}
                        color={theme.glowColor}
                        transparent
                        opacity={0}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        toneMapped={false}
                    />
                </RoundedBox>

                {showConnectors && (
                    <>
                        <BlockConnector side={-1} />
                        <BlockConnector side={1} />
                    </>
                )}

                <RoundedBox
                    args={[0.88, 0.88, 0.32]}
                    radius={0.13}
                    smoothness={12}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={disabled ? "#7b8491" : theme.color}
                        roughness={0.34}
                        metalness={0.12}
                    />
                </RoundedBox>

                <RoundedBox
                    args={[0.82, 0.82, 0.08]}
                    radius={0.11}
                    smoothness={10}
                    position={[0, 0, 0.16]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={disabled ? "#6b7280" : theme.darkColor}
                        roughness={0.38}
                        metalness={0.1}
                    />
                </RoundedBox>

                <RoundedBox
                    args={[0.66, 0.66, 0.055]}
                    radius={0.075}
                    smoothness={8}
                    position={[0, 0.03, 0.235]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        ref={frontMaterialRef}
                        color={disabled ? "#9ca3af" : theme.color}
                        emissive={theme.glowColor}
                        emissiveIntensity={0.12}
                        roughness={0.28}
                        metalness={0.08}
                    />
                </RoundedBox>

                <BlockScrew position={[-0.34, 0.34, 0.285]} />
                <BlockScrew position={[0.34, 0.34, 0.285]} />
                <BlockScrew position={[-0.34, -0.34, 0.285]} />
                <BlockScrew position={[0.34, -0.34, 0.285]} />

                {kind === "battery" && <BatteryIcon />}
                {kind === "bulb" && <BulbIcon />}
                {kind === "switch" && <SwitchIcon />}
                {kind === "cable" && <CableIcon />}
                {kind === "energy" && <TextIcon icon="⚡" fontSize={0.31} />}
                {kind === "turn" && <TextIcon icon="↪" fontSize={0.3} />}
                {kind === "reset" && <TextIcon icon="↺" fontSize={0.3} />}
                {kind === "question" && <TextIcon icon="?" fontSize={0.34} />}
                {kind === "warning" && <WarningIcon />}
                {kind === "series-circuit" && <SeriesCircuitIcon />}
                {kind === "parallel-circuit" && <ParallelCircuitIcon />}
                {kind === "free-play" && <FreePlayIcon />}

                {showIndicators && (
                    <IndicatorLights active={active && !disabled} color={theme.glowColor} />
                )}

                {showLabel && (
                    <>
                        <Text
                            position={[0, -0.68, 0.08]}
                            fontSize={0.105}
                            color={disabled ? "#9ca3af" : theme.textColor}
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.004}
                            outlineColor="#0f172a"
                        >
                            {theme.title}
                        </Text>

                        <Text
                            position={[0, -0.81, 0.08]}
                            fontSize={0.06}
                            color={disabled ? "#9ca3af" : "#dbeafe"}
                            anchorX="center"
                            anchorY="middle"
                        >
                            {theme.subtitle}
                        </Text>
                    </>
                )}

                <mesh position={[0, 0, 0.1]}>
                    <boxGeometry args={[1.28, 1.28, 0.65]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            </group>
        </group>
    )
}

export function BatteryBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="battery" {...props} />
}

export function BulbBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="bulb" {...props} />
}

export function SwitchBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="switch" {...props} />
}

export function CableBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="cable" {...props} />
}

export function EnergyBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="energy" {...props} />
}

export function TurnBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="turn" {...props} />
}

export function ResetBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="reset" {...props} />
}

export function QuestionBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="question" {...props} />
}

export function WarningBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="warning" {...props} />
}

export function SeriesCircuitBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="series-circuit" {...props} />
}

export function ParallelCircuitBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="parallel-circuit" {...props} />
}

export function FreePlayBlockButton(props: SparkidBlockButtonProps) {
    return <SparkidBlockButtonBase kind="free-play" {...props} />
}

export function SparkidBlockButton({
                                       kind,
                                       ...props
                                   }: SparkidBlockButtonProps & {
    kind: SparkidBlockKind
}) {
    return <SparkidBlockButtonBase kind={kind} {...props} />
}

export function SparkidBlockButtonKit({
                                          position = [0, 0, 0],
                                          scale = 1,
                                          selectedKind,
                                          onSelect,
                                      }: {
    position?: Vec3
    scale?: number
    selectedKind?: SparkidBlockKind
    onSelect?: (kind: SparkidBlockKind) => void
}) {
    return (
        <group position={position} scale={[scale, scale, scale]}>
            <BatteryBlockButton
                position={[-2.05, 0, 0]}
                selected={selectedKind === "battery"}
                onClick={onSelect}
            />

            <BulbBlockButton
                position={[-1.23, 0, 0]}
                selected={selectedKind === "bulb"}
                onClick={onSelect}
            />

            <SwitchBlockButton
                position={[-0.41, 0, 0]}
                selected={selectedKind === "switch"}
                onClick={onSelect}
            />

            <CableBlockButton
                position={[0.41, 0, 0]}
                selected={selectedKind === "cable"}
                onClick={onSelect}
            />

            <TurnBlockButton
                position={[1.23, 0, 0]}
                selected={selectedKind === "turn"}
                onClick={onSelect}
            />

            <QuestionBlockButton
                position={[2.05, 0, 0]}
                selected={selectedKind === "question"}
                onClick={onSelect}
            />
        </group>
    )
}
