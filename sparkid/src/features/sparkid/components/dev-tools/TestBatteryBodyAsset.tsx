"use client"

import * as THREE from "three"
import { useRef } from "react"

export const TEST_BATTERY_BODY_NODE_NAME = "TestBatteryBody"

function TestFrontBodyHighlight() {
    return (
        <group>
            <mesh position={[-0.28, 0.05, 0.735]} scale={[0.055, 0.58, 0.008]}>
                <sphereGeometry args={[1, 24, 12]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.16}
                    roughness={0.2}
                    metalness={0}
                    depthWrite={false}
                />
            </mesh>

            <mesh position={[0.32, -0.18, 0.728]} scale={[0.03, 0.28, 0.006]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.09}
                    roughness={0.2}
                    metalness={0}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

function TestBatteryShell() {
    return (
        <>
            <mesh castShadow receiveShadow position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.72, 0.72, 1.68, 96]} />
                <meshStandardMaterial color="#1688e8" roughness={0.31} metalness={0.08} />
            </mesh>

            <TestFrontBodyHighlight />

            <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
                <cylinderGeometry args={[0.735, 0.735, 0.46, 96]} />
                <meshStandardMaterial color="#ffc20f" roughness={0.27} metalness={0.08} />
            </mesh>

            <mesh castShadow receiveShadow position={[0, -1.24, 0]}>
                <cylinderGeometry args={[0.735, 0.735, 0.42, 96]} />
                <meshStandardMaterial color="#0d2a4a" roughness={0.5} metalness={0.18} />
            </mesh>

            <mesh position={[0, 0.59, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.722, 0.012, 12, 96]} />
                <meshStandardMaterial color="#0b4d8b" roughness={0.32} metalness={0.18} />
            </mesh>

            <mesh position={[0, -1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.722, 0.012, 12, 96]} />
                <meshStandardMaterial color="#08213d" roughness={0.45} metalness={0.18} />
            </mesh>

            <mesh position={[0, 1.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.63, 0.035, 16, 96]} />
                <meshStandardMaterial color="#ffcf22" roughness={0.25} metalness={0.1} />
            </mesh>

            <mesh castShadow receiveShadow position={[0, 1.12, 0]}>
                <cylinderGeometry args={[0.39, 0.42, 0.09, 80]} />
                <meshStandardMaterial color="#d8d0c5" roughness={0.2} metalness={0.72} />
            </mesh>

            <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.31, 0.34, 0.08, 80]} />
                <meshStandardMaterial color="#f0ebe2" roughness={0.18} metalness={0.78} />
            </mesh>

            <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
                <cylinderGeometry args={[0.22, 0.25, 0.14, 80]} />
                <meshStandardMaterial color="#8f867c" roughness={0.16} metalness={0.86} />
            </mesh>

            <mesh castShadow receiveShadow position={[0, 1.385, 0]}>
                <cylinderGeometry args={[0.17, 0.18, 0.025, 64]} />
                <meshStandardMaterial color="#fff8ef" roughness={0.14} metalness={0.92} />
            </mesh>

            <mesh position={[0, -1.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.5, 0.04, 16, 80]} />
                <meshStandardMaterial color="#07182c" roughness={0.6} metalness={0.1} />
            </mesh>
        </>
    )
}

type TestBatteryBodyAssetProps = {
    position?: [number, number, number]
    scale?: number
}

export default function TestBatteryBodyAsset({
                                                 position = [0, 0, 0],
                                                 scale = 1,
                                             }: TestBatteryBodyAssetProps) {
    const bodyRef = useRef<THREE.Group>(null)

    return (
        <group position={position} scale={[scale, scale, scale]}>
            <group ref={bodyRef} name={TEST_BATTERY_BODY_NODE_NAME}>
                <TestBatteryShell />
            </group>
        </group>
    )
}