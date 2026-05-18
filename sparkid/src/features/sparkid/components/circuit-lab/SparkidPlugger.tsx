"use client"

import * as THREE from "three"
import { Text } from "@react-three/drei"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"

type Vec3 = [number, number, number]

export type PluggerPortType = "plug" | "socket"

export type PluggerStatus =
    | "idle"
    | "hover"
    | "connected"
    | "energy"
    | "warning"
    | "error"
    | "disabled"

export type PluggerOrientation =
    | "front"
    | "back"
    | "left"
    | "right"
    | "up"
    | "down"

export type SparkidPluggerColors = {
    body: string
    bodyShadow: string
    cableBlue: string
    cableBlueDark: string
    metalGold: string
    metalGoldDark: string
    socketBlack: string
    greenLed: string
    amberLed: string
    redLed: string
    energy: string
    text: string
}

export type SparkidPluggerProps = {
    position?: Vec3
    scale?: number

    /**
     * socket: kablonun plug/erkek ucu buraya girer.
     * plug: kablonun socket/dişi ucu buna takılır.
     */
    portType?: PluggerPortType

    /**
     * Kablo ucunu biliyorsan bunu ver.
     * compatibleCableConnector="plug" => plugger socket olur.
     * compatibleCableConnector="socket" => plugger plug olur.
     */
    compatibleCableConnector?: PluggerPortType

    status?: PluggerStatus
    orientation?: PluggerOrientation

    cableColor?: string
    energyColor?: string

    interactive?: boolean
    disabled?: boolean

    showLabel?: boolean
    showLeds?: boolean
    showScrews?: boolean
    showGuideDots?: boolean
    showGlow?: boolean

    label?: string

    onClick?: () => void
    onConnect?: () => void
    onHoverChange?: (hovered: boolean) => void
}

const DEFAULT_COLORS: SparkidPluggerColors = {
    body: "#f4e6d0",
    bodyShadow: "#d9bea0",
    cableBlue: "#2563EB",
    cableBlueDark: "#174EA6",
    metalGold: "#F2B430",
    metalGoldDark: "#A45A12",
    socketBlack: "#1F2937",
    greenLed: "#22C55E",
    amberLed: "#FFB020",
    redLed: "#EF4444",
    energy: "#FFD84D",
    text: "#17324A",
}



export const PLUGGER_FRONT_PORT_OFFSET: Vec3 = [0, 0, 0.74]
export const PLUGGER_BACK_PORT_OFFSET: Vec3 = [0, 0, -0.52]

export function getCompatiblePluggerPort(
    cableConnector: PluggerPortType
): PluggerPortType {
    return cableConnector === "plug" ? "socket" : "plug"
}

function lerp(current: number, target: number, speed: number) {
    return THREE.MathUtils.lerp(current, target, speed)
}

function getOrientationRotation(orientation: PluggerOrientation): Vec3 {
    if (orientation === "front") return [0, 0, 0]
    if (orientation === "back") return [0, Math.PI, 0]
    if (orientation === "left") return [0, -Math.PI / 2, 0]
    if (orientation === "right") return [0, Math.PI / 2, 0]
    if (orientation === "up") return [-Math.PI / 2, 0, 0]
    if (orientation === "down") return [Math.PI / 2, 0, 0]

    return [0, 0, 0]
}

function PluggerScrew({
                          position,
                          colors,
                      }: {
    position: Vec3
    colors: SparkidPluggerColors
}) {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.035, 0.035, 0.018, 28]} />
                <meshStandardMaterial
                    color={colors.metalGold}
                    roughness={0.26}
                    metalness={0.7}
                />
            </mesh>

            <mesh position={[0, 0, 0.011]}>
                <boxGeometry args={[0.05, 0.006, 0.004]} />
                <meshStandardMaterial
                    color={colors.metalGoldDark}
                    roughness={0.36}
                    metalness={0.35}
                />
            </mesh>
        </group>
    )
}

