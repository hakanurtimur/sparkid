"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Float, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Canvas, type ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import {
    islandWorldConfig,
    type IslandWorldConfig,
    type Vec3,
} from "@/features/sparkid/components/assets/island/islandConfigs"

import IslandGlbModel from "./IslandGlbModel"

type IslandPlacement = {
    position: Vec3
    rotation: Vec3
    scale: number
}

const ISLAND_PLACEMENTS: Record<string, IslandPlacement> = {
    power: {
        position: [-5.05, -1.48, 0.12],
        rotation: [0, 0.42, 0],
        scale: 0.24,
    },
    switch: {
        position: [-3.05, -1.5, -1.32],
        rotation: [0, -0.14, 0],
        scale: 0.25,
    },
    fault: {
        position: [-1.08, -1.52, 0.78],
        rotation: [0, 0.18, 0],
        scale: 0.25,
    },
    series: {
        position: [1.08, -1.52, 0.78],
        rotation: [0, -0.34, 0],
        scale: 0.25,
    },
    parallel: {
        position: [3.05, -1.5, -1.32],
        rotation: [0, -0.56, 0],
        scale: 0.25,
    },
    "free-lab": {
        position: [5.05, -1.48, 0.12],
        rotation: [0, -0.05, 0],
        scale: 0.24,
    },
}

const ROUTE_POINTS: Vec3[] = [
    [-5.05, -1.02, 0.12],
    [-3.05, -1.03, -1.32],
    [-1.08, -1.05, 0.78],
    [1.08, -1.05, 0.78],
    [3.05, -1.03, -1.32],
    [5.05, -1.02, 0.12],
]

function Loading() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Adalar yükleniyor...
            </div>
        </Html>
    )
}

function WorldRoutePath({ islands }: { islands: IslandWorldConfig[] }) {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(
            ROUTE_POINTS.map((point) => new THREE.Vector3(...point)),
        )
    }, [])

    return (
        <group name="WORLD_ROUTE_PATH">
            <mesh renderOrder={1}>
                <tubeGeometry args={[curve, 140, 0.03, 10, false]} />
                <meshStandardMaterial
                    color="#fff8e8"
                    emissive="#35e5f2"
                    emissiveIntensity={1.25}
                    roughness={0.32}
                    transparent
                    opacity={0.82}
                />
            </mesh>

            {ROUTE_POINTS.map((point, index) => {
                const unlocked = islands[index]?.status === "available"

                return (
                    <group key={`${point.join("-")}-${index}`} position={point}>
                        <mesh>
                            <sphereGeometry args={[0.15, 24, 16]} />
                            <meshStandardMaterial
                                color={unlocked ? "#35e5f2" : "#64748b"}
                                emissive={unlocked ? "#13bbd1" : "#111827"}
                                emissiveIntensity={unlocked ? 2.2 : 0.6}
                                roughness={0.24}
                            />
                        </mesh>

                        <Html
                            center
                            position={[0, 0.2, 0]}
                            distanceFactor={8}
                            occlude={false}
                            zIndexRange={[35, 0]}
                            style={{ pointerEvents: "none" }}
                        >
                            <div
                                className={`pointer-events-none grid h-8 w-8 place-items-center rounded-full border text-[11px] font-black shadow-xl backdrop-blur-md ${
                                    unlocked
                                        ? "border-[var(--sparkid-yellow)]/60 bg-[var(--sparkid-cyan)]/25 text-[var(--sparkid-white)]"
                                        : "border-white/10 bg-black/65 text-[var(--sparkid-secondary)]"
                                }`}
                            >
                                {index + 1}
                            </div>
                        </Html>
                    </group>
                )
            })}
        </group>
    )
}

