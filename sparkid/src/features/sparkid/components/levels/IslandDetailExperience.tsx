"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Html } from "@react-three/drei"

import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import { getIslandBySlug } from "@/features/sparkid/components/assets/island/islandConfigs"
import CircuitSwitch from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import SparkidMultiViewCanvas from "@/features/sparkid/components/SparkidMultiViewCanvas"

import IslandGlbModel from "./IslandGlbModel"
import { useIslandProgress } from "./islandProgress"
import PowerIslandLessonLayer from "./PowerIslandLessonLayer"

type IslandDetailExperienceProps = {
    slug: string
}

type RewardPresentation = {
    icon: string
    imagePath?: string
    color: string
    darkColor: string
    glowColor: string
    subtitle: string
    detail: string
}

function Loading() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Ada yükleniyor...
            </div>
        </Html>
    )
}

function getRewardPresentation(rewardId: string): RewardPresentation {
    if (rewardId === "bulb-tool") {
        return {
            icon: "☼",
            imagePath: "/sparkid/rewards/bulb-tool.png",
            color: "#14b8a6",
            darkColor: "#087b72",
            glowColor: "#fef08a",
            subtitle: "Ampul, enerji geldiğinde ışık üretir.",
            detail: "Kapalı devreyi tamamladığında ampul yanar ve elektriğin doğru yoldan aktığını gösterir.",
        }
    }

    if (rewardId === "switch-tool") {
        return {
            icon: "⌁",
            imagePath: "/sparkid/rewards/switch-tool.png",
            color: "#8b5cf6",
            darkColor: "#5b21b6",
            glowColor: "#c084fc",
            subtitle: "Anahtar, elektriğin geçip geçmeyeceğini kontrol eder.",
            detail: "ON olduğunda yol açılır, OFF olduğunda devre tamam görünse bile enerji geçemez.",
        }
    }

    if (rewardId === "circuit-detector") {
        return {
            icon: "!",
            color: "#FFB72C",
            darkColor: "#B45309",
            glowColor: "#FFD84A",
            subtitle: "Devre Dedektörü hataları bulmana yardım eder.",
            detail: "Eksik dönüş yollarını, yanlış porta giden kabloları ve çalışmayan bağlantıları fark etmeyi kolaylaştırır.",
        }
    }

    if (rewardId === "series-lens") {
        return {
            icon: "S",
            color: "#35E5F2",
            darkColor: "#13BBD1",
            glowColor: "#67E8F9",
            subtitle: "Seri Devre Lensi tek elektrik yolunu takip eder.",
            detail: "Parçaların aynı zincir üzerinde sırayla bağlı olup olmadığını anlamana yardım eder.",
        }
    }

    if (rewardId === "parallel-lens") {
        return {
            icon: "P",
            color: "#8B5CFF",
            darkColor: "#6336E8",
            glowColor: "#C4B5FD",
            subtitle: "Paralel Devre Lensi ayrı yolları görmeni sağlar.",
            detail: "Her ampulün kendi enerji yoluna sahip olup olmadığını ayırt etmene yardım eder.",
        }
    }

    return {
        icon: "*",
        color: "#45E39A",
        darkColor: "#15803D",
        glowColor: "#86EFAC",
        subtitle: "Yeni bir Sparkid aracı kazandın.",
        detail: "Bu ödül sonraki deneylerinde öğrendiklerini daha rahat kullanmana yardım edecek.",
    }
}

