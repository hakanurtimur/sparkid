"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import * as THREE from "three"

import type {
    MoneyIslandLessonConfig,
    Vec3,
} from "@/features/sparkid/components/assets/money/moneyIslandConfigs"

const ENERGY_Y = 0.365

function MoneyEnergyLine({
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
                color="#35E5F2"
                emissive="#13BBD1"
                emissiveIntensity={2.4}
                roughness={0.24}
            />
        </mesh>
    )
}

function ClickableMoneyNode({
    lesson,
}: {
    lesson: MoneyIslandLessonConfig
}) {
    const router = useRouter()
    const [hovered, setHovered] = useState(false)
    const locked = lesson.status === "locked"
    const position = lesson.nodePosition ?? [0, ENERGY_Y, 0]

    return (
        <group
            name={lesson.id}
            position={position}
            scale={hovered && !locked ? 1.16 : 1}
            onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
                if (!locked) document.body.style.cursor = "pointer"
            }}
            onPointerOut={(event) => {
                event.stopPropagation()
                setHovered(false)
                document.body.style.cursor = "default"
            }}
            onClick={(event) => {
                event.stopPropagation()
                if (locked) return
                router.push(lesson.route)
            }}
        >
            <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.14, 0.18, 0.075, 20]} />
                <meshStandardMaterial
                    color={locked ? "#2f3a44" : "#092A63"}
                    roughness={0.58}
                />
            </mesh>

            <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.16, 0.024, 8, 36]} />
                <meshStandardMaterial
                    color={locked ? "#64748b" : "#35E5F2"}
                    emissive={locked ? "#111827" : "#13BBD1"}
                    emissiveIntensity={locked ? 0.45 : hovered ? 3.2 : 2.2}
                    roughness={0.28}
                />
            </mesh>

            <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.075, 20, 16]} />
                <meshStandardMaterial
                    color={locked ? "#94a3b8" : "#FFF8E8"}
                    emissive={locked ? "#1f2937" : "#35E5F2"}
                    emissiveIntensity={locked ? 0.55 : hovered ? 2.8 : 1.8}
                    roughness={0.2}
                />
            </mesh>

            <pointLight
                position={[0, 0.2, 0]}
                color={locked ? "#64748b" : "#35E5F2"}
                intensity={locked ? 0.16 : hovered ? 0.95 : 0.42}
                distance={1.7}
            />

            <mesh position={[0, 0.16, 0]}>
                <sphereGeometry args={[0.34, 16, 12]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    )
}

export default function MoneyIslandLessonLayer({
    lessons,
}: {
    lessons: MoneyIslandLessonConfig[]
}) {
    const lessonPositions = lessons
        .map((lesson) => lesson.nodePosition)
        .filter(Boolean) as Vec3[]

    return (
        <group name="MONEY_ISLAND_LESSON_LAYER">
            <group name="MONEY_ISLAND_ENERGY_LINES">
                {lessonPositions.length >= 3 && (
                    <>
                        <MoneyEnergyLine
                            points={[
                                [-2.95, ENERGY_Y + 0.065, 1.8],
                                [-2.55, ENERGY_Y + 0.065, 1.95],
                                lessonPositions[0],
                            ]}
                        />
                        <MoneyEnergyLine
                            points={[
                                lessonPositions[0],
                                [-1.1, ENERGY_Y + 0.065, 2.12],
                                lessonPositions[1],
                            ]}
                        />
                        <MoneyEnergyLine
                            points={[
                                lessonPositions[1],
                                [0.35, ENERGY_Y + 0.065, 1.75],
                                lessonPositions[2],
                            ]}
                        />
                    </>
                )}
            </group>

            <group name="MONEY_ISLAND_CLICKABLE_NODES">
                {lessons.map((lesson) => (
                    <ClickableMoneyNode key={lesson.id} lesson={lesson} />
                ))}
            </group>
        </group>
    )
}
