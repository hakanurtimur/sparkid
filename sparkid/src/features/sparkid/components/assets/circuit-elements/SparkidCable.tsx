"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

type Vec3 = [number, number, number];

export type CableShape =
    | "straight"
    | "curved"
    | "u"
    | "s"
    | "loop"
    | "wavy"
    | "spiral"
    | "turn90"
    | "z";

export type CableConnectorType = "plug" | "socket";

type SparkidCableProps = {
    shape?: CableShape;
    active?: boolean;
    position?: Vec3;
    scale?: number;
    radius?: number;
    color?: string;
    energyColor?: string;
    startConnector?: CableConnectorType;
    endConnector?: CableConnectorType;
    showConnectors?: boolean;
};

const COLORS = {
    blue: "#2563EB",
    blueDark: "#174EA6",
    gold: "#F2B430",
    goldDark: "#A45A12",
    black: "#1F2937",
    energy: "#FFD84D",
};

function getCablePoints(shape: CableShape): THREE.Vector3[] {
    if (shape === "straight") {
        return [
            new THREE.Vector3(-1.45, 0, 0),
            new THREE.Vector3(1.45, 0, 0),
        ];
    }

    if (shape === "u") {
        return [
            new THREE.Vector3(-0.9, -0.5, 0),
            new THREE.Vector3(-0.9, 0.45, 0),
            new THREE.Vector3(-0.55, 0.95, 0),
            new THREE.Vector3(0, 1.12, 0),
            new THREE.Vector3(0.55, 0.95, 0),
            new THREE.Vector3(0.9, 0.45, 0),
            new THREE.Vector3(0.9, -0.5, 0),
        ];
    }

    if (shape === "s") {
        return [
            new THREE.Vector3(-1.25, -0.45, 0),
            new THREE.Vector3(-0.75, 0.55, 0),
            new THREE.Vector3(0, -0.35, 0),
            new THREE.Vector3(0.75, 0.55, 0),
            new THREE.Vector3(1.25, -0.35, 0),
        ];
    }

    if (shape === "loop") {
        return [
            new THREE.Vector3(-0.72, -0.58, 0),
            new THREE.Vector3(-1.05, 0.02, 0),
            new THREE.Vector3(-0.82, 0.72, 0),
            new THREE.Vector3(-0.25, 1.05, 0),
            new THREE.Vector3(0.25, 1.05, 0),
            new THREE.Vector3(0.82, 0.72, 0),
            new THREE.Vector3(1.05, 0.02, 0),
            new THREE.Vector3(0.72, -0.58, 0),
        ];
    }

    if (shape === "wavy") {
        return [
            new THREE.Vector3(-1.45, 0, 0),
            new THREE.Vector3(-1, 0.34, 0),
            new THREE.Vector3(-0.55, -0.32, 0),
            new THREE.Vector3(0, 0.28, 0),
            new THREE.Vector3(0.55, -0.32, 0),
            new THREE.Vector3(1, 0.34, 0),
            new THREE.Vector3(1.45, 0, 0),
        ];
    }

    if (shape === "spiral") {
        const points: THREE.Vector3[] = [];

        for (let i = 0; i <= 38; i++) {
            const t = i / 38;
            const angle = t * Math.PI * 5.4;
            const r = 0.36;

            points.push(
                new THREE.Vector3(
                    Math.sin(angle) * r,
                    -0.85 + t * 1.7,
                    Math.cos(angle) * r * 0.36
                )
            );
        }

        return points;
    }

    if (shape === "turn90") {
        return [
            new THREE.Vector3(0, -0.9, 0),
            new THREE.Vector3(0, -0.25, 0),
            new THREE.Vector3(0.25, 0.15, 0),
            new THREE.Vector3(0.9, 0.15, 0),
        ];
    }

    if (shape === "z") {
        return [
            new THREE.Vector3(-1.05, 0.5, 0),
            new THREE.Vector3(-0.35, 0.5, 0),
            new THREE.Vector3(0.35, -0.45, 0),
            new THREE.Vector3(1.05, -0.45, 0),
        ];
    }

    return [
        new THREE.Vector3(-1.35, -0.05, 0),
        new THREE.Vector3(-0.8, 0.45, 0),
        new THREE.Vector3(0, 0.55, 0),
        new THREE.Vector3(0.8, 0.45, 0),
        new THREE.Vector3(1.35, -0.05, 0),
    ];
}

