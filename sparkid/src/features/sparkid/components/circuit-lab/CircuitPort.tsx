"use client"

import * as THREE from "three"
import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import {
    useCircuitConnections,
    type CircuitOwnerKind,
    type CircuitPortKind,
} from "./CircuitConnectionContext"

type Vec3 = [number, number, number]

type CircuitPortProps = {
    id: string
    ownerId: string
    ownerKind: CircuitOwnerKind
    kind?: CircuitPortKind
    position?: Vec3 | THREE.Vector3
    normal?: Vec3 | THREE.Vector3
    visible?: boolean
    color?: string
}

function toVector3(value: Vec3 | THREE.Vector3) {
    if (value instanceof THREE.Vector3) {
        return value
    }

    return new THREE.Vector3(...value)
}

export default function CircuitPort({
                                        id,
                                        ownerId,
                                        ownerKind,
                                        kind = "terminal",
                                        position = [0, 0, 0],
                                        normal = [0, 0, 1],
                                        visible = true,
                                        color = "#FFD84D",
                                    }: CircuitPortProps) {
    const groupRef = useRef<THREE.Group>(null)

    const worldPosition = useMemo(() => new THREE.Vector3(), [])
    const worldNormal = useMemo(() => new THREE.Vector3(), [])
    const worldQuaternion = useMemo(() => new THREE.Quaternion(), [])

    const localNormal = useMemo(() => {
        return toVector3(normal).clone().normalize()
    }, [normal])

    const { registerPort, updatePort, unregisterPort } = useCircuitConnections()

    useEffect(() => {
        registerPort({
            id,
            ownerId,
            ownerKind,
            kind,
            worldPosition: new THREE.Vector3(),
            worldNormal: new THREE.Vector3(0, 0, 1),
            enabled: true,
        })

        return () => {
            unregisterPort(id)
        }
    }, [
        id,
        ownerId,
        ownerKind,
        kind,
        registerPort,
        unregisterPort,
    ])

    useFrame(() => {
        if (!groupRef.current) return

        groupRef.current.getWorldPosition(worldPosition)
        groupRef.current.getWorldQuaternion(worldQuaternion)

        worldNormal
            .copy(localNormal)
            .applyQuaternion(worldQuaternion)
            .normalize()

        updatePort(id, worldPosition, worldNormal)
    })

    return (
        <group ref={groupRef} position={position}>
            {visible && (
                <>
                    <mesh>
                        <sphereGeometry args={[0.055, 20, 10]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>

                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.13, 0.012, 10, 36]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.65}
                        />
                    </mesh>

                    {/* Normal debug çizgisi */}
                    <mesh
                        position={[
                            localNormal.x * 0.12,
                            localNormal.y * 0.12,
                            localNormal.z * 0.12,
                        ]}
                    >
                        <sphereGeometry args={[0.025, 12, 6]} />
                        <meshBasicMaterial
                            color="#00E5FF"
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                </>
            )}
        </group>
    )
}