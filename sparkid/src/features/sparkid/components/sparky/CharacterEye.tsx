import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

type Vec2 = [number, number]
type Vec3 = [number, number, number]

export type CharacterEyeProps = {
    position?: Vec3
    scale?: Vec3
    color?: string

    openness?: number
    lookOffset?: Vec2

    highlight?: boolean
    highlightColor?: string
    highlightPosition?: Vec3
    highlightScale?: Vec3

    followPointer?: boolean
    followRange?: Vec2
    followSpeed?: number

    blink?: boolean
    blinkSpeed?: number
    blinkThreshold?: number
}

export default function CharacterEye({
                                         position = [0, 0, 0.82],
                                         scale = [0.09, 0.13, 0.025],
                                         color = "#050505",

                                         openness = 1,
                                         lookOffset = [0, 0],

                                         highlight = true,
                                         highlightColor = "white",
                                         highlightPosition = [-0.025, 0.045, 0.025],
                                         highlightScale = [0.025, 0.035, 0.01],

                                         followPointer = true,
                                         followRange = [0.055, 0.045],
                                         followSpeed = 0.12,

                                         blink = true,
                                         blinkSpeed = 3.2,
                                         blinkThreshold = 0.985,
                                     }: CharacterEyeProps) {
    const eyeGroupRef = useRef<THREE.Group>(null)
    const eyeMeshRef = useRef<THREE.Mesh>(null)
    const highlightRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const eyeGroup = eyeGroupRef.current
        const eyeMesh = eyeMeshRef.current
        if (!eyeGroup || !eyeMesh) return

        const targetX =
            position[0] +
            lookOffset[0] +
            (followPointer ? state.pointer.x * followRange[0] : 0)

        const targetY =
            position[1] +
            lookOffset[1] +
            (followPointer ? state.pointer.y * followRange[1] : 0)

        eyeGroup.position.x = THREE.MathUtils.lerp(
            eyeGroup.position.x,
            targetX,
            followSpeed
        )

        eyeGroup.position.y = THREE.MathUtils.lerp(
            eyeGroup.position.y,
            targetY,
            followSpeed
        )

        const shouldBlink =
            blink && Math.sin(state.clock.elapsedTime * blinkSpeed) > blinkThreshold

        const blinkMultiplier = shouldBlink ? 0.12 : 1
        const targetScaleY = scale[1] * openness * blinkMultiplier

        eyeMesh.scale.x = scale[0]
        eyeMesh.scale.y = THREE.MathUtils.lerp(eyeMesh.scale.y, targetScaleY, 0.35)
        eyeMesh.scale.z = scale[2]

        const highlightMesh = highlightRef.current

        if (highlightMesh) {
            highlightMesh.scale.x = highlightScale[0]
            highlightMesh.scale.y = THREE.MathUtils.lerp(
                highlightMesh.scale.y,
                highlightScale[1] * openness * blinkMultiplier,
                0.35
            )
            highlightMesh.scale.z = highlightScale[2]
        }
    })

    return (
        <group ref={eyeGroupRef} position={position}>
            <mesh ref={eyeMeshRef} scale={scale}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.35}
                    metalness={0.05}
                />
            </mesh>

            {highlight && (
                <mesh
                    ref={highlightRef}
                    position={highlightPosition}
                    scale={highlightScale}
                >
                    <sphereGeometry args={[1, 16, 8]} />
                    <meshStandardMaterial color={highlightColor} />
                </mesh>
            )}
        </group>
    )
}