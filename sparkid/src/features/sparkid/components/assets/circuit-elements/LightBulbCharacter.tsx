import * as THREE from "three";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {ReactNode, useMemo, useRef} from "react";
import CharacterEmoteBubble, {
    type CharacterEmoteBubbleType,
} from "@/features/sparkid/components/sparky/CharacterEmoteBubble";

type Vec3 = [number, number, number];

export type LightBulbMood =
    | "off"
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy";

export type LightBulbAnimation =
    | "hover"
    | "bob"
    | "rotate"
    | "excited"
    | "talk";

export type LightBulbCharacterProps = {
    position?: Vec3;
    scale?: number;
    mood?: LightBulbMood;
    animation?: LightBulbAnimation;
    followPointer?: boolean;

    showEmoteBubble?: boolean;
    emoteBubblePosition?: Vec3;
    emoteBubbleScale?: number;
    emoteBubbleSide?: "left" | "right";
    emoteBubbleBillboard?: boolean;
    children?: ReactNode;

    bodyNodeName?: string;
    disableRuntimeAnimation?: boolean;
};

const COLORS = {
    glass: "#fff7db",
    glassOff: "#dbe4ea",
    warmLight: "#ffd966",
    hotLight: "#ffb020",
    warning: "#f59e0b",
    success: "#a3e635",

    face: "#3b210b",
    cheek: "#ff8b5c",

    cream: "#f6e8c6",
    creamShadow: "#d6b982",

    blue: "#2563be",
    blueDark: "#12345f",

    metal: "#c0c4cc",
    metalDark: "#4b5563",
    gold: "#f2b430",
};

type MouthType = "smile" | "sad" | "flat" | "open" | "o";
type BrowType = "normal" | "sad" | "angry" | "closed";

type MoodConfig = {
    lightColor: string;
    faceColor: string;
    glassColor: string;
    glowIntensity: number;
    glowOpacity: number;
    filamentOpacity: number;
    eyeOpen: number;
    eyeWidth: number;
    mouth: MouthType;
    brow: BrowType;
    faceVisible: boolean;
    bubble?: CharacterEmoteBubbleType;
    sparkles?: boolean;
};

const MOODS: Record<LightBulbMood, MoodConfig> = {
    off: {
        lightColor: "#94a3b8",
        faceColor: "#94a3b8",
        glassColor: COLORS.glassOff,
        glowIntensity: 0.05,
        glowOpacity: 0.025,
        filamentOpacity: 0.15,
        eyeOpen: 0,
        eyeWidth: 0.08,
        mouth: "flat",
        brow: "closed",
        faceVisible: false,
    },

    idle: {
        lightColor: COLORS.warmLight,
        faceColor: COLORS.face,
        glassColor: COLORS.glass,
        glowIntensity: 1.5,
        glowOpacity: 0.22,
        filamentOpacity: 1,
        eyeOpen: 1,
        eyeWidth: 0.075,
        mouth: "smile",
        brow: "normal",
        faceVisible: true,
    },

    happy: {
        lightColor: "#ffd86b",
        faceColor: COLORS.face,
        glassColor: "#fff3c4",
        glowIntensity: 0.95,
        glowOpacity: 0.105,
        filamentOpacity: 1,
        eyeOpen: 1.08,
        eyeWidth: 0.08,
        mouth: "open",
        brow: "normal",
        faceVisible: true,
        bubble: undefined,
    },

    thinking: {
        lightColor: COLORS.warmLight,
        faceColor: COLORS.face,
        glassColor: COLORS.glass,
        glowIntensity: 1.15,
        glowOpacity: 0.18,
        filamentOpacity: 0.8,
        eyeOpen: 0.82,
        eyeWidth: 0.072,
        mouth: "sad",
        brow: "sad",
        faceVisible: true,
        bubble: "question",
    },

    warning: {
        lightColor: COLORS.warning,
        faceColor: "#7c2d12",
        glassColor: "#ffedd5",
        glowIntensity: 1.8,
        glowOpacity: 0.3,
        filamentOpacity: 1,
        eyeOpen: 0.85,
        eyeWidth: 0.075,
        mouth: "sad",
        brow: "angry",
        faceVisible: true,
        bubble: "alert",
    },

    success: {
        lightColor: COLORS.success,
        faceColor: "#365314",
        glassColor: "#ecfccb",
        glowIntensity: 2.1,
        glowOpacity: 0.3,
        filamentOpacity: 1,
        eyeOpen: 1.1,
        eyeWidth: 0.08,
        mouth: "smile",
        brow: "normal",
        faceVisible: true,
        bubble: "star",
        sparkles: true,
    },

    talking: {
        lightColor: COLORS.warmLight,
        faceColor: COLORS.face,
        glassColor: COLORS.glass,
        glowIntensity: 1.7,
        glowOpacity: 0.24,
        filamentOpacity: 1,
        eyeOpen: 0.95,
        eyeWidth: 0.076,
        mouth: "open",
        brow: "normal",
        faceVisible: true,
        bubble: "dots",
    },

    sleepy: {
        lightColor: COLORS.warmLight,
        faceColor: COLORS.face,
        glassColor: COLORS.glass,
        glowIntensity: 0.85,
        glowOpacity: 0.12,
        filamentOpacity: 0.55,
        eyeOpen: 0.25,
        eyeWidth: 0.08,
        mouth: "flat",
        brow: "closed",
        faceVisible: true,
    },
};

