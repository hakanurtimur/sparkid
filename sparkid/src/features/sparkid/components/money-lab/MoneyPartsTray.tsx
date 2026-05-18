"use client"

export type MoneyTool = "wallet" | "product" | "choiceLine" | "hint"

type MoneyPartsTrayProps = {
    selectedTool: MoneyTool | null
    onSelectTool: (tool: MoneyTool) => void
    onReset: () => void
}

const tools: Array<{
    id: MoneyTool
    label: string
    icon: string
    description: string
}> = [
    {
        id: "wallet",
        label: "Wallet",
        icon: "▣",
        description: "Cüzdan kaynağı",
    },
    {
        id: "product",
        label: "Product",
        icon: "□",
        description: "Ürün kartları",
    },
    {
        id: "choiceLine",
        label: "Choice Line",
        icon: "⌁",
        description: "Ürünleri sınıflara bağla",
    },
    {
        id: "hint",
        label: "Hint",
        icon: "?",
        description: "Sparky ipucu",
    },
]

export default function MoneyPartsTray({
    selectedTool,
    onSelectTool,
    onReset,
}: MoneyPartsTrayProps) {
    return (
        <nav className="flex flex-col gap-3">
            {tools.map((tool) => {
                const active = selectedTool === tool.id

                return (
                    <button
                        key={tool.id}
                        type="button"
                        onClick={() => onSelectTool(tool.id)}
                        className={`group flex w-[178px] items-center gap-3 rounded-3xl border px-3 py-3 text-left shadow-xl backdrop-blur-md transition hover:-translate-y-0.5 ${
                            active
                                ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-yellow)]/18"
                                : "border-white/10 bg-[var(--sparkid-card)]/86 hover:border-[var(--sparkid-cyan)]/55"
                        }`}
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--sparkid-navy-dark)] text-xl font-black text-white">
                            {tool.icon}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-black text-[var(--sparkid-white)]">
                                {tool.label}
                            </span>
                            <span className="block truncate text-[10px] font-bold text-[var(--sparkid-secondary)]">
                                {tool.description}
                            </span>
                        </span>
                    </button>
                )
            })}

            <button
                type="button"
                onClick={onReset}
                className="flex w-[178px] items-center justify-center rounded-3xl border border-white/10 bg-black/40 px-3 py-3 text-sm font-black text-white shadow-xl backdrop-blur-md transition hover:border-red-300/55 hover:bg-red-400/10"
            >
                Sıfırla
            </button>
        </nav>
    )
}
