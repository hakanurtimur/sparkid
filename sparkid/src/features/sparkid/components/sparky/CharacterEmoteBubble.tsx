import * as THREE from "three";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

type Vec3 = [number, number, number];

export type CharacterEmoteBubbleType =
    | "question"
    | "dots"
    | "alert"
    | "star"
    | "success"
    | "idea"
    | "heart"
    | "energy"
    | "custom";

export type CharacterEmoteBubbleProps = {
    type?: CharacterEmoteBubbleType;
    customText?: string;

    position?: Vec3;
    scale?: number;
    side?: "left" | "right";

    bubbleColor?: string;
    accentColor?: string;
    textColor?: string;

    floating?: boolean;
    floatAmplitude?: number;
    floatSpeed?: number;
    rotationAmount?: number;
    pulse?: boolean;

    billboard?: boolean;
    visible?: boolean;
};

const DEFAULT_ICON_MAP: Record<
    Exclude<CharacterEmoteBubbleType, "dots" | "custom">,
    string
> = {
    question: "?",
    alert: "!",
    star: "★",
    success: "✓",
    idea: "?",
    heart: "♥",
    energy: "⚡",
};

export default function CharacterEmoteBubble({
                                                 type = "question",
                                                 customText,

                                                 position = [1.18, 0.72, 0.82],
                                                 scale = 1,
                                                 side = "right",

                                                 bubbleColor = "#fffaf2",
                                                 accentColor = "#22d3ee",
                                                 textColor,

                                                 floating = true,
                                                 floatAmplitude = 0.035,
                                                 floatSpeed = 2.1,
                                                 rotationAmount = 0.045,
                                                 pulse = true,

                                                 billboard = false,
                                                 visible = true,
                                             }: CharacterEmoteBubbleProps) {
    const outerRef = useRef<THREE.Group>(null);
    const innerRef = useRef<THREE.Group>(null);

    const icon = useMemo(() => {
        if (type === "custom") return customText ?? "?";
        if (type === "dots") return "";
        return DEFAULT_ICON_MAP[type];
    }, [type, customText]);

    const finalTextColor = textColor ?? accentColor;
    const tailDirection = side === "right" ? -1 : 1;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const outer = outerRef.current;
        const inner = innerRef.current;

        if (!outer || !inner) return;

        const targetY =
            position[1] + (floating ? Math.sin(t * floatSpeed) * floatAmplitude : 0);

        outer.position.x = THREE.MathUtils.lerp(outer.position.x, position[0], 0.16);
        outer.position.y = THREE.MathUtils.lerp(outer.position.y, targetY, 0.16);
        outer.position.z = THREE.MathUtils.lerp(outer.position.z, position[2], 0.16);

        inner.rotation.z = Math.sin(t * 1.7) * rotationAmount;

        const pulseScale = pulse ? 1 + Math.sin(t * 2.6) * 0.025 : 1;
        inner.scale.setScalar(pulseScale);
    });

    if (!visible) return null;

    return (
        <group ref={outerRef} position={position} scale={scale}>
            <Billboard follow={billboard}>
                <group ref={innerRef}>
                    {/* Main bubble */}
                    <mesh castShadow>
                        <sphereGeometry args={[0.2, 36, 18]} />
                        <meshStandardMaterial
                            color={bubbleColor}
                            roughness={0.38}
                            metalness={0}
                        />
                    </mesh>

                    {/* Soft rim */}
                    <mesh scale={[1.04, 1.04, 1.04]}>
                        <sphereGeometry args={[0.2, 36, 18]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.18}
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>

                    {/* Tail bubbles */}
                    <mesh
                        position={[tailDirection * 0.15, -0.16, -0.01]}
                        scale={[0.055, 0.055, 0.055]}
                    >
                        <sphereGeometry args={[1, 18, 10]} />
                        <meshStandardMaterial color={bubbleColor} roughness={0.38} />
                    </mesh>

                    <mesh
                        position={[tailDirection * 0.27, -0.27, -0.015]}
                        scale={[0.032, 0.032, 0.032]}
                    >
                        <sphereGeometry args={[1, 18, 10]} />
                        <meshStandardMaterial color={bubbleColor} roughness={0.38} />
                    </mesh>

                    {type === "dots" ? (
                        <>
                            <mesh position={[-0.075, 0, 0.19]} scale={[0.027, 0.027, 0.027]}>
                                <sphereGeometry args={[1, 18, 10]} />
                                <meshBasicMaterial color={finalTextColor} toneMapped={false} />
                            </mesh>

                            <mesh position={[0, 0, 0.19]} scale={[0.027, 0.027, 0.027]}>
                                <sphereGeometry args={[1, 18, 10]} />
                                <meshBasicMaterial color={finalTextColor} toneMapped={false} />
                            </mesh>

                            <mesh position={[0.075, 0, 0.19]} scale={[0.027, 0.027, 0.027]}>
                                <sphereGeometry args={[1, 18, 10]} />
                                <meshBasicMaterial color={finalTextColor} toneMapped={false} />
                            </mesh>
                        </>
                    ) : (
                        <Text
                            position={[0, -0.008, 0.205]}
                            fontSize={type === "star" || type === "heart" ? 0.16 : 0.18}
                            color={finalTextColor}
                            anchorX="center"
                            anchorY="middle"
                            outlineWidth={0.003}
                            outlineColor="#ffffff"
                        >
                            {icon}
                        </Text>
                    )}

                    <pointLight
                        position={[0, 0, 0.25]}
                        color={finalTextColor}
                        intensity={0.25}
                        distance={0.8}
                    />
                </group>
            </Billboard>
        </group>
    );
}