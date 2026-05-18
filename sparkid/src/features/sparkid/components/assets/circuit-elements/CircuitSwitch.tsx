"use client"

import * as THREE from "three"
import { RoundedBox, Text } from "@react-three/drei"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import {ReactNode, useMemo, useRef, useState} from "react"

type Vec3 = [number, number, number]

export type CircuitSwitchMode = "off" | "on"

export type CircuitSwitchVisualState =
    | "off"
    | "on"
    | "hover"
    | "pressed"
    | "transition"

export type CircuitSwitchAnimation =
    | "idle"
    | "toggle"
    | "wiggle"
    | "showcase"
    | "none"

export type CircuitSwitchColors = {
    body: string
    bodyShadow: string
    base: string
    baseDark: string
    slot: string
    lever: string
    leverDark: string
    knob: string
    knobHighlight: string
    greenLed: string
    redLed: string
    screw: string
    screwSlot: string
    connector: string
    connectorDark: string
    glow: string
}

export type CircuitSwitchProps = {
    position?: Vec3
    scale?: number

    mode?: CircuitSwitchMode
    defaultMode?: CircuitSwitchMode
    state?: CircuitSwitchVisualState
    animation?: CircuitSwitchAnimation

    interactive?: boolean
    disabled?: boolean

    showLabels?: boolean
    showScrews?: boolean
    showConnectors?: boolean
    showGlow?: boolean

    colors?: Partial<CircuitSwitchColors>

    onToggle?: (nextMode: CircuitSwitchMode) => void
    onModeChange?: (nextMode: CircuitSwitchMode) => void
    children?: ReactNode
}

const DEFAULT_COLORS: CircuitSwitchColors = {
    body: "#fff2d8",
    bodyShadow: "#e9d1aa",
    base: "#2563be",
    baseDark: "#113a7c",
    slot: "#17191d",
    lever: "#1d6fd8",
    leverDark: "#0c3d8d",
    knob: "#ef4444",
    knobHighlight: "#ff8a7a",
    greenLed: "#22c55e",
    redLed: "#ef4444",
    screw: "#d99a24",
    screwSlot: "#7c4a0b",
    connector: "#d99a24",
    connectorDark: "#1f2933",
    glow: "#00b8ff",
}

const OFF_LEVER_ROTATION_X = 0.92
const ON_LEVER_ROTATION_X = -0.18

function lerp(current: number, target: number, speed: number) {
    return THREE.MathUtils.lerp(current, target, speed)
}

function Screw({
    position,
    colors,
}: {
    position: Vec3
    colors: CircuitSwitchColors
}) {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.065, 0.065, 0.035, 32]} />
                <meshStandardMaterial
                    color={colors.screw}
                    roughness={0.32}
                    metalness={0.55}
                />
            </mesh>

            <mesh position={[0, 0.021, 0]}>
                <boxGeometry args={[0.085, 0.007, 0.014]} />
                <meshStandardMaterial
                    color={colors.screwSlot}
                    roughness={0.45}
                    metalness={0.25}
                />
            </mesh>
        </group>
    )
}

function Connector({
    side,
    colors,
}: {
    side: -1 | 1
    colors: CircuitSwitchColors
}) {
    return (
        <group position={[side * 0.93, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.12, 0.12, 0.18, 36]} />
                <meshStandardMaterial
                    color={colors.connector}
                    roughness={0.28}
                    metalness={0.65}
                />
            </mesh>

            <mesh position={[0, side * 0.075, 0]}>
                <cylinderGeometry args={[0.075, 0.075, 0.04, 32]} />
                <meshStandardMaterial
                    color={colors.connectorDark}
                    roughness={0.38}
                    metalness={0.35}
                />
            </mesh>
        </group>
    )
}