function LedDot({
                    position,
                    color,
                    active,
                }: {
    position: Vec3
    color: string
    active: boolean
}) {
    return (
        <mesh position={position} scale={[0.027, 0.027, 0.014]}>
            <sphereGeometry args={[1, 16, 8]} />
            <meshStandardMaterial
                color={active ? color : "#3a4656"}
                emissive={active ? color : "#000000"}
                emissiveIntensity={active ? 1.8 : 0}
                roughness={0.18}
                metalness={0.02}
                toneMapped={false}
            />
        </mesh>
    )
}

function GuideDots({
                       colors,
                       active,
                   }: {
    colors: SparkidPluggerColors
    active: boolean
}) {
    const dots = [
        [-0.28, 0.22, 0.515],
        [-0.18, 0.31, 0.515],
        [0.18, 0.31, 0.515],
        [0.28, 0.22, 0.515],
        [-0.28, -0.22, 0.515],
        [-0.18, -0.31, 0.515],
        [0.18, -0.31, 0.515],
        [0.28, -0.22, 0.515],
    ] as Vec3[]

    return (
        <>
            {dots.map((position, index) => (
                <mesh key={index} position={position} scale={[0.014, 0.014, 0.008]}>
                    <sphereGeometry args={[1, 10, 6]} />
                    <meshStandardMaterial
                        color={active ? colors.greenLed : "#6bc96e"}
                        emissive={active ? colors.greenLed : "#000000"}
                        emissiveIntensity={active ? 0.9 : 0}
                        roughness={0.3}
                        metalness={0}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </>
    )
}

function PluggerPort({
                         type,
                         colors,
                         active,
                     }: {
    type: PluggerPortType
    colors: SparkidPluggerColors
    active: boolean
}) {
    if (type === "plug") {
        return (
            <group>
                {/* Altın dış collar */}
                <mesh castShadow receiveShadow position={[0, 0, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.22, 0.18, 64]} />
                    <meshStandardMaterial
                        color={colors.metalGold}
                        roughness={0.18}
                        metalness={0.82}
                    />
                </mesh>

                <mesh position={[0, 0, 0.43]}>
                    <torusGeometry args={[0.21, 0.026, 16, 64]} />
                    <meshStandardMaterial
                        color={colors.metalGoldDark}
                        roughness={0.22}
                        metalness={0.72}
                    />
                </mesh>

                {/* Erkek pin */}
                <mesh castShadow receiveShadow position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.09, 0.11, 0.34, 56]} />
                    <meshStandardMaterial
                        color={colors.metalGold}
                        roughness={0.14}
                        metalness={0.86}
                    />
                </mesh>

                <mesh castShadow receiveShadow position={[0, 0, 0.91]} scale={[0.092, 0.092, 0.092]}>
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshStandardMaterial
                        color={colors.metalGold}
                        roughness={0.14}
                        metalness={0.86}
                    />
                </mesh>

                {active && (
                    <pointLight
                        position={[0, 0, 0.8]}
                        color={colors.energy}
                        intensity={0.75}
                        distance={1.4}
                    />
                )}
            </group>
        )
    }

    return (
        <group>
            {/* Dişi socket body */}
            <mesh castShadow receiveShadow position={[0, 0, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.21, 0.24, 0.2, 64]} />
                <meshStandardMaterial
                    color={colors.metalGold}
                    roughness={0.18}
                    metalness={0.82}
                />
            </mesh>

            {/* Altın dış rim */}
            <mesh position={[0, 0, 0.62]}>
                <torusGeometry args={[0.2, 0.036, 18, 72]} />
                <meshStandardMaterial
                    color={colors.metalGold}
                    roughness={0.16}
                    metalness={0.86}
                />
            </mesh>

            {/* Siyah iç delik */}
            <mesh position={[0, 0, 0.647]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.115, 0.115, 0.026, 40]} />
                <meshStandardMaterial
                    color={colors.socketBlack}
                    roughness={0.38}
                    metalness={0.18}
                />
            </mesh>

            {/* İç altın ring */}
            <mesh position={[0, 0, 0.666]}>
                <torusGeometry args={[0.116, 0.012, 12, 40]} />
                <meshStandardMaterial
                    color="#ffcf6a"
                    roughness={0.14}
                    metalness={0.76}
                />
            </mesh>

            {active && (
                <pointLight
                    position={[0, 0, 0.72]}
                    color={colors.energy}
                    intensity={0.75}
                    distance={1.4}
                />
            )}
        </group>
    )
}