function RewardUnlockedModal({
                                 reward,
                                 onClose,
                             }: {
    reward: {
        id: string
        displayName: string
        description: string
    }
    onClose: () => void
}) {
    const presentation = getRewardPresentation(reward.id)

    return (
        <div className="pointer-events-auto fixed inset-0 z-50 grid place-items-center bg-[rgba(2,11,31,0.72)] px-4 backdrop-blur-md">
            <section className="relative w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-[2.25rem] border border-[var(--sparkid-yellow)]/40 bg-[linear-gradient(180deg,rgba(13,47,104,0.98),rgba(6,26,61,0.98))] p-6 text-center shadow-[0_28px_90px_rgba(255,216,74,0.2)]">
                <div
                    aria-hidden
                    className="absolute inset-x-8 top-0 h-24 rounded-full bg-[var(--sparkid-yellow)]/18 blur-3xl"
                />

                <p className="relative text-[10px] font-black uppercase tracking-[0.26em] text-[var(--sparkid-yellow)]">
                    Ödül Açıldı
                </p>

                <div
                    className="relative mx-auto mt-5 grid h-36 w-36 place-items-center rounded-[2rem] border border-white/15 shadow-[inset_0_-20px_34px_rgba(0,0,0,0.28),0_20px_58px_rgba(0,0,0,0.24)]"
                    style={{
                        background: `linear-gradient(145deg, ${presentation.color}, ${presentation.darkColor} 72%, #061A3D)`,
                        boxShadow: `0 0 44px ${presentation.glowColor}38, inset 0 -20px 34px rgba(0,0,0,0.28)`,
                    }}
                >
                    {presentation.imagePath ? (
                        <Image
                            src={presentation.imagePath}
                            alt=""
                            width={144}
                            height={144}
                            className="h-32 w-32 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]"
                            priority
                        />
                    ) : (
                        <span
                            className="text-6xl font-black text-white"
                            style={{
                                textShadow: `0 0 22px ${presentation.glowColor}`,
                            }}
                        >
                            {presentation.icon}
                        </span>
                    )}
                </div>

                <h2 className="relative mt-5 text-3xl font-black tracking-tight text-[var(--sparkid-white)]">
                    {reward.displayName} Kazandın!
                </h2>

                <p className="relative mt-3 text-base font-black leading-7 text-[var(--sparkid-cyan)]">
                    {presentation.subtitle}
                </p>

                <p className="relative mx-auto mt-3 max-w-md text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                    {presentation.detail}
                </p>

                <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--sparkid-secondary)]">
                        Kullanım Bilgisi
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[var(--sparkid-white)]">
                        {reward.description}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="relative mt-6 w-full rounded-2xl border border-[var(--sparkid-cyan)]/40 bg-[var(--sparkid-cyan)] px-5 py-4 text-sm font-black text-[var(--sparkid-navy-dark)] shadow-[0_18px_44px_rgba(53,229,242,0.22)] transition hover:scale-[1.01]"
                >
                    Harika, Devam Et
                </button>
            </section>
        </div>
    )
}

