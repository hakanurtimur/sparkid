"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

import type { IslandLessonConfig, Vec3 } from "@/features/sparkid/components/assets/island/islandConfigs"
import CircuitSwitch from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import LightBulbGlbCharacter from "@/features/sparkid/components/assets/circuit-elements/light-bulb/LightBulbGlbCharacter"

import IslandCharacterWalker from "./IslandCharacterWalker"
import RewardChestGLB, { type RewardChestState } from "./RewardChestGLB"

const ENERGY_Y = 0.365
const CHARACTER_Y = 0.42
const ISLAND_CLICK_Y = 0.38
const EXIT_GATE_POSITION: Vec3 = [2.95, ENERGY_Y + 0.08, 0.82]
const REWARD_CHEST_POSITION: Vec3 = [0, 0.5, 3.18]

type LessonNodeState = "locked" | "current" | "completed"

function PowerEnergyLine({
    points,
    radius = 0.03,
}: {
    points: Vec3[]
    radius?: number
}) {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            points.map((point) => new THREE.Vector3(...point)),
        )
    }, [points])

    return (
        <mesh castShadow receiveShadow>
            <tubeGeometry args={[curve, 48, radius, 10, false]} />
            <meshStandardMaterial
                color="#00ccff"
                emissive="#00aaff"
                emissiveIntensity={2.7}
                roughness={0.25}
            />
        </mesh>
    )
}

function ClickablePowerNode({
    lesson,
    nodeState,
    disabled,
    onSelect,
}: {
    lesson: IslandLessonConfig
    nodeState: LessonNodeState
    disabled?: boolean
    onSelect: (lesson: IslandLessonConfig) => void
}) {
    const [hovered, setHovered] = useState(false)
    const locked = nodeState === "locked"
    const completed = nodeState === "completed"
    const current = nodeState === "current"
    const position = lesson.nodePosition ?? [0, ENERGY_Y, 0]
    const accentColor = completed ? "#45e39a" : current ? "#35e5f2" : "#64748b"
    const emissiveColor = completed ? "#17c879" : current ? "#00aaff" : "#111827"

    return (
        <group
            name={lesson.id}
            position={position}
            scale={hovered && !locked ? 1.16 : 1}
            onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
                if (!locked && !disabled) document.body.style.cursor = "pointer"
            }}
            onPointerOut={(event) => {
                event.stopPropagation()
                setHovered(false)
                document.body.style.cursor = "default"
            }}
            onClick={(event) => {
                event.stopPropagation()
                if (locked || disabled) return
                onSelect(lesson)
            }}
        >
            {current && !disabled && <NodePulse color={accentColor} />}

            <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.14, 0.18, 0.075, 20]} />
                <meshStandardMaterial
                    color={locked ? "#2f3a44" : completed ? "#173d46" : "#263746"}
                    roughness={0.58}
                />
            </mesh>

            <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.16, 0.024, 8, 36]} />
                <meshStandardMaterial
                    color={accentColor}
                    emissive={emissiveColor}
                    emissiveIntensity={locked ? 0.45 : hovered ? 3.3 : completed ? 2.65 : 2.3}
                    roughness={0.28}
                />
            </mesh>

            <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.075, 20, 16]} />
                <meshStandardMaterial
                    color={locked ? "#94a3b8" : completed ? "#89f7c0" : "#69e8ff"}
                    emissive={locked ? "#1f2937" : emissiveColor}
                    emissiveIntensity={locked ? 0.55 : hovered ? 3.8 : 2.8}
                    roughness={0.2}
                />
            </mesh>

            <pointLight
                position={[0, 0.2, 0]}
                color={accentColor}
                intensity={locked ? 0.18 : hovered ? 1.05 : completed ? 0.72 : 0.55}
                distance={1.7}
            />

            {completed && <CompletedCheck />}

            <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.34, 16, 12]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    )
}

function NodePulse({ color }: { color: string }) {
    const ringRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.MeshBasicMaterial>(null)

    useFrame((state) => {
        const t = state.clock.elapsedTime
        const scale = 1 + Math.sin(t * 2.7) * 0.11
        const opacity = 0.22 + Math.sin(t * 2.7) * 0.08

        if (ringRef.current) {
            ringRef.current.scale.setScalar(scale)
        }

        if (materialRef.current) {
            materialRef.current.opacity = opacity
        }
    })

    return (
        <mesh
            ref={ringRef}
            position={[0, 0.245, 0]}
            rotation={[Math.PI / 2, 0, 0]}
        >
            <ringGeometry args={[0.25, 0.31, 36]} />
            <meshBasicMaterial
                ref={materialRef}
                color={color}
                transparent
                opacity={0.24}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    )
}