function BulbGlass({ mood }: { mood: LightBulbMood }) {
    const innerGlowRef = useRef<THREE.Mesh>(null);
    const glassWarmthRef = useRef<THREE.MeshStandardMaterial>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const config = MOODS[mood];
    const isOn = mood !== "off";
    const isHappy = mood === "happy" || mood === "success";

    const points = useMemo(() => {
        return [
            new THREE.Vector2(0.22, -0.48),
            new THREE.Vector2(0.32, -0.42),
            new THREE.Vector2(0.38, -0.28),
            new THREE.Vector2(0.47, -0.08),
            new THREE.Vector2(0.64, 0.22),
            new THREE.Vector2(0.7, 0.52),
            new THREE.Vector2(0.6, 0.82),
            new THREE.Vector2(0.38, 1.02),
            new THREE.Vector2(0.12, 1.1),
            new THREE.Vector2(0.02, 1.12),
        ];
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        const innerGlow = innerGlowRef.current;
        const light = lightRef.current;

        const basePulse = isOn
            ? 1 + Math.sin(t * (isHappy ? 2.4 : 1.8)) * 0.035
            : 1;

        if (innerGlow) {
            innerGlow.scale.setScalar(basePulse);
        }

        if (light) {
            light.intensity = THREE.MathUtils.lerp(
                light.intensity,
                config.glowIntensity * basePulse,
                0.08
            );
        }
    });

    return (
        <group>
            {/* Soft inner light core - küçük ve kontrollü */}
            <mesh
                ref={innerGlowRef}
                position={[0, 0.36, 0.03]}
                scale={[0.46, 0.62, 0.46]}
            >
                <sphereGeometry args={[1, 48, 24]} />
                <meshBasicMaterial
                    color={config.lightColor}
                    transparent
                    opacity={config.glowOpacity}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>

            {/* Real light source */}
            <pointLight
                ref={lightRef}
                position={[0, 0.3, 0.42]}
                color={config.lightColor}
                intensity={config.glowIntensity}
                distance={2.45}
                decay={2}
            />

            {/* Glass shell - daha temiz cam */}
            <mesh castShadow receiveShadow>
                <latheGeometry args={[points, 96]} />
                <meshPhysicalMaterial
                    ref={glassWarmthRef}
                    color={isOn ? config.glassColor : COLORS.glassOff}
                    roughness={0.08}
                    metalness={0}
                    transparent
                    opacity={isOn ? 0.32 : 0.24}
                    transmission={isOn ? 0.42 : 0.25}
                    thickness={0.32}
                    ior={1.36}
                    clearcoat={1}
                    clearcoatRoughness={0.045}
                    depthWrite={false}
                />
            </mesh>

            {/* Camın üst sıcak highlight'ı */}
            {isOn && (
                <mesh
                    position={[0.04, 0.58, 0.35]}
                    scale={[0.34, 0.42, 0.08]}
                >
                    <sphereGeometry args={[1, 32, 16]} />
                    <meshBasicMaterial
                        color={config.lightColor}
                        transparent
                        opacity={0.09}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {/* Glass highlight */}
            <mesh
                position={[0.28, 0.79, 0.53]}
                rotation={[0.25, -0.3, -0.35]}
                scale={[0.18, 0.055, 0.018]}
            >
                <sphereGeometry args={[1, 24, 12]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={isOn ? 0.62 : 0.42}
                    depthWrite={false}
                />
            </mesh>

            <mesh
                position={[0.46, 0.58, 0.49]}
                rotation={[0.2, -0.4, -0.25]}
                scale={[0.08, 0.025, 0.012]}
            >
                <sphereGeometry args={[1, 16, 8]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={isOn ? 0.38 : 0.22}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}

function Filament({ mood }: { mood: LightBulbMood }) {
    const groupRef = useRef<THREE.Group>(null);
    const config = MOODS[mood];

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.23, -0.23, 0.2),
            new THREE.Vector3(-0.2, -0.02, 0.24),
            new THREE.Vector3(-0.12, 0.18, 0.27),
            new THREE.Vector3(-0.04, -0.02, 0.28),
            new THREE.Vector3(0, 0.18, 0.29),
            new THREE.Vector3(0.04, -0.02, 0.28),
            new THREE.Vector3(0.12, 0.18, 0.27),
            new THREE.Vector3(0.2, -0.02, 0.24),
            new THREE.Vector3(0.23, -0.23, 0.2),
        ]);
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const group = groupRef.current;
        if (!group) return;

        const pulse =
            mood === "off" ? 1 : 1 + Math.sin(t * (mood === "talking" ? 9 : 3.2)) * 0.04;

        group.scale.setScalar(pulse);
    });

    return (
        <group ref={groupRef}>
            {/* Main filament */}
            <mesh>
                <tubeGeometry args={[curve, 80, 0.016, 10, false]} />
                <meshBasicMaterial
                    color={config.lightColor}
                    transparent
                    opacity={config.filamentOpacity}
                    toneMapped={false}
                />
            </mesh>

            {/* Warm filament halo */}
            {mood !== "off" && (
                <mesh>
                    <tubeGeometry args={[curve, 80, 0.045, 10, false]} />
                    <meshBasicMaterial
                        color={config.lightColor}
                        transparent
                        opacity={mood === "happy" ? 0.11 : 0.08}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {/* Support wires */}
            <mesh position={[-0.18, -0.38, 0.17]}>
                <cylinderGeometry args={[0.012, 0.012, 0.34, 16]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.22}
                    metalness={0.65}
                />
            </mesh>

            <mesh position={[0.18, -0.38, 0.17]}>
                <cylinderGeometry args={[0.012, 0.012, 0.34, 16]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.22}
                    metalness={0.65}
                />
            </mesh>

            <mesh position={[0, -0.54, 0.17]} scale={[0.16, 0.025, 0.04]}>
                <sphereGeometry args={[1, 24, 12]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.2}
                    metalness={0.65}
                />
            </mesh>
        </group>
    );
}

function FaceEye({
                     side,
                     color,
                 }: {
    side: -1 | 1;
    color: string;
}) {
    return (
        <group position={[side * 0.22, 0.02, 0.02]}>
            <mesh scale={[0.075, 0.115, 0.018]}>
                <sphereGeometry args={[1, 32, 16]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.25}
                    metalness={0.05}
                />
            </mesh>

            <mesh position={[0.025, 0.04, 0.018]} scale={[0.023, 0.034, 0.008]}>
                <sphereGeometry args={[1, 16, 8]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

function FaceBrow({
                      side,
                      type,
                      color,
                  }: {
    side: -1 | 1;
    type: BrowType;
    color: string;
}) {
    let y = 0.19;
    let tilt = side * -0.16;

    if (type === "sad") {
        tilt = side * 0.28;
        y = 0.17;
    }

    if (type === "angry") {
        tilt = side * 0.34;
        y = 0.16;
    }

    if (type === "closed") {
        y = 0.03;
        tilt = side * -0.05;
    }

    return (
        <group position={[side * 0.22, y, 0.03]} rotation={[0, 0, tilt]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.012, 0.012, 0.14, 16]} />
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
        </group>
    );
}

function FaceMouth({
                       type,
                       color,
                   }: {
    type: MouthType;
    color: string;
}) {
    const curve = useMemo(() => {
        let controlY = -0.075;

        if (type === "sad") controlY = 0.065;
        if (type === "flat") controlY = 0;

        return new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.13, 0, 0),
            new THREE.Vector3(0, controlY, 0),
            new THREE.Vector3(0.13, 0, 0)
        );
    }, [type]);

    const openShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.absellipse(0, 0, 0.07, 0.05, 0, Math.PI * 2, false, 0);
        return shape;
    }, []);

    if (type === "o") {
        return (
            <mesh position={[0, -0.14, 0.04]}>
                <torusGeometry args={[0.065, 0.012, 14, 48]} />
                <meshStandardMaterial color={color} roughness={0.35} />
            </mesh>
        );
    }

    if (type === "open") {
        return (
            <group position={[0, -0.14, 0.04]}>
                <mesh>
                    <shapeGeometry args={[openShape]} />
                    <meshStandardMaterial
                        color={color}
                        side={THREE.DoubleSide}
                        roughness={0.35}
                    />
                </mesh>

                <mesh position={[0, -0.018, 0.006]} scale={[0.055, 0.025, 0.008]}>
                    <sphereGeometry args={[1, 16, 8]} />
                    <meshStandardMaterial color="#ff6b5f" roughness={0.45} />
                </mesh>
            </group>
        );
    }

    return (
        <mesh position={[0, -0.14, 0.04]}>
            <tubeGeometry args={[curve, 36, 0.012, 10, false]} />
            <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
    );
}

