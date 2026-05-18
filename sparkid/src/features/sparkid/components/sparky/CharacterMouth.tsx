import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"

type Vec2 = [number, number]
type Vec3 = [number, number, number]

export type CharacterMouthVariant = "open" | "smile" | "sad" | "flat" | "o"

export type CharacterMouthProps = {
    position?: Vec3
    scale?: Vec3

    variant?: CharacterMouthVariant

    width?: number
    upperHeight?: number
    lowerHeight?: number
    curveDepth?: number
    lineThickness?: number

    color?: string

    tongue?: boolean
    tongueColor?: string
    tongueWidth?: number
    tongueHeight?: number
    tongueOffsetY?: number

    openness?: number

    animate?: boolean
    animationSpeed?: number
    animationAmount?: number
    animationPhase?: number

    followPointer?: boolean
    followRange?: Vec2
    followSpeed?: number
}

export default function CharacterMouth({
                                           position = [0, -0.12, 0.825],
                                           scale = [1, 1, 1],

                                           variant = "open",

                                           width = 0.26,
                                           upperHeight = 0.07,
                                           lowerHeight = 0.16,
                                           curveDepth = 0.08,
                                           lineThickness = 0.018,

                                           color = "#111111",

                                           tongue = true,
                                           tongueColor = "#ff5b63",
                                           tongueWidth = 0.14,
                                           tongueHeight = 0.08,
                                           tongueOffsetY = -0.035,

                                           openness = 1,

                                           animate = true,
                                           animationSpeed = 3.5,
                                           animationAmount = 0.35,
                                           animationPhase = 0,

                                           followPointer = false,
                                           followRange = [0.018, 0.012],
                                           followSpeed = 0.1,
                                       }: CharacterMouthProps) {
    const mouthRef = useRef<THREE.Group>(null)
    const tongueRef = useRef<THREE.Mesh>(null)

    const mouthShape = useMemo(() => {
        const shape = new THREE.Shape()
        const halfWidth = width / 2

        if (variant === "o") {
            shape.absellipse(
                0,
                0,
                halfWidth,
                lowerHeight,
                0,
                Math.PI * 2,
                false,
                0
            )

            return shape
        }

        shape.moveTo(-halfWidth, 0)
        shape.quadraticCurveTo(0, -lowerHeight, halfWidth, 0)
        shape.quadraticCurveTo(0, upperHeight, -halfWidth, 0)

        return shape
    }, [variant, width, upperHeight, lowerHeight])

    const tongueShape = useMemo(() => {
        const shape = new THREE.Shape()
        const halfWidth = tongueWidth / 2

        shape.moveTo(-halfWidth, 0)
        shape.quadraticCurveTo(0, -tongueHeight, halfWidth, 0)
        shape.quadraticCurveTo(0, -tongueHeight * 0.35, -halfWidth, 0)

        return shape
    }, [tongueWidth, tongueHeight])

    const lineCurve = useMemo(() => {
        const halfWidth = width / 2

        let controlY = 0

        if (variant === "smile") controlY = -curveDepth
        if (variant === "sad") controlY = curveDepth
        if (variant === "flat") controlY = 0

        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-halfWidth, 0, 0),
            new THREE.Vector3(0, controlY, 0),
            new THREE.Vector3(halfWidth, 0, 0)
        )
    }, [variant, width, curveDepth])

    useFrame((state) => {
        const mouth = mouthRef.current
        if (!mouth) return

        const wave = animate
            ? (Math.sin(state.clock.elapsedTime * animationSpeed + animationPhase) + 1) / 2
            : 0

        const targetScaleY =
            scale[1] * openness * (1 + wave * animationAmount)

        mouth.scale.x = scale[0]
        mouth.scale.y = THREE.MathUtils.lerp(mouth.scale.y, targetScaleY, 0.18)
        mouth.scale.z = scale[2]

        const targetX =
            position[0] + (followPointer ? state.pointer.x * followRange[0] : 0)

        const targetY =
            position[1] + (followPointer ? state.pointer.y * followRange[1] : 0)

        mouth.position.x = THREE.MathUtils.lerp(
            mouth.position.x,
            targetX,
            followSpeed
        )

        mouth.position.y = THREE.MathUtils.lerp(
            mouth.position.y,
            targetY,
            followSpeed
        )

        mouth.position.z = position[2]

        if (tongueRef.current) {
            tongueRef.current.position.y = THREE.MathUtils.lerp(
                tongueRef.current.position.y,
                tongueOffsetY - wave * 0.012,
                0.18
            )
        }
    })

    const isLineMouth =
        variant === "smile" || variant === "sad" || variant === "flat"

    return (
        <group ref={mouthRef} position={position} scale={scale}>
            {isLineMouth ? (
                <mesh>
                    <tubeGeometry args={[lineCurve, 32, lineThickness, 8, false]} />
                    <meshStandardMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0.05}
                    />
                </mesh>
            ) : (
                <>
                    <mesh>
                        <shapeGeometry args={[mouthShape]} />
                        <meshStandardMaterial
                            color={color}
                            side={THREE.DoubleSide}
                            roughness={0.4}
                            metalness={0.05}
                        />
                    </mesh>

                    {tongue && variant === "open" && (
                        <mesh ref={tongueRef} position={[0, tongueOffsetY, 0.006]}>
                            <shapeGeometry args={[tongueShape]} />
                            <meshStandardMaterial
                                color={tongueColor}
                                side={THREE.DoubleSide}
                                roughness={0.45}
                                metalness={0}
                            />
                        </mesh>
                    )}
                </>
            )}
        </group>
    )
}