function CompletedCheck() {
    return (
        <group position={[0, 0.31, 0]} rotation={[0, 0, -0.1]}>
            <mesh position={[-0.035, 0, 0]} rotation={[0, 0, -0.72]}>
                <boxGeometry args={[0.035, 0.12, 0.02]} />
                <meshBasicMaterial color="#fff8e8" toneMapped={false} />
            </mesh>
            <mesh position={[0.045, 0.035, 0]} rotation={[0, 0, 0.72]}>
                <boxGeometry args={[0.035, 0.19, 0.02]} />
                <meshBasicMaterial color="#fff8e8" toneMapped={false} />
            </mesh>
        </group>
    )
}

function ClickableExitGate() {
    const router = useRouter()
    const [hovered, setHovered] = useState(false)

    return (
        <group
            name="POWER_ISLAND_EXIT_GATE"
            position={EXIT_GATE_POSITION}
            scale={hovered ? 1.12 : 1}
            onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
                document.body.style.cursor = "pointer"
            }}
            onPointerOut={(event) => {
                event.stopPropagation()
                setHovered(false)
                document.body.style.cursor = "default"
            }}
            onClick={(event) => {
                event.stopPropagation()
                router.push("/levels")
            }}
        >
            <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.18, 0.12]} />
                <meshStandardMaterial
                    color="#12345f"
                    emissive="#00aaff"
                    emissiveIntensity={hovered ? 1.45 : 0.7}
                    roughness={0.36}
                />
            </mesh>

            <mesh position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.26, 0.025, 8, 36]} />
                <meshStandardMaterial
                    color="#35e5f2"
                    emissive="#00aaff"
                    emissiveIntensity={hovered ? 3.2 : 2.1}
                    roughness={0.24}
                />
            </mesh>

            <mesh position={[0, 0.23, 0]}>
                <sphereGeometry args={[0.32, 24, 14]} />
                <meshBasicMaterial
                    color="#35e5f2"
                    transparent
                    opacity={hovered ? 0.2 : 0.12}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