function BulbFace({ mood }: { mood: LightBulbMood }) {
    const groupRef = useRef<THREE.Group>(null);
    const leftEyeRef = useRef<THREE.Group>(null);
    const rightEyeRef = useRef<THREE.Group>(null);
    const mouthRef = useRef<THREE.Group>(null);

    const nextBlink = useRef(1.4);
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

        if (
            config.faceVisible &&
            mood !== "warning" &&
            mood !== "success" &&
            mood !== "sleepy"
        ) {
            if (t > nextBlink.current) {
                blinkStart.current = t;
                nextBlink.current = t + THREE.MathUtils.randFloat(2.2, 5.2);
            }

            const elapsed = t - blinkStart.current;

            if (elapsed >= 0 && elapsed <= 0.16) {
                blinkPower = Math.sin((elapsed / 0.16) * Math.PI);
            }
        }

        const eyeY = THREE.MathUtils.clamp(
            config.eyeOpen * (1 - blinkPower * 0.92),
            0.05,
            1.25
        );

        leftEye.scale.y = THREE.MathUtils.lerp(leftEye.scale.y, eyeY, 0.32);
        rightEye.scale.y = THREE.MathUtils.lerp(rightEye.scale.y, eyeY, 0.32);

        leftEye.scale.x = THREE.MathUtils.lerp(
            leftEye.scale.x,
            config.eyeWidth / 0.075,
            0.2
        );

        rightEye.scale.x = THREE.MathUtils.lerp(
            rightEye.scale.x,
            config.eyeWidth / 0.075,
            0.2
        );

        const mouthPulse =
            mood === "talking"
                ? THREE.MathUtils.lerp(0.72, 1.35, (Math.sin(t * 10) + 1) / 2)
                : 1 + Math.sin(t * 2.2) * 0.02;

        mouth.scale.y = THREE.MathUtils.lerp(mouth.scale.y, mouthPulse, 0.2);

        group.position.y = THREE.MathUtils.lerp(
            group.position.y,
            mood === "success" ? 0.52 : mood === "thinking" ? 0.46 : 0.49,
            0.08
        );
    });

    if (!config.faceVisible) return null;

    return (
        <group ref={groupRef} position={[0, 0.49, 0.69]}>
            <group ref={leftEyeRef}>
                <FaceEye side={-1} color={config.faceColor} />
            </group>

            <group ref={rightEyeRef}>
                <FaceEye side={1} color={config.faceColor} />
            </group>

            <FaceBrow side={-1} type={config.brow} color={config.faceColor} />
            <FaceBrow side={1} type={config.brow} color={config.faceColor} />

            <mesh position={[-0.35, -0.08, 0.025]} scale={[0.07, 0.045, 0.012]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color={COLORS.cheek}
                    roughness={0.45}
                    transparent
                    opacity={0.82}
                />
            </mesh>

            <mesh position={[0.35, -0.08, 0.025]} scale={[0.07, 0.045, 0.012]}>
                <sphereGeometry args={[1, 20, 10]} />
                <meshStandardMaterial
                    color={COLORS.cheek}
                    roughness={0.45}
                    transparent
                    opacity={0.82}
                />
            </mesh>

            <group ref={mouthRef}>
                <FaceMouth type={config.mouth} color={config.faceColor} />
            </group>
        </group>
    );
}

