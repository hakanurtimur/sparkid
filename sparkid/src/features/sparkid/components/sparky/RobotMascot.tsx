import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import CharacterEmoteBubble, {
    type CharacterEmoteBubbleType,
} from "./CharacterEmoteBubble";

type Vec3 = [number, number, number];

export type SparkyMood =
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy";

export type SparkyAnimation =
    | "hover"
    | "bob"
    | "rotate"
    | "excited"
    | "talk";

export type SparkyRobotProps = {
    position?: Vec3;
    scale?: number;
    mood?: SparkyMood;
    animation?: SparkyAnimation;
    followPointer?: boolean;
    showBackDetails?: boolean;

    /**
     * Eski prop. Geriye uyumluluk için duruyor.
     */
    showSpeechBubble?: boolean;

    /**
     * Yeni generic emote bubble kontrolü.
     */
    showEmoteBubble?: boolean;
    emoteBubblePosition?: Vec3;
    emoteBubbleScale?: number;
    emoteBubbleSide?: "left" | "right";
    emoteBubbleBillboard?: boolean;
};

const COLORS = {
    shell: "#f7efe6",
    shellShadow: "#d8c8b9",
    panelBlue: "#2563be",
    panelBlueDark: "#12345f",
    screen: "#020617",
    cyan: "#22d3ee",
    cyanSoft: "#67e8f9",
    warning: "#f59e0b",
    success: "#a3e635",
    metal: "#94a3b8",
};

type MoodConfig = {
    eyeColor: string;
    eyeOpen: number;
    eyeWidth: number;
    mouth: "smile" | "sad" | "o" | "flat";
    brow: "normal" | "sad" | "angry" | "closed";
    bubble?: CharacterEmoteBubbleType;
    sparkles?: boolean;
};

const MOODS: Record<SparkyMood, MoodConfig> = {
    idle: {
        eyeColor: COLORS.cyan,
        eyeOpen: 1,
        eyeWidth: 0.085,
        mouth: "smile",
        brow: "normal",
    },

    happy: {
        eyeColor: COLORS.cyan,
        eyeOpen: 1.05,
        eyeWidth: 0.09,
        mouth: "smile",
        brow: "normal",
        sparkles: false,
    },

    thinking: {
        eyeColor: COLORS.cyan,
        eyeOpen: 0.88,
        eyeWidth: 0.082,
        mouth: "sad",
        brow: "sad",
        bubble: "question",
    },

    warning: {
        eyeColor: COLORS.warning,
        eyeOpen: 0.9,
        eyeWidth: 0.082,
        mouth: "sad",
        brow: "angry",
        bubble: "alert",
    },

    success: {
        eyeColor: COLORS.success,
        eyeOpen: 1.08,
        eyeWidth: 0.09,
        mouth: "smile",
        brow: "normal",
        bubble: "star",
        sparkles: true,
    },

    talking: {
        eyeColor: COLORS.cyan,
        eyeOpen: 0.42,
        eyeWidth: 0.09,
        mouth: "smile",
        brow: "closed",
        bubble: "dots",
    },

    sleepy: {
        eyeColor: COLORS.cyan,
        eyeOpen: 0.22,
        eyeWidth: 0.09,
        mouth: "flat",
        brow: "closed",
    },
};

function GlowMaterial({ color }: { color: string }) {
    return <meshBasicMaterial color={color} toneMapped={false} />;
}

function Eye({
                 side,
                 color,
             }: {
    side: -1 | 1;
    color: string;
}) {
    return (
        <group position={[side * 0.23, 0.03, 0.027]}>
            <mesh scale={[0.085, 0.14, 0.025]}>
                <sphereGeometry args={[1, 32, 16]} />
                <GlowMaterial color={color} />
            </mesh>

            <pointLight
                position={[0, 0, 0.08]}
                color={color}
                intensity={0.65}
                distance={0.8}
            />
        </group>
    );
}

function Brow({
                  side,
                  type,
                  color,
              }: {
    side: -1 | 1;
    type: MoodConfig["brow"];
    color: string;
}) {
    let y = 0.22;
    let tilt = side * -0.12;

    if (type === "sad") {
        tilt = side * 0.28;
    }

    if (type === "angry") {
        y = 0.205;
        tilt = side * 0.34;
    }

    if (type === "closed") {
        y = 0.04;
        tilt = side * -0.06;
    }

    return (
        <group position={[side * 0.23, y, 0.03]} rotation={[0, 0, tilt]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.012, 0.012, 0.14, 16]} />
                <GlowMaterial color={color} />
            </mesh>
        </group>
    );
}

