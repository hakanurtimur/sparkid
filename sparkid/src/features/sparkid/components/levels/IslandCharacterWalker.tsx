"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import type { Vec3 } from "@/features/sparkid/components/assets/island/islandConfigs"
import LabKidModel from "@/features/sparkid/components/characters/LabKidModel"

const WALK_SPEED = 1.5
const ARRIVAL_DISTANCE = 0.065

type IslandCharacterWalkerProps = {
    position: Vec3
    targetPosition?: Vec3 | null
    walking?: boolean
    onArrive?: () => void
}

export default function IslandCharacterWalker({
    position,
    targetPosition,
    walking = false,
    onArrive,
}: IslandCharacterWalkerProps) {
    const groupRef = useRef<THREE.Group>(null)
    const arrivedRef = useRef(false)
    const [initialX, initialY, initialZ] = position
    const startPosition = useMemo(
        () => new THREE.Vector3(initialX, initialY, initialZ),
        [initialX, initialY, initialZ],
    )

    useEffect(() => {
        const group = groupRef.current

        if (!group) return

        group.position.copy(startPosition)
        arrivedRef.current = false
    }, [startPosition])

    useEffect(() => {
        arrivedRef.current = false
    }, [targetPosition, walking])

    useFrame((_, delta) => {
        const group = groupRef.current

        if (!group) return

        const target = targetPosition
            ? new THREE.Vector3(...targetPosition)
            : startPosition
        const distance = group.position.distanceTo(target)

        if (walking && distance > ARRIVAL_DISTANCE) {
            const step = Math.min(distance, WALK_SPEED * delta)
            const direction = target.clone().sub(group.position).normalize()

            group.position.addScaledVector(direction, step)
            group.rotation.y = Math.atan2(direction.x, direction.z)
            group.position.y = target.y + Math.sin(Date.now() * 0.012) * 0.012

            return
        }

        group.position.lerp(target, 0.18)
        group.position.y = target.y + Math.sin(Date.now() * 0.003) * 0.01

        if (walking && !arrivedRef.current && distance <= ARRIVAL_DISTANCE) {
            arrivedRef.current = true
            onArrive?.()
        }
    })

    return (
        <group ref={groupRef} position={position} scale={0.28}>
            <LabKidModel
                animation={walking ? "walk" : "idle"}
                emote={walking ? "happy" : "normal"}
                position={[-0.32, 0.78, 0]}
                scale={1}
                variant="boy"
            />
        </group>
    )
}
