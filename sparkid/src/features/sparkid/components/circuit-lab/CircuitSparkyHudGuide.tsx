"use client"

import * as THREE from "three"
import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Hud, OrthographicCamera } from "@react-three/drei"

import RobotMascot, {
    type SparkyAnimation,
    type SparkyMood,
} from "@/features/sparkid/components/sparky/RobotMascot"

type CircuitSparkyHudGuideProps = {
    mood: SparkyMood
    animation?: SparkyAnimation
}

const HUD_ZOOM = 100
const PANEL_SIZE = 176
const PANEL_RIGHT = 500
const PANEL_BOTTOM = 16

function SparkyHudRobot({
                            mood,
                            animation,
                        }: {
    mood: SparkyMood
    animation: SparkyAnimation
}) {
    const groupRef = useRef<THREE.Group>(null)
    const { size } = useThree()

    const targetPosition = useMemo(() => new THREE.Vector3(), [])

    useEffect(() => {
        if (!groupRef.current) return

        groupRef.current.traverse((object) => {
            object.raycast = () => null
        })
    }, [])

    useFrame(() => {
        if (!groupRef.current) return

        const rightOffset =
            size.width >= 1280 ? PANEL_RIGHT : Math.min(480, size.width * 0.38)

        const x =
            size.width / (2 * HUD_ZOOM) -
            (rightOffset + PANEL_SIZE / 2) / HUD_ZOOM
        const y =
            -size.height / (2 * HUD_ZOOM) +
            (PANEL_BOTTOM + PANEL_SIZE / 2) / HUD_ZOOM

        targetPosition.set(x, y, 0)
        groupRef.current.position.lerp(targetPosition, 0.18)
    })

    return (
        <group ref={groupRef} name="CircuitSparkyHudGuide">
            <RobotMascot
                scale={0.46}
                mood={mood}
                animation={animation}
                showEmoteBubble
                emoteBubblePosition={[0.62, 0.72, 0]}
                emoteBubbleScale={0.22}
                emoteBubbleSide="right"
                emoteBubbleBillboard={false}
            />
        </group>
    )
}

export default function CircuitSparkyHudGuide({
                                                  mood,
                                                  animation = "talk",
                                              }: CircuitSparkyHudGuideProps) {
    return (
        <Hud renderPriority={1}>
            <OrthographicCamera
                makeDefault
                position={[0, 0, 10]}
                zoom={HUD_ZOOM}
                near={0.1}
                far={50}
            />
            <ambientLight intensity={1.1} />
            <directionalLight
                position={[2.8, 3.4, 4.2]}
                intensity={2.15}
                color="#fff1d0"
            />
            <pointLight
                position={[-1.8, 1.6, 2.2]}
                color="#35E5F2"
                intensity={0.85}
                distance={5}
            />
            <SparkyHudRobot mood={mood} animation={animation} />
        </Hud>
    )
}