function Mouth({
                   type,
                   color,
               }: {
    type: MoodConfig["mouth"];
    color: string;
}) {
    const curve = useMemo(() => {
        let controlY = -0.09;

        if (type === "sad") controlY = 0.07;
        if (type === "flat") controlY = 0;

        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.15, 0, 0),
            new THREE.Vector3(0, controlY, 0),
            new THREE.Vector3(0.15, 0, 0)
        );
    }, [type]);

    if (type === "o") {
        return (
            <mesh position={[0, -0.16, 0.035]}>
                <torusGeometry args={[0.065, 0.014, 16, 48]} />
                <GlowMaterial color={color} />
            </mesh>
        );
    }

    return (
        <mesh position={[0, -0.15, 0.035]}>
            <tubeGeometry args={[curve, 36, 0.014, 10, false]} />
            <GlowMaterial color={color} />
        </mesh>
    );
}

function VisorFace({ mood }: { mood: SparkyMood }) {
    const groupRef = useRef<THREE.Group>(null);
    const leftEyeRef = useRef<THREE.Group>(null);
    const rightEyeRef = useRef<THREE.Group>(null);
    const mouthRef = useRef<THREE.Group>(null);

    const nextBlink = useRef(1.5);
    const blinkStart = useRef(-10);

    const config = MOODS[mood];

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        const group = groupRef.current;
        const leftEye = leftEyeRef.current;
        const rightEye = rightEyeRef.current;
        const mouth = mouthRef.current;

        if (!group || !leftEye || !rightEye || !mouth) return;

        let blinkPower = 0;

        if (mood !== "warning" && mood !== "success" && mood !== "sleepy") {
            if (t > nextBlink.current) {
                blinkStart.current = t;
                nextBlink.current = t + THREE.MathUtils.randFloat(2.3, 5.4);
            }

            const elapsed = t - blinkStart.current;

            if (elapsed >= 0 && elapsed <= 0.16) {
                blinkPower = Math.sin((elapsed / 0.16) * Math.PI);
            }
        }

        const talkPulse =
            mood === "talking"
                ? 1 + Math.sin(t * 10) * 0.25
                : 1 + Math.sin(t * 2.2) * 0.025;

        const eyeY = THREE.MathUtils.clamp(
            config.eyeOpen * (1 - blinkPower * 0.92),
            0.055,
            1.3
        );

        leftEye.scale.y = THREE.MathUtils.lerp(leftEye.scale.y, eyeY, 0.32);
        rightEye.scale.y = THREE.MathUtils.lerp(rightEye.scale.y, eyeY, 0.32);

        leftEye.scale.x = THREE.MathUtils.lerp(
            leftEye.scale.x,
            config.eyeWidth / 0.085,
            0.2
        );

        rightEye.scale.x = THREE.MathUtils.lerp(
            rightEye.scale.x,
            config.eyeWidth / 0.085,
            0.2
        );

        mouth.scale.y = THREE.MathUtils.lerp(mouth.scale.y, talkPulse, 0.2);

        group.position.y = THREE.MathUtils.lerp(
            group.position.y,
            mood === "success" ? 0.025 : mood === "thinking" ? -0.01 : 0,
            0.08
        );
    });

    return (
        <group ref={groupRef} position={[0, 0.045, 1.04]}>
            <group ref={leftEyeRef}>
                <Eye side={-1} color={config.eyeColor} />
            </group>

            <group ref={rightEyeRef}>
                <Eye side={1} color={config.eyeColor} />
            </group>

            <Brow side={-1} type={config.brow} color={config.eyeColor} />
            <Brow side={1} type={config.brow} color={config.eyeColor} />

            <group ref={mouthRef}>
                <Mouth type={config.mouth} color={config.eyeColor} />
            </group>
        </group>
    );
}