export default function IslandDetailExperience({
                                                   slug,
                                               }: IslandDetailExperienceProps) {
    const island = getIslandBySlug(slug)
    const progress = useIslandProgress(slug)
    const [rewardModalOpen, setRewardModalOpen] = useState(false)

    if (!island) {
        return (
            <main className="grid h-screen place-items-center bg-[#07111f] p-6 text-white">
                <section className="w-[min(420px,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-[var(--sparkid-card)]/85 p-6 text-center shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-yellow)]">
                        Ada bulunamadı
                    </p>
                    <h1 className="mt-2 text-2xl font-black text-[var(--sparkid-white)]">
                        Bu ada henüz hazır değil
                    </h1>
                    <Link
                        href="/levels"
                        className="mt-5 inline-flex rounded-2xl bg-[var(--sparkid-cyan)] px-5 py-3 text-sm font-black text-[var(--sparkid-navy-dark)]"
                    >
                        Adalara Dön
                    </Link>
                </section>
            </main>
        )
    }

    const lessons = island.lessons.map((lesson, index) => {
        const lessonNumber = index + 1
        const locked =
            lesson.status === "locked" ||
            !progress.isLessonUnlocked(lessonNumber)

        return {
            ...lesson,
            status: locked ? "locked" as const : "available" as const,
        }
    })
    const rewardUnlocked = progress.completedLessonNumber >= island.lessons.length
    const rewardChestState = rewardUnlocked
        ? progress.rewardClaimed
            ? "open"
            : "closed"
        : "locked"
    const nextLessonNumber = Math.min(
        progress.completedLessonNumber + 1,
        island.lessons.length,
    )

    return (
        <main className="relative h-screen overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-80"
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,170,255,0.16),rgba(7,17,31,0.42)_50%,rgba(7,17,31,0.86)_100%)]"
            />

            <SparkidMultiViewCanvas
                mainScene={
                    <>
                    <IslandEnvironment
                        accent={island.accentColor}
                        showBackground={false}
                        effects={false}
                    />

                    <Suspense fallback={<Loading />}>
                        <group
                            name={`${island.slug}-detail-scene`}
                            position={[0, -0.75, 0]}
                            rotation={island.rotation}
                            scale={1.08}
                        >
                            <IslandGlbModel modelPath={island.modelPath} />

                            <PowerIslandLessonLayer
                                lessons={lessons}
                                rewardId={island.reward.id}
                                completedLessonNumber={progress.completedLessonNumber}
                                rewardChestState={rewardChestState}
                                onRewardChestOpen={() => {
                                    if (!rewardUnlocked) return

                                    progress.markRewardClaimed()
                                    setRewardModalOpen(true)
                                }}
                            />
                        </group>
                    </Suspense>
                    </>
                }
                previewScene={
                    island.slug === "switch" ? (
                        <group
                            position={[0, -0.35, 0]}
                            rotation={[0, -0.35, 0]}
                            scale={0.72}
                        >
                            <CircuitSwitch
                                mode="off"
                                animation="showcase"
                                interactive={false}
                                showGlow
                            />
                        </group>
                    ) : undefined
                }
            />

            <Link
                href="/levels"
                className="absolute left-5 top-5 z-30 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--sparkid-white)] shadow-xl backdrop-blur-xl transition hover:border-[var(--sparkid-cyan)]/40 hover:bg-[var(--sparkid-cyan)]/15"
            >
                Adalara Dön
            </Link>

            <section className="pointer-events-none absolute left-5 top-20 z-20 max-w-md rounded-[1.75rem] border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
                    {island.name}
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--sparkid-white)]">
                    {island.title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--sparkid-muted)]">
                    Bölüm node’una tıkla ve devre laboratuvarındaki göreve geç.
                </p>

                <div className="mt-4 rounded-2xl border border-[var(--sparkid-cyan)]/20 bg-[var(--sparkid-cyan)]/10 p-3">
                    <p className="text-xs font-black text-[var(--sparkid-white)]">
                        Ödül: {island.reward.displayName}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--sparkid-muted)]">
                        {island.reward.description}
                    </p>
                </div>
            </section>

            {rewardUnlocked && (
                <section className="pointer-events-auto absolute left-1/2 top-5 z-30 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 rounded-[1.5rem] border border-[var(--sparkid-yellow)]/35 bg-[var(--sparkid-card)]/90 p-4 text-center shadow-[0_18px_44px_rgba(255,216,74,0.18)] backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-yellow)]">
                        {progress.rewardClaimed ? "Ödül Kazanıldı" : "Sandık Hazır"}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-[var(--sparkid-white)]">
                        {progress.rewardClaimed
                            ? `${island.reward.displayName} kazandın!`
                            : "3 bölümü tamamladın. Sandığı açabilirsin."}
                    </h2>

                    <p className="mt-1 text-xs font-semibold leading-5 text-[var(--sparkid-muted)]">
                        {progress.rewardClaimed
                            ? island.reward.description
                            : "Ortadaki ödül sandığı artık kilitli değil."}
                    </p>

                    {progress.rewardClaimed && (
                        <button
                            type="button"
                            onClick={() => setRewardModalOpen(true)}
                            className="mt-3 rounded-2xl border border-[var(--sparkid-yellow)]/35 bg-[var(--sparkid-yellow)] px-4 py-2 text-xs font-black text-[var(--sparkid-navy-dark)] shadow-[0_12px_28px_rgba(255,216,74,0.18)] transition hover:scale-[1.02]"
                        >
                            Ödülü Gör
                        </button>
                    )}
                </section>
            )}

            {rewardModalOpen && (
                <RewardUnlockedModal
                    reward={island.reward}
                    onClose={() => setRewardModalOpen(false)}
                />
            )}

            {process.env.NODE_ENV !== "production" && (
                <button
                    type="button"
                    onClick={progress.reset}
                    className="absolute bottom-5 left-5 z-30 rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-muted)] shadow-xl backdrop-blur-xl transition hover:border-[var(--sparkid-yellow)]/45 hover:text-[var(--sparkid-yellow)]"
                >
                    Dev Reset Progress
                </button>
            )}

            <aside className="absolute bottom-5 right-5 z-20 w-[360px] max-w-[calc(100vw-2rem)] space-y-2 rounded-[1.75rem] border border-white/10 bg-[var(--sparkid-card)]/85 p-4 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-yellow)]">
                        Bölümler
                    </p>

                    <Link
                        href="/levels"
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-muted)] transition hover:bg-white/10"
                    >
                        Geri
                    </Link>
                </div>

                {lessons.map((lesson, index) => {
                    const lessonNumber = index + 1
                    const locked = lesson.status === "locked"
                    const completed = lessonNumber <= progress.completedLessonNumber
                    const current = !completed && !locked && lessonNumber === nextLessonNumber

                    return (
                        <Link
                            key={lesson.id}
                            href={locked ? "#" : lesson.route}
                            aria-disabled={locked}
                            className={`block rounded-2xl border p-3 transition ${
                                completed
                                    ? "border-[var(--sparkid-success)]/30 bg-[var(--sparkid-success)]/10 hover:border-[var(--sparkid-success)]/70"
                                    : locked
                                    ? "pointer-events-none border-white/10 bg-white/[0.04] opacity-60"
                                    : current
                                        ? "border-[var(--sparkid-cyan)]/55 bg-[var(--sparkid-cyan)]/15 shadow-[0_0_26px_rgba(53,229,242,0.14)] hover:border-[var(--sparkid-cyan)]"
                                        : "border-[var(--sparkid-cyan)]/35 bg-[var(--sparkid-panel)] hover:border-[var(--sparkid-cyan)]"
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

                                <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-black ${
                                        completed
                                            ? "bg-[var(--sparkid-success)]/15 text-[var(--sparkid-success)]"
                                            : current
                                                ? "bg-[var(--sparkid-cyan)]/15 text-[var(--sparkid-cyan)]"
                                                : "bg-white/5 text-[var(--sparkid-secondary)]"
                                    }`}
                                >
                                    {completed
                                        ? "Tekrar"
                                        : locked
                                            ? "Kilitli"
                                            : "Sıradaki"}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </aside>
        </main>
    )
}