export default function CircuitSwitch({
    position = [0, 0, 0],
    scale = 1,

    mode,
    defaultMode = "off",
    state: visualState,
    animation = "idle",

    interactive = true,
    disabled = false,

    showLabels = true,
    showScrews = true,
    showConnectors = true,
    showGlow = true,

    colors,

    onToggle,
    onModeChange,
    children,
}: CircuitSwitchProps) {
    const [internalMode, setInternalMode] = useState<CircuitSwitchMode>(defaultMode)
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const rootRef = useRef<THREE.Group>(null)
    const animatedRef = useRef<THREE.Group>(null)
    const leverPivotRef = useRef<THREE.Group>(null)
    const pressedRef = useRef(false)

    const greenMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const redMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
    const greenLightRef = useRef<THREE.PointLight>(null)
    const redLightRef = useRef<THREE.PointLight>(null)

    const baseGlowMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
    const hoverRingMaterialRef = useRef<THREE.MeshBasicMaterial>(null)

    const finalColors = useMemo<CircuitSwitchColors>(
        () => ({
            ...DEFAULT_COLORS,
            ...colors,
        }),
        [colors]
    )

    const currentMode = mode ?? internalMode

    const setCursor = (cursor: string) => {
        if (typeof document === "undefined") return
        document.body.style.cursor = cursor
    }

    const toggleMode = () => {
        if (disabled) return

        const nextMode: CircuitSwitchMode = currentMode === "on" ? "off" : "on"

        if (!mode) {
            setInternalMode(nextMode)
        }

        onToggle?.(nextMode)
        onModeChange?.(nextMode)
    }

    const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()
        setHovered(true)
        setCursor("pointer")
    }

    const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive) return

        event.stopPropagation()
        setHovered(false)
        setPressed(false)
        pressedRef.current = false
        setCursor("auto")
    }

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()
        setPressed(true)
        pressedRef.current = true
    }

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        if (!interactive || disabled) return

        event.stopPropagation()

        if (pressedRef.current) {
            toggleMode()
        }

        setPressed(false)
        pressedRef.current = false
    }

    useFrame((frameState) => {
        const t = frameState.clock.elapsedTime

        const root = rootRef.current
        const animated = animatedRef.current
        const leverPivot = leverPivotRef.current

        if (!root || !animated || !leverPivot) return

        const forcedOn = visualState === "on"
        const forcedOff = visualState === "off"

        const visualMode: CircuitSwitchMode = forcedOn
            ? "on"
            : forcedOff
              ? "off"
              : currentMode

        const visualHover = !disabled && (hovered || visualState === "hover")
        const visualPressed = !disabled && (pressed || visualState === "pressed")
        const visualTransition = visualState === "transition" || animation === "toggle"

        let modeMix = visualMode === "on" ? 1 : 0

        if (visualTransition) {
            modeMix = (Math.sin(t * 2.4) + 1) / 2
        }

        if (visualPressed && !visualTransition) {
            modeMix = visualMode === "on" ? 0.62 : 0.38
        }

        let targetLeverRotationX = THREE.MathUtils.lerp(
            OFF_LEVER_ROTATION_X,
            ON_LEVER_ROTATION_X,
            modeMix
        )

        if (animation === "wiggle") {
            targetLeverRotationX += Math.sin(t * 12) * 0.045
        }

        leverPivot.rotation.x = lerp(
            leverPivot.rotation.x,
            targetLeverRotationX,
            visualPressed ? 0.22 : 0.13
        )

        const activeAmount = disabled ? 0 : modeMix
        const inactiveAmount = disabled ? 0.15 : 1 - modeMix

        const greenIntensity = 0.12 + activeAmount * 2.4
        const redIntensity = 0.15 + inactiveAmount * 1.95

        if (greenMaterialRef.current) {
            greenMaterialRef.current.emissiveIntensity = lerp(
                greenMaterialRef.current.emissiveIntensity,
                greenIntensity,
                0.14
            )
        }

        if (redMaterialRef.current) {
            redMaterialRef.current.emissiveIntensity = lerp(
                redMaterialRef.current.emissiveIntensity,
                redIntensity,
                0.14
            )
        }

        if (greenLightRef.current) {
            greenLightRef.current.intensity = lerp(
                greenLightRef.current.intensity,
                activeAmount * 1.45,
                0.14
            )
        }

        if (redLightRef.current) {
            redLightRef.current.intensity = lerp(
                redLightRef.current.intensity,
                inactiveAmount * 1.1,
                0.14
            )
        }

        const pulse = (Math.sin(t * 4.8) + 1) / 2
        const hoverGlow = visualHover ? 0.32 : 0
        const activeGlow = activeAmount * (0.28 + pulse * 0.14)
        const totalGlow = disabled ? 0 : Math.max(hoverGlow, activeGlow)

        if (baseGlowMaterialRef.current) {
            baseGlowMaterialRef.current.opacity = lerp(
                baseGlowMaterialRef.current.opacity,
                totalGlow,
                0.12
            )
        }

        if (hoverRingMaterialRef.current) {
            hoverRingMaterialRef.current.opacity = lerp(
                hoverRingMaterialRef.current.opacity,
                visualHover ? 0.26 : 0.06 + activeAmount * 0.12,
                0.12
            )
        }

        let targetY = 0
        let targetRotZ = 0
        let targetRotY = 0
        let targetScaleX = 1
        let targetScaleY = 1
        let targetScaleZ = 1

        if (animation === "idle") {
            targetY += Math.sin(t * 1.4) * 0.012
            targetRotZ += Math.sin(t * 1.1) * 0.008
        }

        if (visualHover) {
            targetY += 0.035
            targetScaleX = 1.025
            targetScaleY = 1.025
            targetScaleZ = 1.025
        }

        if (visualPressed) {
            targetY -= 0.025
            targetScaleX = 1.035
            targetScaleY = 0.965
            targetScaleZ = 1.035
            targetRotZ += visualMode === "on" ? -0.018 : 0.018
        }

        if (animation === "showcase") {
            targetRotY = Math.sin(t * 0.7) * 0.68
            targetY += Math.sin(t * 1.3) * 0.018
        }

        if (disabled) {
            targetY -= 0.015
            targetScaleY = 0.98
        }

        animated.position.y = lerp(animated.position.y, targetY, 0.1)
        animated.rotation.z = lerp(animated.rotation.z, targetRotZ, 0.1)
        animated.rotation.y = lerp(animated.rotation.y, targetRotY, 0.08)

        animated.scale.x = lerp(animated.scale.x, targetScaleX, 0.12)
        animated.scale.y = lerp(animated.scale.y, targetScaleY, 0.12)
        animated.scale.z = lerp(animated.scale.z, targetScaleZ, 0.12)
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
            <group ref={animatedRef}>
                {showGlow && (
                    <>
                        <RoundedBox
                            args={[1.95, 0.035, 1.36]}
                            radius={0.18}
                            smoothness={8}
                            position={[0, -0.015, 0]}
                        >
                            <meshBasicMaterial
                                ref={baseGlowMaterialRef}
                                color={finalColors.glow}
                                transparent
                                opacity={0}
                                depthWrite={false}
                                blending={THREE.AdditiveBlending}
                                toneMapped={false}
                            />
                        </RoundedBox>

                        <RoundedBox
                            args={[1.86, 0.025, 1.27]}
                            radius={0.16}
                            smoothness={8}
                            position={[0, 0.265, 0]}
                        >
                            <meshBasicMaterial
                                ref={hoverRingMaterialRef}
                                color={finalColors.glow}
                                transparent
                                opacity={0.06}
                                depthWrite={false}
                                blending={THREE.AdditiveBlending}
                                toneMapped={false}
                            />
                        </RoundedBox>
                    </>
                )}

                {/* Alt mavi taban */}
                <RoundedBox
                    args={[1.78, 0.3, 1.18]}
                    radius={0.14}
                    smoothness={10}
                    position={[0, 0.1, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.base}
                        roughness={0.34}
                        metalness={0.12}
                    />
                </RoundedBox>

                {/* Alt taban koyu alt bant */}
                <RoundedBox
                    args={[1.82, 0.14, 1.22]}
                    radius={0.15}
                    smoothness={10}
                    position={[0, 0.02, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.baseDark}
                        roughness={0.42}
                        metalness={0.16}
                    />
                </RoundedBox>

                {/* Üst krem gövde */}
                <RoundedBox
                    args={[1.34, 0.62, 0.96]}
                    radius={0.18}
                    smoothness={12}
                    position={[0, 0.5, 0]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.body}
                        roughness={0.38}
                        metalness={0.02}
                    />
                </RoundedBox>

                {/* Yan tombiş gövde hacimleri */}
                <mesh
                    castShadow
                    receiveShadow
                    position={[-0.58, 0.5, 0]}
                    scale={[0.26, 0.36, 0.49]}
                >
                    <sphereGeometry args={[1, 32, 18]} />
                    <meshStandardMaterial
                        color={finalColors.body}
                        roughness={0.38}
                        metalness={0.02}
                    />
                </mesh>

                <mesh
                    castShadow
                    receiveShadow
                    position={[0.58, 0.5, 0]}
                    scale={[0.26, 0.36, 0.49]}
                >
                    <sphereGeometry args={[1, 32, 18]} />
                    <meshStandardMaterial
                        color={finalColors.body}
                        roughness={0.38}
                        metalness={0.02}
                    />
                </mesh>

                {/* Gövde alt gölge / seam */}
                <RoundedBox
                    args={[1.25, 0.06, 0.92]}
                    radius={0.08}
                    smoothness={8}
                    position={[0, 0.215, 0]}
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.bodyShadow}
                        roughness={0.48}
                        metalness={0.02}
                    />
                </RoundedBox>

                {/* Siyah slot */}
                <RoundedBox
                    args={[0.48, 0.12, 0.7]}
                    radius={0.08}
                    smoothness={10}
                    position={[0, 0.805, 0.025]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.slot}
                        roughness={0.42}
                        metalness={0.18}
                    />
                </RoundedBox>

                {/* Slot içindeki mavi pivot yuvası */}
                <RoundedBox
                    args={[0.28, 0.09, 0.5]}
                    radius={0.06}
                    smoothness={8}
                    position={[0, 0.845, 0.025]}
                    castShadow
                    receiveShadow
                >
                    <meshStandardMaterial
                        color={finalColors.leverDark}
                        roughness={0.32}
                        metalness={0.18}
                    />
                </RoundedBox>

                {/* Kol pivot grubu */}
                <group ref={leverPivotRef} position={[0, 0.83, 0.02]}>
                    {/* Mavi kol */}
                    <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
                        <cylinderGeometry args={[0.075, 0.09, 0.76, 32]} />
                        <meshStandardMaterial
                            color={finalColors.lever}
                            roughness={0.28}
                            metalness={0.12}
                        />
                    </mesh>

                    {/* Kol parlaklığı */}
                    <mesh position={[-0.025, 0.39, 0.055]} scale={[0.022, 0.31, 0.012]}>
                        <sphereGeometry args={[1, 16, 8]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.22}
                            roughness={0.2}
                            metalness={0}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Kırmızı topuz */}
                    <mesh castShadow receiveShadow position={[0, 0.83, 0]} scale={[0.19, 0.19, 0.19]}>
                        <sphereGeometry args={[1, 36, 18]} />
                        <meshStandardMaterial
                            color={finalColors.knob}
                            roughness={0.24}
                            metalness={0.05}
                        />
                    </mesh>

                    {/* Topuz highlight */}
                    <mesh position={[-0.055, 0.9, 0.095]} scale={[0.045, 0.035, 0.02]}>
                        <sphereGeometry args={[1, 16, 8]} />
                        <meshStandardMaterial
                            color={finalColors.knobHighlight}
                            transparent
                            opacity={0.85}
                            roughness={0.18}
                            metalness={0}
                            depthWrite={false}
                        />
                    </mesh>
                </group>

                {/* Pivot kapağı */}
                <mesh castShadow receiveShadow position={[0, 0.83, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.17, 0.035, 16, 36]} />
                    <meshStandardMaterial
                        color={finalColors.leverDark}
                        roughness={0.28}
                        metalness={0.18}
                    />
                </mesh>

                {/* LED'ler */}
                <mesh castShadow position={[-0.45, 0.52, 0.505]} scale={[0.075, 0.075, 0.04]}>
                    <sphereGeometry args={[1, 24, 12]} />
                    <meshStandardMaterial
                        ref={greenMaterialRef}
                        color={finalColors.greenLed}
                        emissive={finalColors.greenLed}
                        emissiveIntensity={0.12}
                        roughness={0.2}
                        metalness={0.05}
                        toneMapped={false}
                    />
                </mesh>

                <pointLight
                    ref={greenLightRef}
                    position={[-0.45, 0.52, 0.68]}
                    color={finalColors.greenLed}
                    intensity={0}
                    distance={1.3}
                />

                <mesh castShadow position={[0.45, 0.52, 0.505]} scale={[0.075, 0.075, 0.04]}>
                    <sphereGeometry args={[1, 24, 12]} />
                    <meshStandardMaterial
                        ref={redMaterialRef}
                        color={finalColors.redLed}
                        emissive={finalColors.redLed}
                        emissiveIntensity={1.8}
                        roughness={0.2}
                        metalness={0.05}
                        toneMapped={false}
                    />
                </mesh>

                <pointLight
                    ref={redLightRef}
                    position={[0.45, 0.52, 0.68]}
                    color={finalColors.redLed}
                    intensity={0.9}
                    distance={1.2}
                />

                {/* LED cam highlight */}
                <mesh position={[-0.475, 0.55, 0.535]} scale={[0.025, 0.018, 0.01]}>
                    <sphereGeometry args={[1, 12, 8]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
                </mesh>

                <mesh position={[0.425, 0.55, 0.535]} scale={[0.025, 0.018, 0.01]}>
                    <sphereGeometry args={[1, 12, 8]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
                </mesh>

                {/* Vidalar */}
                {showScrews && (
                    <>
                        <Screw position={[-0.7, 0.285, 0.44]} colors={finalColors} />
                        <Screw position={[0.7, 0.285, 0.44]} colors={finalColors} />
                        <Screw position={[-0.7, 0.285, -0.44]} colors={finalColors} />
                        <Screw position={[0.7, 0.285, -0.44]} colors={finalColors} />
                    </>
                )}

                {/* Bağlantı noktaları */}
                {showConnectors && (
                    <>
                        <Connector side={-1} colors={finalColors} />
                        <Connector side={1} colors={finalColors} />
                    </>
                )}

                {children}

                {/* Ön yazılar */}
                {showLabels && (
                    <>
                        <Text
                            position={[-0.45, 0.38, 0.535]}
                            fontSize={0.07}
                            color="#17324a"
                            anchorX="center"
                            anchorY="middle"
                        >
                            IN
                        </Text>

                        <Text
                            position={[0.45, 0.38, 0.535]}
                            fontSize={0.07}
                            color="#17324a"
                            anchorX="center"
                            anchorY="middle"
                        >
                            OUT
                        </Text>

                        <Text
                            position={[0, 0.18, 0.61]}
                            fontSize={0.075}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                        >
                            SPARKID SWITCH
                        </Text>
                    </>
                )}

                {/* Raycast hit area */}
                <mesh position={[0, 0.58, 0]}>
                    <boxGeometry args={[2.05, 1.55, 1.45]} />
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