function IslandFocusRing({
    accentColor,
    selected,
    unlocked,
}: {
    accentColor: string
    selected: boolean
    unlocked: boolean
}) {
    return (
        <group position={[0, 0.08, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.45, 1.52, 72]} />
                <meshBasicMaterial
                    color={selected ? "#ffd84a" : accentColor}
                    transparent
                    opacity={selected ? 0.58 : unlocked ? 0.26 : 0.12}
                    depthWrite={false}
                />
            </mesh>

            {selected && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[1.7, 1.73, 72]} />
                    <meshBasicMaterial
                        color="#35e5f2"
                        transparent
                        opacity={0.36}
                        depthWrite={false}
                    />
                </mesh>
            )}
        </group>
    )
}

function IslandLabel({
                         island,
                         selected,
                     }: {
    island: IslandWorldConfig
    selected: boolean
}) {
    const unlocked = island.status === "available"

    return (
        <Html
            center
            position={[0, 2.15, 0]}
            distanceFactor={8}
            occlude={false}
            zIndexRange={[30, 0]}
            style={{ pointerEvents: "none" }}
        >
            <div
                className={`pointer-events-none w-36 rounded-2xl border px-3 py-2 text-center shadow-xl backdrop-blur-md ${
                    selected
                        ? "border-[var(--sparkid-yellow)]/65 bg-[var(--sparkid-yellow)]/18"
                        : unlocked
                            ? "border-[var(--sparkid-cyan)]/45 bg-[var(--sparkid-cyan)]/14"
                            : "border-white/10 bg-black/58"
                }`}
            >
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-cyan)]">
                    Ada {island.order}
                </p>

                <p className="mt-1 text-[11px] font-black leading-4 text-[var(--sparkid-white)]">
                    {island.title}
                </p>

                <p
                    className={`mt-1 text-[8px] font-black uppercase tracking-[0.13em] ${
                        unlocked
                            ? "text-[var(--sparkid-yellow)]"
                            : "text-[var(--sparkid-secondary)]"
                    }`}
                >
                    {unlocked ? "Açık" : "Kilitli"}
                </p>
            </div>
        </Html>
    )
}

function LockedVeil() {
    return (
        <group>
            <mesh position={[0, 2.05, 0]}>
                <sphereGeometry args={[0.72, 28, 18]} />
                <meshStandardMaterial
                    color="#020817"
                    emissive="#1b3f7a"
                    emissiveIntensity={0.22}
                    transparent
                    opacity={0.42}
                    roughness={0.42}
                />
            </mesh>

            <mesh position={[0, 2.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.86, 0.025, 8, 48]} />
                <meshStandardMaterial
                    color="#7f93bf"
                    emissive="#092a63"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.68}
                />
            </mesh>
        </group>
    )
}