function GoldScrew({
                       position,
                       rotationZ = 0,
                   }: {
    position: Vec3;
    rotationZ?: number;
}) {
    return (
        <group position={position} rotation={[0, rotationZ, 0]}>
            <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.036, 32]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.18}
                    metalness={0.65}
                />
            </mesh>

            <mesh position={[0, 0.022, 0]} rotation={[0, rotationZ, 0]}>
                <boxGeometry args={[0.085, 0.008, 0.014]} />
                <meshStandardMaterial
                    color="#8a4b05"
                    roughness={0.3}
                    metalness={0.45}
                />
            </mesh>

            <mesh position={[-0.018, 0.024, 0.018]} scale={[0.018, 0.006, 0.018]}>
                <sphereGeometry args={[1, 12, 6]} />
                <meshBasicMaterial color="#fff4c7" transparent opacity={0.55} />
            </mesh>
        </group>
    );
}

function SocketAndBase() {
    const screwPositions = useMemo(() => {
        const radius = 0.52;
        return [35, 145, 225, 315].map((deg) => {
            const angle = THREE.MathUtils.degToRad(deg);
            return {
                position: [
                    Math.cos(angle) * radius,
                    -0.66,
                    Math.sin(angle) * radius,
                ] as Vec3,
                rotationZ: angle,
            };
        });
    }, []);

    return (
        <group>
            {/* Cream platform */}
            <mesh castShadow receiveShadow position={[0, -0.82, 0]}>
                <cylinderGeometry args={[0.68, 0.76, 0.24, 96]} />
                <meshPhysicalMaterial
                    color={COLORS.cream}
                    roughness={0.34}
                    metalness={0.04}
                    clearcoat={0.65}
                    clearcoatRoughness={0.16}
                />
            </mesh>

            {/* Blue bottom base */}
            <mesh castShadow receiveShadow position={[0, -0.99, 0]}>
                <cylinderGeometry args={[0.78, 0.82, 0.18, 96]} />
                <meshPhysicalMaterial
                    color={COLORS.blue}
                    roughness={0.22}
                    metalness={0.25}
                    clearcoat={0.75}
                    clearcoatRoughness={0.12}
                />
            </mesh>

            <mesh position={[0, -0.895, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.72, 0.025, 16, 96]} />
                <meshStandardMaterial
                    color={COLORS.blueDark}
                    roughness={0.25}
                    metalness={0.35}
                />
            </mesh>

            {/* Front tiny indicator */}
            <mesh position={[0, -0.87, 0.68]} scale={[0.17, 0.028, 0.012]}>
                <sphereGeometry args={[1, 24, 8]} />
                <meshBasicMaterial
                    color="#fff7c2"
                    transparent
                    opacity={0.9}
                    toneMapped={false}
                />
            </mesh>

            {/* Gold screws */}
            {screwPositions.map((screw, index) => (
                <GoldScrew
                    key={index}
                    position={screw.position}
                    rotationZ={screw.rotationZ}
                />
            ))}

            {/* Metal socket core */}
            <mesh castShadow receiveShadow position={[0, -0.48, 0]}>
                <cylinderGeometry args={[0.29, 0.34, 0.38, 80]} />
                <meshStandardMaterial
                    color={COLORS.metal}
                    roughness={0.18}
                    metalness={0.8}
                />
            </mesh>

            {/* Thread rings */}
            {[-0.29, -0.37, -0.45, -0.53, -0.61].map((y, index) => (
                <mesh key={index} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.34, 0.032, 18, 96]} />
                    <meshStandardMaterial
                        color={index % 2 === 0 ? "#d7d2c8" : "#8f8b84"}
                        roughness={0.16}
                        metalness={0.86}
                    />
                </mesh>
            ))}

            {/* Golden collar glow */}
            <mesh position={[0, -0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.39, 0.035, 18, 96]} />
                <meshStandardMaterial
                    color={COLORS.hotLight}
                    roughness={0.18}
                    metalness={0.55}
                />
            </mesh>
        </group>
    );
}