function SidePanel({ side }: { side: -1 | 1 }) {
    return (
        <group position={[side * 0.92, -0.02, 0]}>
            <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.285, 0.285, 0.17, 64]} />
                <meshStandardMaterial
                    color={COLORS.panelBlueDark}
                    roughness={0.32}
                    metalness={0.35}
                />
            </mesh>

            <mesh
                castShadow
                receiveShadow
                position={[side * 0.055, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
            >
                <cylinderGeometry args={[0.22, 0.22, 0.06, 64]} />
                <meshPhysicalMaterial
                    color={COLORS.panelBlue}
                    roughness={0.2}
                    metalness={0.35}
                    clearcoat={0.8}
                    clearcoatRoughness={0.12}
                />
            </mesh>

            <mesh
                position={[side * 0.095, 0.07, 0.07]}
                scale={[0.04, 0.035, 0.012]}
            >
                <sphereGeometry args={[1, 16, 8]} />
                <meshBasicMaterial
                    color="white"
                    transparent
                    opacity={0.18}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

function BackPanel() {
    return (
        <group position={[0, 0, -1.012]}>
            <mesh scale={[0.43, 0.43, 0.014]}>
                <sphereGeometry args={[1, 48, 18]} />
                <meshStandardMaterial
                    color={COLORS.shell}
                    roughness={0.42}
                    metalness={0.04}
                />
            </mesh>

            <mesh>
                <torusGeometry args={[0.43, 0.006, 10, 96]} />
                <meshStandardMaterial color={COLORS.shellShadow} roughness={0.55} />
            </mesh>

            <mesh>
                <torusGeometry args={[0.29, 0.004, 10, 96]} />
                <meshStandardMaterial color="#e5d8ca" roughness={0.55} />
            </mesh>

            <mesh position={[0, -0.62, 0]}>
                <boxGeometry args={[0.012, 0.42, 0.008]} />
                <meshStandardMaterial color="#cdbdad" roughness={0.6} />
            </mesh>
        </group>
    );
}

function Antenna({ mood }: { mood: SparkyMood }) {
    const orbRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const color = MOODS[mood].eyeColor;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const orb = orbRef.current;
        const light = lightRef.current;

        if (!orb || !light) return;

        const speed = mood === "talking" ? 8 : mood === "warning" ? 5 : 2.6;
        const pulse = 1 + Math.sin(t * speed) * 0.09;

        orb.scale.setScalar(0.115 * pulse);
        light.intensity = 1.1 + Math.sin(t * speed) * 0.45;
    });

    return (
        <group>
            <mesh castShadow position={[0, 1.015, 0]} scale={[0.13, 0.045, 0.13]}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshStandardMaterial
                    color="#1e3a5f"
                    roughness={0.26}
                    metalness={0.55}
                />
            </mesh>

            <mesh castShadow position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.023, 0.023, 0.42, 24]} />
                <meshStandardMaterial
                    color="#1e293b"
                    roughness={0.22}
                    metalness={0.65}
                />
            </mesh>

            <mesh ref={orbRef} castShadow position={[0, 1.52, 0]}>
                <sphereGeometry args={[1, 32, 16]} />
                <GlowMaterial color={color} />
            </mesh>

            <pointLight
                ref={lightRef}
                position={[0, 1.52, 0]}
                color={color}
                intensity={1.4}
                distance={1.6}
            />
        </group>
    );
}

function HoverJet({ mood }: { mood: SparkyMood }) {
    const groupRef = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const color = MOODS[mood].eyeColor;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const group = groupRef.current;
        const light = lightRef.current;

        if (!group || !light) return;

        const speed = mood === "success" ? 8 : mood === "warning" ? 7 : 5.5;
        const pulse = 1 + Math.sin(t * speed) * 0.14;

        group.scale.set(pulse, 1 + Math.sin(t * speed + 0.5) * 0.2, pulse);

        light.intensity = 1.8 + Math.sin(t * speed) * 0.6;
    });

    return (
        <group ref={groupRef} position={[0, -0.96, 0]}>
            <pointLight
                ref={lightRef}
                position={[0, -0.16, 0]}
                color={color}
                intensity={2}
                distance={1.8}
            />

            <mesh position={[0, 0.02, 0]} scale={[0.34, 0.11, 0.34]}>
                <sphereGeometry args={[1, 32, 12]} />
                <meshStandardMaterial
                    color={COLORS.panelBlue}
                    roughness={0.2}
                    metalness={0.45}
                />
            </mesh>

            <mesh position={[0, -0.12, 0]} scale={[0.25, 0.22, 0.25]}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.32}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
                <coneGeometry args={[0.18, 0.48, 48, 1, true]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.78}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.28, 0.012, 12, 80]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.55}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

function SuccessSparkles({ enabled }: { enabled: boolean }) {
    if (!enabled) return null;

    return (
        <Sparkles
            count={20}
            position={[0, 0.35, 0.9]}
            scale={[1.4, 0.8, 0.6]}
            size={3.5}
            speed={0.75}
            color="#facc15"
        />
    );
}

