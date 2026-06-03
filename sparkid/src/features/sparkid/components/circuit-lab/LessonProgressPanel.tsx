"use client"

type LessonProgressPanelProps = {
    title: string
    learningGoal?: string
    missionSteps?: string[]
    lessonComplete: boolean
}

export default function LessonProgressPanel({
    title,
    learningGoal,
    missionSteps = [],
    lessonComplete,
}: LessonProgressPanelProps) {
    if (!learningGoal && missionSteps.length === 0) {
        return null
    }

    return (
        <section className="mb-3 rounded-[1.5rem] border border-white/10 bg-[var(--sparkid-card)]/88 p-4 shadow-[0_18px_42px_rgba(2,11,31,0.26)] ring-1 ring-white/5 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-cyan)]">
                        Bölüm hedefi
                    </p>
                    <h2 className="mt-1 text-base font-black text-[var(--sparkid-white)]">
                        {title}
                    </h2>
                </div>

                <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                        lessonComplete
                            ? "border-emerald-300/35 bg-emerald-300/18 text-emerald-100"
                            : "border-[var(--sparkid-cyan)]/25 bg-[var(--sparkid-cyan)]/10 text-[var(--sparkid-cyan)]"
                    }`}
                >
                    {lessonComplete ? "Tamam" : "Aktif"}
                </span>
            </div>

            {learningGoal && (
                <p className="mt-3 text-sm font-bold leading-6 text-[var(--sparkid-muted)]">
                    {learningGoal}
                </p>
            )}

            {missionSteps.length > 0 && (
                <ol className="mt-3 space-y-2">
                    {missionSteps.map((step, index) => (
                        <li
                            key={`${step}-${index}`}
                            className="flex items-start gap-2 text-sm font-bold leading-5 text-[var(--sparkid-white)]/86"
                        >
                            <span
                                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-black ${
                                    lessonComplete
                                        ? "bg-emerald-300 text-[var(--sparkid-navy-dark)]"
                                        : "bg-[var(--sparkid-cyan)]/18 text-[var(--sparkid-cyan)]"
                                }`}
                            >
                                {lessonComplete ? "✓" : index + 1}
                            </span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}