function GroundGlow({ mood }: { mood: LightBulbMood }) {
    if (mood === "off") return null;

    const config = MOODS[mood];

    return (
        <group position={[0, -1.13, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.72, 64]} />
                <meshBasicMaterial
                    color={config.lightColor}
                    transparent
                    opacity={0.055}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

function SuccessSparkles({
                             enabled,
                             color,
                         }: {
    enabled: boolean;
    color: string;
}) {
    if (!enabled) return null;

    return (
        <Sparkles
            count={22}
            position={[0, 0.7, 0.65]}
            scale={[1.5, 1.1, 0.7]}
            size={3.5}
            speed={0.75}
            color={color}
        />
    );
}

export default function LightBulbCharacter({
                                               position = [0, 0, 0],
                                               scale = 1,
                                               mood = "idle",
                                               animation = "hover",
                                               followPointer = true,

                                               showEmoteBubble = true,
                                               emoteBubblePosition = [1.12, 0.92, 0.82],
                                               emoteBubbleScale = 0.9,
                                               emoteBubbleSide = "right",
                                               emoteBubbleBillboard = false,
                                               children,
                                               bodyNodeName = "TestLightBulbBody",
                                               disableRuntimeAnimation = false,
                                           }: LightBulbCharacterProps) {
    const rootRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);

    const config = MOODS[mood];

    useFrame((state) => {
        if (disableRuntimeAnimation) return;
        const t = state.clock.elapsedTime;
        const body = bodyRef.current;

        if (!body) return;

        const pointerX = followPointer ? state.pointer.x : 0;
        const pointerY = followPointer ? state.pointer.y : 0;

        let y = Math.sin(t * 1.4) * 0.018;
        let rotZ = Math.sin(t * 1.15) * 0.015;
        let rotY = pointerX * 0.12;
        const rotX = -pointerY * 0.045;

        if (animation === "bob") {
            y = Math.sin(t * 2.3) * 0.035;
            rotZ = Math.sin(t * 1.8) * 0.025;
        }

        if (animation === "rotate") {
            y = Math.sin(t * 1.3) * 0.02;
            rotY = Math.sin(t * 0.75) * 0.75;
        }

        if (animation === "excited") {
            y = Math.abs(Math.sin(t * 5.2)) * 0.075;
            rotZ = Math.sin(t * 7.5) * 0.055;
        }

        if (animation === "talk") {
            y = Math.sin(t * 3.4) * 0.032;
            rotZ = Math.sin(t * 5.5) * 0.026;
        }

        body.position.y = THREE.MathUtils.lerp(body.position.y, y, 0.08);
        body.rotation.x = THREE.MathUtils.lerp(body.rotation.x, rotX, 0.07);
        body.rotation.y = THREE.MathUtils.lerp(body.rotation.y, rotY, 0.07);
        body.rotation.z = THREE.MathUtils.lerp(body.rotation.z, rotZ, 0.07);
    });

    return (
        <group ref={rootRef} position={position} scale={scale}>
            <group ref={bodyRef} name={bodyNodeName}>
                <BulbGlass mood={mood} />

                <Filament mood={mood} />

                <BulbFace mood={mood} />

                <SocketAndBase />
                {children}

                <GroundGlow mood={mood} />

                <SuccessSparkles
                    enabled={Boolean(config.sparkles)}
                    color={config.lightColor}
                />
            </group>

            {showEmoteBubble && config.bubble && (
                <CharacterEmoteBubble
                    type={config.bubble}
                    position={emoteBubblePosition}
                    scale={emoteBubbleScale}
                    side={emoteBubbleSide}
                    accentColor={config.lightColor}
                    billboard={emoteBubbleBillboard}
                />
            )}
        </group>
    );
}
