type RouteLoadingScreenProps = {
    title?: string
    message?: string
}

export default function RouteLoadingScreen({
                                               title = "Sparkid yükleniyor",
                                               message = "Sahne hazırlanıyor...",
                                           }: RouteLoadingScreenProps) {
    return (
        <main className="grid min-h-screen place-items-center overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-70"
            />

            <section className="relative z-10 w-[min(420px,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-[var(--sparkid-card)]/85 p-6 text-center shadow-2xl backdrop-blur-xl">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-[var(--sparkid-cyan)]/30 bg-[var(--sparkid-cyan)]/10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--sparkid-cyan)] border-t-transparent" />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-yellow)]">
                    Sparkid
                </p>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--sparkid-white)]">
                    {title}
                </h1>

                <p className="mt-2 text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                    {message}
                </p>
            </section>
        </main>
    )
}
