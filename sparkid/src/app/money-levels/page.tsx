import Link from "next/link"

import { moneyIslandConfigs } from "@/features/sparkid/components/assets/money/moneyIslandConfigs"

export default function MoneyLevelsPage() {
    return (
        <main className="min-h-screen bg-[var(--sparkid-navy-dark)] px-6 py-8 text-[var(--sparkid-white)]">
            <section className="mx-auto max-w-6xl">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
                    Sparkid Money Lab
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight">
                    Money Islands
                </h1>
                <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--sparkid-muted)]">
                    Finans, bütçe, birikim ve akıllı alışveriş görevleri için
                    ada haritası.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {moneyIslandConfigs.map((island) => {
                        const available = island.status === "available"

                        const card = (
                            <article
                                className={`min-h-[220px] rounded-[2rem] border p-5 shadow-2xl transition ${
                                    available
                                        ? "border-[var(--sparkid-cyan)]/45 bg-[var(--sparkid-panel)] hover:-translate-y-1 hover:border-[var(--sparkid-cyan)]"
                                        : "border-white/10 bg-white/[0.04] opacity-60"
                                }`}
                            >
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-yellow)]">
                                    Ada {island.order}
                                </p>
                                <h2 className="mt-4 text-xl font-black">
                                    {island.title}
                                </h2>
                                <p className="mt-2 text-sm font-bold text-[var(--sparkid-muted)]">
                                    {island.name}
                                </p>
                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3">
                                    <p className="text-xs font-black text-[var(--sparkid-white)]">
                                        Ödül: {island.reward}
                                    </p>
                                </div>
                                <span className="mt-5 inline-flex rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--sparkid-secondary)]">
                                    {available ? "Açık" : "Kilitli"}
                                </span>
                            </article>
                        )

                        if (!available) {
                            return <div key={island.id}>{card}</div>
                        }

                        return (
                            <Link key={island.id} href="/money-lab">
                                {card}
                            </Link>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
