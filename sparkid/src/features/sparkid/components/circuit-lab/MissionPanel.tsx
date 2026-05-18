"use client"

import type { CircuitLabState } from "./types"

type MissionPanelProps = {
    circuitState: CircuitLabState
}

type MissionItem = {
    label: string
    complete: boolean
}

export default function MissionPanel({ circuitState }: MissionPanelProps) {
    const missions: MissionItem[] = [
        {
            label: "Kabloyu bağlantı noktasına tak",
            complete: circuitState.connectionCount > 0,
        },
        {
            label: "Pili devreye bağla",
            complete: circuitState.hasBatteryConnection,
        },
        {
            label: "Anahtarı devreye ekle",
            complete: circuitState.hasSwitchConnection,
        },
        {
            label: "Ampulü devreye bağla",
            complete: circuitState.hasBulbConnection,
        },
        {
            label: "Anahtarı aç",
            complete: circuitState.switchMode === "on",
        },
        {
            label: "Enerji akışını gözlemle",
            complete: circuitState.powered,
        },
    ]

    const completedCount = missions.filter((mission) => mission.complete).length

    return (
        <section className="rounded-3xl border border-[var(--sparkid-border)] bg-[var(--sparkid-card)] p-5 shadow-[0_18px_45px_rgba(2,11,31,0.28)]">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-cyan)]">
                        Görevler
                    </p>
                    <h2 className="mt-1 text-xl font-black text-[var(--sparkid-white)]">
                        Devre Laboratuvarı
                    </h2>
                </div>

                <div className="rounded-2xl bg-[var(--sparkid-panel)] px-3 py-2 text-sm font-black text-[var(--sparkid-yellow)]">
                    {completedCount}/{missions.length}
                </div>
            </div>

            <div className="mt-5 space-y-2">
                {missions.map((mission) => (
                    <div
                        key={mission.label}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--sparkid-border)] bg-[var(--sparkid-panel)] px-3 py-2"
                    >
                        <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                                mission.complete
                                    ? "bg-[var(--sparkid-cyan)] text-[var(--sparkid-navy-dark)]"
                                    : "bg-[var(--sparkid-navy-soft)] text-[var(--sparkid-secondary)]"
                            }`}
                        >
                            {mission.complete ? "✓" : ""}
                        </span>
                        <span className="text-sm font-bold leading-5 text-[var(--sparkid-muted)]">
                            {mission.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