function IslandsWorldScene({
                               islands,
                               selectedSlug,
                               onSelect,
                               onEnter,
                           }: {
    islands: IslandWorldConfig[]
    selectedSlug: string
    onSelect: (island: IslandWorldConfig) => void
    onEnter: (island: IslandWorldConfig) => void
}) {
    const selectedIsland =
        islands.find((island) => island.slug === selectedSlug) ?? islands[0]

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[0, 8.15, 12.6]}
                fov={46}
                near={0.1}
                far={120}
            />

            <IslandEnvironment
                accent={selectedIsland?.accentColor ?? "#35e5f2"}
                showBackground={false}
                effects={false}
            />

            <Suspense fallback={<Loading />}>
                <group name="SPARKID_WORLD_MAP">
                    <WorldRoutePath islands={islands} />

                    {islands.map((island) => {
                        const placement =
                            ISLAND_PLACEMENTS[island.slug] ?? {
                                position: island.position,
                                rotation: island.rotation,
                                scale: island.scale * 0.24,
                            }

                        const selected = selectedSlug === island.slug
                        const unlocked = island.status === "available"

                        return (
                            <Float
                                key={island.id}
                                speed={unlocked ? 0.7 : 0.42}
                                floatIntensity={unlocked ? 0.05 : 0.022}
                                rotationIntensity={unlocked ? 0.008 : 0.003}
                            >
                                <group
                                    position={placement.position}
                                    onClick={(event: ThreeEvent<MouseEvent>) => {
                                        event.stopPropagation()
                                        onSelect(island)
                                        if (unlocked) onEnter(island)
                                    }}
                                    onPointerOver={(event) => {
                                        event.stopPropagation()
                                        document.body.style.cursor = unlocked
                                            ? "pointer"
                                            : "not-allowed"
                                        onSelect(island)
                                    }}
                                    onPointerOut={(event) => {
                                        event.stopPropagation()
                                        document.body.style.cursor = "default"
                                    }}
                                >
                                    <group
                                        rotation={placement.rotation}
                                        scale={
                                            selected
                                                ? placement.scale * 1.08
                                                : placement.scale
                                        }
                                    >
                                        <IslandGlbModel modelPath={island.modelPath} />
                                        <IslandFocusRing
                                            accentColor={island.accentColor}
                                            selected={selected}
                                            unlocked={unlocked}
                                        />
                                        {!unlocked && <LockedVeil />}
                                    </group>

                                    {selected && (
                                        <IslandLabel
                                            island={island}
                                            selected={selected}
                                        />
                                    )}
                                </group>
                            </Float>
                        )
                    })}

                    <mesh
                        position={[0, -1.86, -0.35]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <circleGeometry args={[9.35, 96]} />
                        <meshBasicMaterial
                            color="#000000"
                            transparent
                            opacity={0.14}
                        />
                    </mesh>
                </group>
            </Suspense>

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.08}
                enablePan={false}
                minDistance={11}
                maxDistance={20}
                maxPolarAngle={Math.PI / 2.25}
                minPolarAngle={Math.PI / 4.4}
                target={[0, -1.0, -0.32]}
            />
        </>
    )
}