export default function SparkidPlugger({
                                           position = [0, 0, 0],
                                           scale = 1,

                                           portType = "socket",
                                           compatibleCableConnector,
                                           status = "idle",
                                           orientation = "front",

                                           cableColor,
                                           energyColor,

                                           interactive = true,
                                           disabled = false,

                                           showLabel = true,
                                           showLeds = true,
                                           showScrews = true,
                                           showGuideDots = true,
                                           showGlow = true,

                                           label = "PLUGGER",

                                           onClick,
                                           onConnect,
                                           onHoverChange,
                                       }: SparkidPluggerProps) {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const rootRef = useRef<THREE.Group>(null)
    const modelRef = useRef<THREE.Group>(null)

    const bodyMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const ringMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)

    const finalColors = useMemo<SparkidPluggerColors>(
        () => ({
            ...DEFAULT_COLORS,
            cableBlue: cableColor ?? DEFAULT_COLORS.cableBlue,
            energy: energyColor ?? DEFAULT_COLORS.energy,
        }),
        [cableColor, energyColor]
    )

    const finalPortType = compatibleCableConnector
        ? getCompatiblePluggerPort(compatibleCableConnector)
        : portType

    const orientationRotation = useMemo(
        () => getOrientationRotation(orientation),
        [orientation]
    )

    const disabledStatus = disabled || status === "disabled"
    const isConnected = status === "connected" || status === "energy"
    const isEnergy = status === "energy"
    const isWarning = status === "warning"
    const isError = status === "error"
    const active = !disabledStatus && (hovered || pressed || isConnected || isEnergy)

    const glowColor = useMemo(() => {
        if (isError) return new THREE.Color(finalColors.redLed)
        if (isWarning) return new THREE.Color(finalColors.amberLed)
        if (isEnergy) return new THREE.Color(finalColors.energy)
        if (isConnected) return new THREE.Color(finalColors.greenLed)

        return new THREE.Color(finalColors.cableBlue)
    }, [
        finalColors.amberLed,
        finalColors.cableBlue,
        finalColors.energy,
        finalColors.greenLed,
        finalColors.redLed,
        isConnected,
        isEnergy,
        isError,
        isWarning,
    ])

    const setCursor = (cursor: string) => {
        if (typeof document === "undefined") return
        document.body.style.cursor = cursor
    }

    const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabledStatus) return

        event.stopPropagation()
        setHovered(true)
        setCursor("pointer")
        onHoverChange?.(true)
    }

    const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive) return

        event.stopPropagation()
        setHovered(false)
        setPressed(false)
        setCursor("auto")
        onHoverChange?.(false)
    }

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabledStatus) return

        event.stopPropagation()
        setPressed(true)
    }

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabledStatus) return

        event.stopPropagation()
        setPressed(false)
        onClick?.()
        onConnect?.()
    }

    useFrame((state) => {
        const model = modelRef.current
        if (!model) return

        const t = state.clock.elapsedTime
        const pulse = (Math.sin(t * 5.5) + 1) / 2

        let targetY = Math.sin(t * 1.25) * 0.006
        let targetRotZ = Math.sin(t * 1.1) * 0.004
        let targetScaleX = 1
        let targetScaleY = 1
        let targetScaleZ = 1
        let glowOpacity = 0
        let emissiveIntensity = 0.02

        if (hovered && !disabledStatus) {
            targetY += 0.025
            targetScaleX = 1.025
            targetScaleY = 1.025
            targetScaleZ = 1.025
            glowOpacity = 0.14
            emissiveIntensity = 0.15
        }

        if (pressed && !disabledStatus) {
            targetY -= 0.018
            targetScaleX = 1.04
            targetScaleY = 0.96
            targetScaleZ = 1.04
            glowOpacity = 0.24
            emissiveIntensity = 0.24
        }

        if (isConnected && !disabledStatus) {
            glowOpacity = Math.max(glowOpacity, 0.18 + pulse * 0.08)
            emissiveIntensity = Math.max(emissiveIntensity, 0.18)
        }

        if (isEnergy && !disabledStatus) {
            glowOpacity = Math.max(glowOpacity, 0.26 + pulse * 0.14)
            emissiveIntensity = Math.max(emissiveIntensity, 0.32 + pulse * 0.18)
        }

        if (isWarning && !disabledStatus) {
            targetRotZ += Math.sin(t * 8) * 0.012
            glowOpacity = Math.max(glowOpacity, 0.22 + pulse * 0.08)
            emissiveIntensity = Math.max(emissiveIntensity, 0.28)
        }

        if (isError && !disabledStatus) {
            targetRotZ += Math.sin(t * 13) * 0.016
            glowOpacity = Math.max(glowOpacity, 0.28 + pulse * 0.16)
            emissiveIntensity = Math.max(emissiveIntensity, 0.36 + pulse * 0.2)
        }

        if (disabledStatus) {
            targetY -= 0.012
            targetScaleY = 0.975
            glowOpacity = 0
            emissiveIntensity = 0
        }

        model.position.y = lerp(model.position.y, targetY, 0.12)
        model.rotation.z = lerp(model.rotation.z, targetRotZ, 0.1)

        model.scale.x = lerp(model.scale.x, targetScaleX, 0.14)
        model.scale.y = lerp(model.scale.y, targetScaleY, 0.14)
        model.scale.z = lerp(model.scale.z, targetScaleZ, 0.14)

        if (bodyMaterialRef.current) {
            bodyMaterialRef.current.emissive.lerp(glowColor, 0.08)
            bodyMaterialRef.current.emissiveIntensity = lerp(
                bodyMaterialRef.current.emissiveIntensity,
                emissiveIntensity * 0.35,
                0.12
            )
        }

        if (ringMaterialRef.current) {
            ringMaterialRef.current.emissive.lerp(glowColor, 0.08)
            ringMaterialRef.current.emissiveIntensity = lerp(
                ringMaterialRef.current.emissiveIntensity,
                emissiveIntensity,
                0.12
            )
        }

        if (glowMaterialRef.current) {
            glowMaterialRef.current.color.lerp(glowColor, 0.08)
            glowMaterialRef.current.opacity = lerp(
                glowMaterialRef.current.opacity,
                showGlow ? glowOpacity : 0,
                0.12
            )
        }
    })

    return (
        <group
            ref={rootRef}
            position={position}
            scale={[scale, scale, scale]}
            rotation={orientationRotation}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
        >
            <group ref={modelRef}>
                {showGlow && (
                    <mesh position={[0, 0, 0.03]} scale={[1.12, 1.12, 0.16]}>
                        <sphereGeometry args={[0.54, 42, 18]} />
                        <meshBasicMaterial
                            ref={glowMaterialRef}
                            color={finalColors.cableBlue}
                            transparent
                            opacity={0}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                            toneMapped={false}
                        />
                    </mesh>
                )}

                {/* Ana krem dış gövde */}
                <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.52, 0.52, 0.34, 80]} />
                    <meshStandardMaterial
                        ref={bodyMaterialRef}
                        color={disabledStatus ? "#a7a7a7" : finalColors.body}
                        emissive={finalColors.cableBlue}
                        emissiveIntensity={0}
                        roughness={0.34}
                        metalness={0.03}
                    />
                </mesh>

                {/* Arka mavi halka - kablo ile aynı renk */}
                <mesh castShadow receiveShadow position={[0, 0, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.53, 0.53, 0.16, 80]} />
                    <meshStandardMaterial
                        ref={ringMaterialRef}
                        color={disabledStatus ? "#6b7280" : finalColors.cableBlue}
                        emissive={finalColors.cableBlue}
                        emissiveIntensity={0}
                        roughness={0.28}
                        metalness={0.12}
                    />
                </mesh>

                {/* Koyu arka dudak */}
                <mesh castShadow receiveShadow position={[0, 0, -0.27]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.46, 0.46, 0.08, 72]} />
                    <meshStandardMaterial
                        color={disabledStatus ? "#4b5563" : finalColors.cableBlueDark}
                        roughness={0.38}
                        metalness={0.15}
                    />
                </mesh>

                {/* Ön krem yüz diski */}
                <mesh castShadow receiveShadow position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.47, 0.49, 0.13, 80]} />
                    <meshStandardMaterial
                        color={disabledStatus ? "#b7b7b7" : finalColors.body}
                        roughness={0.32}
                        metalness={0.02}
                    />
                </mesh>

                {/* Hafif yan gölge */}
                <mesh position={[0, -0.33, 0.24]} scale={[0.34, 0.035, 0.012]}>
                    <sphereGeometry args={[1, 20, 8]} />
                    <meshBasicMaterial
                        color="#000000"
                        transparent
                        opacity={0.08}
                        depthWrite={false}
                    />
                </mesh>

                {/* Kabloya uygun giriş/çıkış */}
                <PluggerPort
                    type={finalPortType}
                    colors={finalColors}
                    active={active || isEnergy}
                />

                {showGuideDots && (
                    <GuideDots
                        colors={finalColors}
                        active={isConnected || isEnergy}
                    />
                )}

                {/* Ön vidalar */}
                {showScrews && (
                    <>
                        <PluggerScrew
                            position={[-0.29, 0.29, 0.535]}
                            colors={finalColors}
                        />
                        <PluggerScrew
                            position={[0.29, 0.29, 0.535]}
                            colors={finalColors}
                        />
                        <PluggerScrew
                            position={[-0.29, -0.29, 0.535]}
                            colors={finalColors}
                        />
                        <PluggerScrew
                            position={[0.29, -0.29, 0.535]}
                            colors={finalColors}
                        />
                    </>
                )}

                {/* Alt LED göstergeler */}
                {showLeds && (
                    <>
                        <mesh position={[0, -0.44, 0.42]} scale={[0.23, 0.045, 0.018]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial
                                color="#121923"
                                roughness={0.42}
                                metalness={0.12}
                            />
                        </mesh>

                        <LedDot
                            position={[-0.075, -0.44, 0.448]}
                            color={
                                isError
                                    ? finalColors.redLed
                                    : isWarning
                                        ? finalColors.amberLed
                                        : finalColors.greenLed
                            }
                            active={!disabledStatus && (isConnected || isEnergy || isWarning || isError)}
                        />

                        <LedDot
                            position={[0, -0.44, 0.448]}
                            color={isEnergy ? finalColors.energy : finalColors.greenLed}
                            active={!disabledStatus && (isEnergy || isConnected)}
                        />

                        <LedDot
                            position={[0.075, -0.44, 0.448]}
                            color={
                                isError
                                    ? finalColors.redLed
                                    : isWarning
                                        ? finalColors.amberLed
                                        : finalColors.greenLed
                            }
                            active={!disabledStatus && (isEnergy || isConnected || isWarning || isError)}
                        />
                    </>
                )}

                {showLabel && (
                    <Text
                        position={[0, -0.68, 0.15]}
                        fontSize={0.085}
                        color={disabledStatus ? "#6b7280" : finalColors.text}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.003}
                        outlineColor="#ffffff"
                    >
                        {label}
                    </Text>
                )}

                {isEnergy && !disabledStatus && (
                    <pointLight
                        position={[0, 0, 0.75]}
                        color={finalColors.energy}
                        intensity={1.2}
                        distance={2}
                    />
                )}

                {/* Geniş hit area */}
                <mesh position={[0, 0, 0.2]}>
                    <boxGeometry args={[1.15, 1.15, 1.45]} />
                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        depthWrite={false}
                    />
                </mesh>
            </group>
        </group>
    )
}

export function PluggerSocket(
    props: Omit<SparkidPluggerProps, "portType" | "compatibleCableConnector">
) {
    return <SparkidPlugger {...props} portType="socket" />
}

export function PluggerPlug(
    props: Omit<SparkidPluggerProps, "portType" | "compatibleCableConnector">
) {
    return <SparkidPlugger {...props} portType="plug" />
}