export default function PowerIslandLessonLayer({
    lessons,
    rewardId = "bulb-tool",
    completedLessonNumber = 0,
    rewardChestState = "closed",
    onRewardChestOpen,
}: {
    lessons: IslandLessonConfig[]
    rewardId?: string
    completedLessonNumber?: number
    rewardChestState?: RewardChestState
    onRewardChestOpen?: () => void
}) {
    const router = useRouter()
    const [walkingLesson, setWalkingLesson] = useState<IslandLessonConfig | null>(
        null,
    )
    const [freeWalkTarget, setFreeWalkTarget] = useState<Vec3 | null>(null)
    const [freeWalking, setFreeWalking] = useState(false)
    const lessonPositions = lessons
        .map((lesson) => lesson.nodePosition)
        .filter(Boolean) as Vec3[]
    const unlockedLessons = lessons.filter((lesson) => lesson.status !== "locked")
    const activeLesson = unlockedLessons[unlockedLessons.length - 1] ?? lessons[0]
    const characterPosition = getCharacterStandPosition(
        activeLesson?.nodePosition ?? lessonPositions[0] ?? [0, ENERGY_Y, 0],
    )
    const characterTargetPosition = walkingLesson?.nodePosition
        ? getCharacterStandPosition(walkingLesson.nodePosition)
        : freeWalkTarget

    const handleSelectLesson = (lesson: IslandLessonConfig) => {
        if (!lesson.nodePosition) {
            router.push(lesson.route)
            return
        }

        setFreeWalkTarget(null)
        setFreeWalking(false)
        setWalkingLesson(lesson)
    }

    const handleIslandClick = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()

        if (walkingLesson) return

        setFreeWalkTarget([
            THREE.MathUtils.clamp(event.point.x, -2.6, 2.6),
            CHARACTER_Y,
            THREE.MathUtils.clamp(event.point.z, -0.35, 2.55),
        ])
        setFreeWalking(true)
    }

    return (
        <group name="POWER_ISLAND_LESSON_LAYER">
            <mesh
                name="POWER_ISLAND_CHARACTER_WALK_AREA"
                position={[0, ISLAND_CLICK_Y, 1.1]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={handleIslandClick}
            >
                <circleGeometry args={[3.1, 48]} />
                <meshBasicMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            <group name="POWER_ISLAND_ENERGY_LINES">
                {lessonPositions.length >= 3 && (
                    <>
                        <PowerEnergyLine
                            points={[
                                [-2.95, ENERGY_Y + 0.065, 1.8],
                                [-2.55, ENERGY_Y + 0.065, 1.95],
                                lessonPositions[0],
                            ]}
                        />
                        <PowerEnergyLine
                            points={[
                                lessonPositions[0],
                                [-1.1, ENERGY_Y + 0.065, 2.12],
                                lessonPositions[1],
                            ]}
                        />
                        <PowerEnergyLine
                            points={[
                                lessonPositions[1],
                                [0.35, ENERGY_Y + 0.065, 1.75],
                                lessonPositions[2],
                            ]}
                        />
                        <PowerEnergyLine
                            points={[
                                lessonPositions[2],
                                [1.75, ENERGY_Y + 0.065, 1.15],
                                [2.35, ENERGY_Y + 0.065, 0.95],
                                [2.95, ENERGY_Y + 0.065, 0.82],
                            ]}
                        />
                    </>
                )}
            </group>

            <group name="POWER_ISLAND_CLICKABLE_NODES">
                {lessons.map((lesson, index) => {
                    const lessonNumber = index + 1
                    const nodeState: LessonNodeState =
                        lessonNumber <= completedLessonNumber
                            ? "completed"
                            : lesson.status === "locked"
                                ? "locked"
                                : "current"

                    return (
                        <ClickablePowerNode
                            key={lesson.id}
                            lesson={lesson}
                            nodeState={nodeState}
                            disabled={Boolean(walkingLesson)}
                            onSelect={handleSelectLesson}
                        />
                    )
                })}
            </group>

            <ClickableExitGate />

            <RewardChestGLB
                state={rewardChestState}
                position={REWARD_CHEST_POSITION}
                rotation={[0, 0.35, 0]}
                scale={0.23}
                showGlow={rewardChestState !== "locked"}
                showSparkles={rewardChestState !== "locked"}
                onClick={() => {
                    if (rewardChestState !== "closed") return

                    onRewardChestOpen?.()
                }}
            >
                {rewardChestState === "open" && (
                    <IslandRewardModel rewardId={rewardId} />
                )}
            </RewardChestGLB>

            <IslandCharacterWalker
                position={characterPosition}
                targetPosition={characterTargetPosition}
                walking={Boolean(walkingLesson || freeWalking)}
                onArrive={() => {
                    if (!walkingLesson) {
                        setFreeWalking(false)
                        return
                    }

                    router.push(walkingLesson.route)
                }}
            />
        </group>
    )
}

function IslandRewardModel({ rewardId }: { rewardId: string }) {
    if (rewardId === "circuit-detector") {
        return <CircuitDetectorRewardModel />
    }

    if (rewardId === "switch-tool") {
        return (
            <group position={[0, 0.12, 0]} rotation={[0, -0.45, 0]} scale={0.34}>
                <CircuitSwitch
                    mode="on"
                    animation="showcase"
                    interactive={false}
                    showGlow
                />
            </group>
        )
    }

    return (
        <LightBulbGlbCharacter
            mood="success"
            animation="excited"
            position={[0, 0.12, 0]}
            scale={0.2}
            quality="circuit"
            showFace={false}
            showSparkles
        />
    )
}

function CircuitDetectorRewardModel() {
    return (
        <group position={[0, 0.12, 0]} rotation={[0, -0.45, 0]} scale={0.46}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.34, 0.18]} />
                <meshStandardMaterial
                    color="#09224f"
                    emissive="#35e5f2"
                    emissiveIntensity={0.22}
                    roughness={0.35}
                    metalness={0.16}
                />
            </mesh>

            <mesh position={[0, 0.03, 0.105]}>
                <circleGeometry args={[0.12, 32]} />
                <meshStandardMaterial
                    color="#35e5f2"
                    emissive="#35e5f2"
                    emissiveIntensity={1.7}
                    roughness={0.22}
                />
            </mesh>

            <mesh position={[-0.2, -0.02, 0.11]}>
                <boxGeometry args={[0.11, 0.035, 0.018]} />
                <meshBasicMaterial color="#45e39a" toneMapped={false} />
            </mesh>

            <mesh position={[0.2, -0.02, 0.11]}>
                <boxGeometry args={[0.11, 0.035, 0.018]} />
                <meshBasicMaterial color="#ff6b6b" toneMapped={false} />
            </mesh>
        </group>
    )
}

function getCharacterStandPosition(nodePosition: Vec3): Vec3 {
    return [
        nodePosition[0] - 0.34,
        CHARACTER_Y,
        nodePosition[2] + 0.32,
    ]
}