function WorldMapRail({
                          islands,
                          selectedSlug,
                          onSelect,
                      }: {
    islands: IslandWorldConfig[]
    selectedSlug: string
    onSelect: (island: IslandWorldConfig) => void
}) {
    return (
        <nav className="absolute inset-x-5 bottom-5 z-30 mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-2 rounded-[1.35rem] border border-white/10 bg-black/34 p-2 shadow-2xl backdrop-blur-xl sm:grid-cols-3 lg:grid-cols-6">
                {islands.map((island) => {
                    const selected = island.slug === selectedSlug
                    const unlocked = island.status === "available"

                    return (
                        <button
                            key={island.id}
                            type="button"
                            onClick={() => onSelect(island)}
                            className={`rounded-2xl border px-3 py-2 text-left transition ${
                                selected
                                    ? "border-[var(--sparkid-yellow)]/60 bg-[var(--sparkid-yellow)]/16"
                                    : unlocked
                                        ? "border-[var(--sparkid-cyan)]/30 bg-[var(--sparkid-panel)]/65 hover:border-[var(--sparkid-cyan)]"
                                        : "border-white/10 bg-white/[0.04] opacity-75"
                            }`}
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--sparkid-cyan)]">
                                Ada {island.order}
                            </p>

                            <p className="mt-1 text-[11px] font-black leading-4 text-[var(--sparkid-white)]">
                                {island.title}
                            </p>
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default function LevelsWorldExperience() {
    const router = useRouter()
    const islands = islandWorldConfig.slice(0, 6)

    const [selectedSlug, setSelectedSlug] = useState(
        islands[0]?.slug ?? "power",
    )

    const selectedIsland =
        islands.find((island) => island.slug === selectedSlug) ?? islands[0]

    const selectedUnlocked = selectedIsland?.status === "available"

    useEffect(() => {
        return () => {
            document.body.style.cursor = "default"
        }
    }, [])

    const handleEnterIsland = () => {
        if (!selectedIsland || !selectedUnlocked) return

        router.push(`/levels/${selectedIsland.slug}`)
    }

    const handleEnterSpecificIsland = (island: IslandWorldConfig) => {
        if (island.status !== "available") return

        router.push(`/levels/${island.slug}`)
    }

    return (
        <main className="relative h-screen overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-80"
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(53,229,242,0.18),rgba(7,17,31,0.52)_48%,rgba(7,17,31,0.96)_100%)]"
            />

            <section className="relative z-10 h-screen p-4 md:p-6">
                <div className="relative h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-black/18 shadow-2xl backdrop-blur-sm md:h-[calc(100vh-3rem)]">
                    <div className="absolute inset-0 h-full w-full [&_canvas]:!h-full [&_canvas]:!w-full">
                        <Canvas
                            shadows
                            dpr={[1, 1.5]}
                            style={{ height: "100%", width: "100%" }}
                            gl={{
                                alpha: true,
                                antialias: true,
                                powerPreference: "high-performance",
                            }}
                        >
                            <IslandsWorldScene
                                islands={islands}
                                selectedSlug={selectedSlug}
                                onSelect={(island) => setSelectedSlug(island.slug)}
                                onEnter={handleEnterSpecificIsland}
                            />
                        </Canvas>
                    </div>

                    <header className="pointer-events-none absolute left-4 top-4 z-20 max-w-[390px] rounded-[1.75rem] border border-white/10 bg-black/42 p-5 shadow-2xl backdrop-blur-xl md:left-6 md:top-6">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
                            Sparkid Islands
                        </p>

                        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--sparkid-white)]">
                            Elektrik Adaları
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[var(--sparkid-muted)]">
                            Altı adalık yolculukta devre araçlarını kazan,
                            görevleri sırayla tamamla ve kendi deney alanına
                            ulaş.
                        </p>
                    </header>

                    <aside className="absolute right-5 top-20 z-30 w-[300px] max-w-[calc(100vw-2rem)] rounded-[1.75rem] border border-white/10 bg-[var(--sparkid-card)]/84 p-4 shadow-2xl backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-yellow)]">
                                    Ada {selectedIsland.order}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-[var(--sparkid-white)]">
                                    {selectedIsland.title}
                                </h2>

                                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                                    Ödül: {selectedIsland.reward.displayName}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] ${
                                    selectedUnlocked
                                        ? "bg-[var(--sparkid-cyan)]/15 text-[var(--sparkid-cyan)]"
                                        : "bg-white/5 text-[var(--sparkid-secondary)]"
                                }`}
                            >
                                {selectedUnlocked ? "Açık" : "Kilitli"}
                            </span>
                        </div>

                        <p className="mt-3 text-xs font-semibold leading-5 text-[var(--sparkid-secondary)]">
                            {selectedIsland.reward.description}
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {selectedIsland.lessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2"
                                >
                                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[var(--sparkid-cyan)]">
                                        {index + 1}. Bölüm
                                    </p>
                                    <p className="mt-1 min-h-8 text-[10px] font-black leading-4 text-[var(--sparkid-white)]">
                                        {lesson.title}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleEnterIsland}
                            disabled={!selectedUnlocked}
                            className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black transition ${
                                selectedUnlocked
                                    ? "bg-[var(--sparkid-cyan)] text-[var(--sparkid-navy-dark)] shadow-[0_16px_36px_rgba(53,229,242,0.2)] hover:scale-[1.01]"
                                    : "cursor-not-allowed bg-white/8 text-[var(--sparkid-secondary)]"
                            }`}
                        >
                            {selectedUnlocked ? "Adaya Git" : "Yakında Açılacak"}
                        </button>
                    </aside>

                    <WorldMapRail
                        islands={islands}
                        selectedSlug={selectedSlug}
                        onSelect={(island) => setSelectedSlug(island.slug)}
                    />

                    <Link
                        href="/"
                        className="absolute right-5 top-5 z-30 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-muted)] shadow-xl backdrop-blur-xl transition hover:border-[var(--sparkid-cyan)]/45 hover:text-[var(--sparkid-cyan)]"
                    >
                        Ana Sayfa
                    </Link>
                </div>
            </section>
        </main>
    )
}
