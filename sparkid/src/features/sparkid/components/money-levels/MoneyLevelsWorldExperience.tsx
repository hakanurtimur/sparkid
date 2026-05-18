"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Float, Html, OrthographicCamera } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"

import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import { moneyIslandConfigs } from "@/features/sparkid/components/assets/money/moneyIslandConfigs"
import IslandGlbModel from "@/features/sparkid/components/levels/IslandGlbModel"

type Vec3 = [number, number, number]

type MoneyIslandPlacement = {
    position: Vec3
    rotation: Vec3
    scale: number
}

const moneyIslandPlacements: MoneyIslandPlacement[] = [
    { position: [0, -1.3, 0.35], rotation: [0, 0.35, 0], scale: 0.72 },
    { position: [-5.1, -1.55, -1.75], rotation: [0, 0.7, 0], scale: 0.48 },
    { position: [5.1, -1.55, -1.9], rotation: [0, -0.72, 0], scale: 0.48 },
    { position: [-2.65, -1.82, -4.15], rotation: [0, 0.35, 0], scale: 0.43 },
    { position: [2.65, -1.82, -4.25], rotation: [0, -0.35, 0], scale: 0.43 },
]

function Loading() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Money adası yükleniyor...
            </div>
        </Html>
    )
}

function MoneyMapCameraRig() {
    const { camera } = useThree()

    useEffect(() => {
        camera.position.set(7.8, 6.6, 9.4)
        camera.lookAt(0, -1.15, -1.8)
    }, [camera])

    return null
}

function MoneyIslandStateBadge({ unlocked }: { unlocked: boolean }) {
    return (
        <Html
            center
            position={[0, 4.25, 0]}
            distanceFactor={9}
            transform
            occlude={false}
            zIndexRange={[40, 0]}
        >
            <div
                className={
                    unlocked
                        ? "pointer-events-none rounded-full border border-[var(--sparkid-yellow)]/45 bg-[var(--sparkid-yellow)]/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-yellow)] shadow-xl backdrop-blur-md"
                        : "pointer-events-none rounded-full border border-white/10 bg-black/65 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/65 shadow-xl backdrop-blur-md"
                }
            >
                {unlocked ? "Açık" : "Kilitli"}
            </div>
        </Html>
    )
}

function MoneyIslandWorldPreview() {
    const router = useRouter()

    return (
        <group>
            {moneyIslandConfigs.slice(0, 5).map((island, index) => {
                const placement =
                    moneyIslandPlacements[index] ??
                    moneyIslandPlacements[moneyIslandPlacements.length - 1]
                const isUnlocked = island.status === "available"

                return (
                    <Float
                        key={island.id}
                        speed={isUnlocked ? 1.05 : 0.75}
                        floatIntensity={isUnlocked ? 0.12 : 0.06}
                        rotationIntensity={isUnlocked ? 0.025 : 0.015}
                    >
                        <group
                            position={placement.position}
                            rotation={placement.rotation}
                            scale={placement.scale}
                            onClick={(event) => {
                                event.stopPropagation()
                                if (!isUnlocked) return
                                router.push(`/money-levels/${island.slug}`)
                            }}
                            onPointerOver={(event) => {
                                event.stopPropagation()
                                if (!isUnlocked) return
                                document.body.style.cursor = "pointer"
                            }}
                            onPointerOut={(event) => {
                                event.stopPropagation()
                                document.body.style.cursor = "default"
                            }}
                        >
                            <IslandGlbModel modelPath={island.modelPath} />
                            <MoneyIslandStateBadge unlocked={isUnlocked} />

                            {!isUnlocked && (
                                <mesh position={[0, 2.15, 0]}>
                                    <sphereGeometry args={[0.55, 24, 16]} />
                                    <meshStandardMaterial
                                        color="#020817"
                                        emissive="#07111f"
                                        emissiveIntensity={0.45}
                                        transparent
                                        opacity={0.42}
                                        roughness={0.35}
                                    />
                                </mesh>
                            )}
                        </group>
                    </Float>
                )
            })}

            <mesh
                position={[0, -2.18, -2.3]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <circleGeometry args={[8.2, 72]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.22} />
            </mesh>
        </group>
    )
}

export default function MoneyLevelsWorldExperience() {
    const firstIsland = moneyIslandConfigs[0]
    const lockedIslands = moneyIslandConfigs.slice(1, 5)

    return (
        <main className="relative h-screen overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-80"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,216,74,0.16),rgba(7,17,31,0.5)_48%,rgba(7,17,31,0.94)_100%)]"
            />

            <section className="relative z-10 h-screen p-4 md:p-6">
                <div className="relative h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm md:h-[calc(100vh-3rem)]">
                    <Canvas
                        className="absolute inset-0 h-full w-full"
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                        }}
                        shadows
                        dpr={[1, 1.5]}
                    >
                        <OrthographicCamera
                            makeDefault
                            position={[7.8, 6.6, 9.4]}
                            zoom={62}
                            near={0.1}
                            far={100}
                        />

                        <MoneyMapCameraRig />
                        <IslandEnvironment
                            accent={firstIsland.accentColor}
                            showBackground={false}
                        />

                        <Suspense fallback={<Loading />}>
                            <MoneyIslandWorldPreview />
                        </Suspense>
                    </Canvas>

                    <div className="pointer-events-none absolute left-4 top-4 max-w-md rounded-[1.75rem] border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-xl md:left-6 md:top-6">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--sparkid-yellow)]">
                            Sparkid Money World
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--sparkid-white)]">
                            Money Islands
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-[var(--sparkid-muted)]">
                            İlk money adasına gir, bölümü seç ve karar masasında görevi tamamla.
                        </p>
                    </div>

                    <Link
                        href={`/money-levels/${firstIsland.slug}`}
                        className="absolute bottom-5 left-4 rounded-2xl border border-[var(--sparkid-yellow)]/40 bg-[var(--sparkid-yellow)]/15 px-4 py-3 text-sm font-black text-[var(--sparkid-white)] shadow-lg backdrop-blur-md transition hover:bg-[var(--sparkid-yellow)]/25 md:bottom-6 md:left-6"
                    >
                        İhtiyaç mı, İstek mi Adasına Gir
                    </Link>

                    <aside className="absolute right-4 top-4 hidden w-[326px] rounded-[2rem] border border-white/10 bg-[var(--sparkid-card)]/80 p-4 shadow-2xl backdrop-blur-xl lg:block xl:right-6 xl:top-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-yellow)]">
                            Money Ada Listesi
                        </p>

                        <Link
                            href={`/money-levels/${firstIsland.slug}`}
                            className="mt-3 block rounded-2xl border border-[var(--sparkid-yellow)]/45 bg-[var(--sparkid-panel)] p-4 transition hover:border-[var(--sparkid-yellow)]"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-[var(--sparkid-white)]">
                                        {firstIsland.title}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-[var(--sparkid-muted)]">
                                        {firstIsland.reward}
                                    </p>
                                </div>
                                <span className="rounded-full bg-[var(--sparkid-yellow)]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-yellow)]">
                                    Açık
                                </span>
                            </div>
                        </Link>

                        {lockedIslands.map((island) => (
                            <div
                                key={island.id}
                                className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 opacity-70"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-black text-[var(--sparkid-white)]">
                                            {island.title}
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-[var(--sparkid-secondary)]">
                                            {island.reward}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-secondary)]">
                                        Kilitli
                                    </span>
                                </div>
                            </div>
                        ))}
                    </aside>
                </div>
            </section>
        </main>
    )
}
