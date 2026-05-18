"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { Html } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"

import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import { getMoneyIslandBySlug } from "@/features/sparkid/components/assets/money/moneyIslandConfigs"
import IslandGlbModel from "@/features/sparkid/components/levels/IslandGlbModel"

import MoneyIslandLessonLayer from "./MoneyIslandLessonLayer"

type MoneyIslandDetailExperienceProps = {
    slug: string
}

function Loading() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Money adası yükleniyor...
            </div>
        </Html>
    )
}

function MoneyDetailCameraRig() {
    const { camera } = useThree()

    useEffect(() => {
        camera.position.set(0, 4.65, 9.6)
        camera.lookAt(0, 0.35, 0)
        camera.updateProjectionMatrix()
    }, [camera])

    return null
}

export default function MoneyIslandDetailExperience({
    slug,
}: MoneyIslandDetailExperienceProps) {
    const island = getMoneyIslandBySlug(slug)

    if (!island) {
        return null
    }

    return (
        <main className="relative h-screen overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-80"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,216,74,0.16),rgba(7,17,31,0.42)_50%,rgba(7,17,31,0.86)_100%)]"
            />

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
                camera={{
                    position: [0, 4.65, 9.6],
                    fov: 42,
                    near: 0.1,
                    far: 100,
                }}
            >
                <MoneyDetailCameraRig />

                <IslandEnvironment
                    accent={island.accentColor}
                    showBackground={false}
                />

                <Suspense fallback={<Loading />}>
                    <group
                        name={`${island.slug}-money-detail-scene`}
                        position={[0, -0.75, 0]}
                        rotation={island.rotation}
                        scale={1.08}
                    >
                        <IslandGlbModel modelPath={island.modelPath} />
                        <MoneyIslandLessonLayer lessons={island.lessons} />
                    </group>
                </Suspense>
            </Canvas>

            <section className="pointer-events-none absolute left-5 top-5 z-20 max-w-md rounded-[1.75rem] border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-yellow)]">
                    {island.name}
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--sparkid-white)]">
                    {island.title}
                </h1>
                <p className="mt-2 text-sm leading-6 text-[var(--sparkid-muted)]">
                    Bölüm node’una tıkla ve Money Lab karar masasına geç.
                </p>
                <div className="mt-4 rounded-2xl border border-[var(--sparkid-yellow)]/20 bg-[var(--sparkid-yellow)]/10 p-3">
                    <p className="text-xs font-black text-[var(--sparkid-white)]">
                        Ödül: {island.reward}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--sparkid-muted)]">
                        Doğru kararları verdiğinde bu adanın aracını kazanırsın.
                    </p>
                </div>
            </section>

            <aside className="absolute bottom-5 right-5 z-20 w-[360px] max-w-[calc(100vw-2rem)] space-y-2 rounded-[1.75rem] border border-white/10 bg-[var(--sparkid-card)]/85 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-yellow)]">
                        Bölümler
                    </p>
                    <Link
                        href="/money-levels"
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-muted)] transition hover:bg-white/10"
                    >
                        Geri
                    </Link>
                </div>

                {island.lessons.map((lesson, index) => {
                    const locked = lesson.status === "locked"

                    return (
                        <Link
                            key={lesson.id}
                            href={locked ? "#" : lesson.route}
                            aria-disabled={locked}
                            className={`block rounded-2xl border p-3 transition ${
                                locked
                                    ? "pointer-events-none border-white/10 bg-white/[0.04] opacity-60"
                                    : "border-[var(--sparkid-yellow)]/35 bg-[var(--sparkid-panel)] hover:border-[var(--sparkid-yellow)]"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-black text-[var(--sparkid-white)]">
                                        {index + 1}. {lesson.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[var(--sparkid-muted)]">
                                        {lesson.description}
                                    </p>
                                </div>
                                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-black text-[var(--sparkid-secondary)]">
                                    {locked ? "Kilitli" : "Açık"}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </aside>
        </main>
    )
}
