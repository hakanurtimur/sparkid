import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--sparkid-navy-dark)] px-6 py-6 text-[var(--sparkid-white)] sm:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Image
            src="/branding/sparkid-logo-horizontal-colored.svg"
            alt="Sparkid"
            width={180}
            height={180}
            className="h-12 w-auto"
            priority
          />
          <Button
            asChild
            variant="outline"
            className="hidden rounded-full border-[var(--sparkid-border)] bg-[var(--sparkid-card)] px-5 py-3 text-sm font-black text-[var(--sparkid-cyan)] hover:border-[var(--sparkid-cyan)] hover:bg-[var(--sparkid-panel)] hover:text-[var(--sparkid-cyan)] sm:inline-flex"
          >
            <Link href="/circuit">Lab&apos;i Aç</Link>
          </Button>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.24em] text-[var(--sparkid-cyan)]">
              Sparkid Circuit Lab
            </p>
            <h1 className="text-5xl font-black leading-tight text-[var(--sparkid-white)] sm:text-7xl">
              Sparkid
            </h1>
            <p className="mt-6 text-2xl font-bold text-[var(--sparkid-yellow)]">
            Çocuklar için 3D yapay zekâ deney laboratuvarı.
          </p>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[var(--sparkid-muted)]">
            Pil, kablo, anahtar ve ampulü bir araya getir; devreni kur, ışığı
            yak ve elektriğin nasıl çalıştığını keşfet.
          </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-14 rounded-full bg-primary px-7 text-base font-black text-primary-foreground shadow-[0_18px_42px_rgba(255,216,74,0.26)] transition hover:-translate-y-0.5 hover:bg-[var(--sparkid-orange)]"
              >
                <Link href="/circuit">Devre Laboratuvarına Başla</Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-full bg-[var(--sparkid-cyan)] px-7 text-base font-black text-[var(--sparkid-navy-dark)] shadow-[0_18px_42px_rgba(53,229,242,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--sparkid-cyan-dark)]"
              >
                <Link href="/money-levels">Money Lab&apos;e Başla</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full border-[var(--sparkid-border)] bg-[var(--sparkid-card)] px-7 text-base font-black text-[var(--sparkid-white)] transition hover:-translate-y-0.5 hover:border-[var(--sparkid-cyan)] hover:bg-[var(--sparkid-panel)] hover:text-[var(--sparkid-white)]"
              >
                <Link href="/sparkid">Karakterleri Keşfet</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--sparkid-border)] bg-[var(--sparkid-card)] p-5 shadow-[0_30px_80px_rgba(2,11,31,0.55)]">
            <div className="rounded-[1.5rem] bg-[var(--sparkid-panel)] p-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/branding/sparkid-logo-icon-only-colored.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16"
                />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--sparkid-cyan)]">
                    Playable Lab
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-[var(--sparkid-white)]">
                    Devreyi Kur
                  </h2>
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                {["Pil", "Kablo", "Anahtar", "Ampul"].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-[var(--sparkid-border)] bg-[var(--sparkid-navy-soft)] px-4 py-3"
                  >
                    <span className="font-black text-[var(--sparkid-white)]">
                      {item}
                    </span>
                    <span className="rounded-full bg-[var(--sparkid-yellow)] px-3 py-1 text-xs font-black text-[var(--sparkid-navy-dark)]">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
