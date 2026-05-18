import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

type Vec2 = [number, number]
type Vec3 = [number, number, number]

export type CharacterEyebrowProps = {
    position?: Vec3
    length?: number
    thickness?: number
    color?: string
    tilt?: number

    followPointer?: boolean
    followRange?: Vec2
    followSpeed?: number
}

export default function CharacterEyebrow({
                                             position = [0, 0.32, 0.825],
                                             length = 0.22,
                                             thickness = 0.018,
                                             color = "#171717",
                                             tilt = 0,

                                             followPointer = true,
                                             followRange = [0.02, 0.018],
                                             followSpeed = 0.1,
                                         }: CharacterEyebrowProps) {
    const eyebrowRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        const eyebrow = eyebrowRef.current
        if (!eyebrow) return

        const targetX =
            position[0] + (followPointer ? state.pointer.x * followRange[0] : 0)

        const targetY =
            position[1] + (followPointer ? state.pointer.y * followRange[1] : 0)

        eyebrow.position.x = THREE.MathUtils.lerp(
            eyebrow.position.x,
            targetX,
            followSpeed
        )

        eyebrow.position.y = THREE.MathUtils.lerp(
            eyebrow.position.y,
            targetY,
            followSpeed
        )

        eyebrow.position.z = position[2]

        eyebrow.rotation.z = THREE.MathUtils.lerp(
            eyebrow.rotation.z,
            tilt,
            0.16
        )
    })

    return (
        <group ref={eyebrowRef} position={position} rotation={[0, 0, tilt]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[thickness, thickness, length, 20]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.45}
                    metalness={0.05}
                />
            </mesh>

            <mesh
                position={[-length / 2, 0, 0]}
                scale={[thickness, thickness, thickness]}
            >
                <sphereGeometry args={[1, 16, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            <mesh
                position={[length / 2, 0, 0]}
                scale={[thickness, thickness, thickness]}
            >
                <sphereGeometry args={[1, 16, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    )
}