function CableConnector({
                            position,
                            direction,
                            type,
                            cableColor,
                        }: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
    type: CableConnectorType;
    cableColor: string;
}) {
    const quaternion = useMemo(() => {
        const from = new THREE.Vector3(0, 1, 0);
        const to = direction.clone().normalize();

        return new THREE.Quaternion().setFromUnitVectors(from, to);
    }, [direction]);

    return (
        <group position={position} quaternion={quaternion}>
            {/* Blue flexible sleeve */}
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.18, 0.15, 0.24, 48]} />
                <meshStandardMaterial
                    color={cableColor}
                    roughness={0.34}
                    metalness={0.12}
                />
            </mesh>

            {/* Dark blue back lip */}
            <mesh castShadow receiveShadow position={[0, -0.03, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.055, 48]} />
                <meshStandardMaterial
                    color={COLORS.blueDark}
                    roughness={0.38}
                    metalness={0.1}
                />
            </mesh>

            {/* Gold collar */}
            <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.14, 64]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.22}
                    metalness={0.72}
                />
            </mesh>

            {/* Golden rim */}
            <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.18, 0.022, 16, 64]} />
                <meshStandardMaterial
                    color={COLORS.goldDark}
                    roughness={0.25}
                    metalness={0.68}
                />
            </mesh>

            <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.18, 0.022, 16, 64]} />
                <meshStandardMaterial
                    color={COLORS.goldDark}
                    roughness={0.25}
                    metalness={0.68}
                />
            </mesh>

            {type === "plug" ? (
                <>
                    {/* Male plug pin */}
                    <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                        <cylinderGeometry args={[0.075, 0.095, 0.28, 48]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>

                    <mesh castShadow receiveShadow position={[0, 0.66, 0]}>
                        <sphereGeometry args={[0.076, 32, 16]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>
                </>
            ) : (
                <>
                    {/* Female socket body */}
                    <mesh castShadow receiveShadow position={[0, 0.49, 0]}>
                        <cylinderGeometry args={[0.145, 0.17, 0.23, 48]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>

                    {/* Dark socket hole */}
                    <mesh position={[0, 0.615, 0]}>
                        <cylinderGeometry args={[0.078, 0.078, 0.018, 32]} />
                        <meshStandardMaterial
                            color={COLORS.black}
                            roughness={0.38}
                            metalness={0.2}
                        />
                    </mesh>

                    <mesh position={[0, 0.622, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[0.08, 0.012, 12, 32]} />
                        <meshStandardMaterial
                            color="#ffcf6a"
                            roughness={0.16}
                            metalness={0.72}
                        />
                    </mesh>
                </>
            )}

            {/* Tiny highlight */}
            <mesh position={[-0.055, 0.17, 0.15]} scale={[0.035, 0.075, 0.01]}>
                <sphereGeometry args={[1, 16, 8]} />
                <meshBasicMaterial color="#8cc4ff" transparent opacity={0.55} />
            </mesh>
        </group>
    );
}

function EnergyFlow({
                        curve,
                        radius,
                        color,
                    }: {
    curve: THREE.CatmullRomCurve3;
    radius: number;
    color: string;
}) {
    const particleRefs = useRef<THREE.Mesh[]>([]);
    const particleCount = 11;

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        for (let i = 0; i < particleCount; i++) {
            const mesh = particleRefs.current[i];
            if (!mesh) continue;

            const progress = (t * 0.42 + i / particleCount) % 1;
            const point = curve.getPointAt(progress);

            mesh.position.set(point.x, point.y, point.z + radius * 1.45);

            const pulse = 0.75 + Math.sin(t * 8 + i) * 0.22;
            mesh.scale.setScalar(pulse);
        }
    });

    return (
        <group>
            {Array.from({ length: particleCount }).map((_, index) => (
                <mesh
                    key={index}
                    ref={(mesh) => {
                        if (mesh) particleRefs.current[index] = mesh;
                    }}
                >
                    <sphereGeometry args={[radius * 0.28, 16, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={0.95} />
                </mesh>
            ))}
        </group>
    );
}

export default function SparkidCable({
                                         shape = "curved",
                                         active = false,
                                         position = [0, 0, 0],
                                         scale = 1,
                                         radius = 0.095,
                                         color = COLORS.blue,
                                         energyColor = COLORS.energy,
                                         startConnector = "socket",
                                         endConnector = "plug",
                                         showConnectors = true,
                                     }: SparkidCableProps) {
    const points = useMemo(() => getCablePoints(shape), [shape]);

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.45);
    }, [points]);

    const startPoint = useMemo(() => curve.getPointAt(0), [curve]);
    const endPoint = useMemo(() => curve.getPointAt(1), [curve]);

    const startDirection = useMemo(() => {
        return curve.getTangentAt(0.001).multiplyScalar(-1).normalize();
    }, [curve]);

    const endDirection = useMemo(() => {
        return curve.getTangentAt(0.999).normalize();
    }, [curve]);

    return (
        <group position={position} scale={scale}>
            {/* Main cable body */}
            <mesh castShadow receiveShadow>
                <tubeGeometry args={[curve, 72, radius, 12, false]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.12}
                    emissive={active ? color : "#000000"}
                    emissiveIntensity={active ? 0.12 : 0}
                />
            </mesh>

            {/* Front glossy highlight strip */}
            <mesh position={[0, 0, radius * 0.9]}>
                <tubeGeometry args={[curve, 72, radius * 0.18, 8, false]} />
                <meshBasicMaterial color="#7bb9ff" transparent opacity={0.38} />
            </mesh>

            {active && (
                <>
                    <EnergyFlow curve={curve} radius={radius} color={energyColor} />

                    <pointLight
                        position={[0, 0.2, 0.8]}
                        color={energyColor}
                        intensity={0.8}
                        distance={3.5}
                        decay={2}
                    />
                </>
            )}

            {showConnectors && (
                <>
                    <CableConnector
                        position={startPoint}
                        direction={startDirection}
                        type={startConnector}
                        cableColor={color}
                    />

                    <CableConnector
                        position={endPoint}
                        direction={endDirection}
                        type={endConnector}
                        cableColor={color}
                    />
                </>
            )}
        </group>
    );
}