export default function SparkyRobot({
                                        position = [0, 0, 0],
                                        scale = 1,
                                        mood = "idle",
                                        animation = "hover",
                                        followPointer = true,
                                        showBackDetails = true,

                                        showSpeechBubble = true,
                                        showEmoteBubble,
                                        emoteBubblePosition = [1.25, 0.86, 0.82],
                                        emoteBubbleScale = 1,
                                        emoteBubbleSide = "right",
                                        emoteBubbleBillboard = false,
                                    }: SparkyRobotProps) {
    const rootRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);

    const config = MOODS[mood];

    const shouldShowEmoteBubble = showEmoteBubble ?? showSpeechBubble;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const body = bodyRef.current;

        if (!body) return;

        const pointerX = followPointer ? state.pointer.x : 0;
        const pointerY = followPointer ? state.pointer.y : 0;

        let hoverY = Math.sin(t * 1.6) * 0.045;
        let rotZ = Math.sin(t * 1.2) * 0.025;
        let rotY = pointerX * 0.16;
        const rotX = -pointerY * 0.08;

        if (animation === "bob") {
            hoverY = Math.sin(t * 2.4) * 0.065;
            rotZ = Math.sin(t * 1.8) * 0.035;
        }

        if (animation === "rotate") {
            hoverY = Math.sin(t * 1.3) * 0.035;
            rotY = Math.sin(t * 0.9) * 0.6;
        }

        if (animation === "excited") {
            hoverY = Math.abs(Math.sin(t * 5.2)) * 0.11;
            rotZ = Math.sin(t * 7.5) * 0.08;
        }

        if (animation === "talk") {
            hoverY = Math.sin(t * 3.4) * 0.05;
            rotZ = Math.sin(t * 5.5) * 0.035;
        }

        body.position.y = THREE.MathUtils.lerp(body.position.y, hoverY, 0.08);
        body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, rotX, 0.07);
        body.rotation.y = THREE.MathUtils.lerp(body.rotation.y, rotY, 0.07);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, rotZ, 0.07);
    });

    return (
        <group ref={rootRef} position={position} scale={scale}>
            <group ref={bodyRef}>
                {/* Ana krem gövde */}
                <mesh castShadow receiveShadow>
                    <sphereGeometry args={[1, 96, 64]} />
                    <meshPhysicalMaterial
                        color={COLORS.shell}
                        roughness={0.32}
                        metalness={0.04}
                        clearcoat={0.95}
                        clearcoatRoughness={0.13}
                    />
                </mesh>

                {/* Gövde alt seam */}
                <mesh position={[0, -0.64, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.7, 0.006, 10, 128]} />
                    <meshStandardMaterial color={COLORS.shellShadow} roughness={0.55} />
                </mesh>

                {/* Hafif dikey arka/yan seam */}
                <mesh position={[0, 0, -0.995]}>
                    <boxGeometry args={[0.012, 1.35, 0.008]} />
                    <meshStandardMaterial color="#d2c2b4" roughness={0.55} />
                </mesh>

                {showBackDetails && <BackPanel />}

                {/* Yan kulak/panel */}
                <SidePanel side={-1} />
                <SidePanel side={1} />

                {/* Siyah visor rim */}
                <mesh position={[0, 0.055, 0.925]} scale={[0.76, 0.5, 0.09]}>
                    <sphereGeometry args={[1, 72, 32]} />
                    <meshStandardMaterial
                        color="#111827"
                        roughness={0.16}
                        metalness={0.28}
                    />
                </mesh>

                {/* Parlak ekran */}
                <mesh position={[0, 0.055, 0.982]} scale={[0.69, 0.43, 0.065]}>
                    <sphereGeometry args={[1, 72, 32]} />
                    <meshPhysicalMaterial
                        color={COLORS.screen}
                        roughness={0.08}
                        metalness={0.14}
                        clearcoat={1}
                        clearcoatRoughness={0.025}
                        emissive="#031b23"
                        emissiveIntensity={0.7}
                    />
                </mesh>

                {/* Ekran cam yansıması */}
                <mesh position={[-0.18, 0.29, 1.035]} scale={[0.31, 0.075, 0.012]}>
                    <sphereGeometry args={[1, 32, 12]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        transparent
                        opacity={0.12}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                <VisorFace mood={mood} />

                <Antenna mood={mood} />

                <HoverJet mood={mood} />

                <SuccessSparkles enabled={Boolean(config.sparkles)} />
            </group>

            {/* Generic emote bubble.
          BodyRef dışında duruyor; böylece robot dönünce yüzüne yapışmıyor. */}
            {shouldShowEmoteBubble && config.bubble && (
                <CharacterEmoteBubble
                    type={config.bubble}
                    position={emoteBubblePosition}
                    scale={emoteBubbleScale}
                    side={emoteBubbleSide}
                    accentColor={config.eyeColor}
                    billboard={emoteBubbleBillboard}
                />
            )}
        </group>
    );
}