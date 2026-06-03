"use client"

import type { SparkidBlockKind } from "@/features/sparkid/components/ui/SparkidBlockButtonKit"

import {
    DEFAULT_CIRCUIT_AVAILABLE_TOOLS,
    DEFAULT_CIRCUIT_TOOL_LIMITS,
    type CircuitPartTool,
    type CircuitPlacedParts,
    type CircuitToolLimits,
} from "./types"

type CircuitPartsTrayProps = {
    selectedTool?: CircuitPartTool | null
    placedParts: CircuitPlacedParts
    availableTools?: CircuitPartTool[]
    toolLimits?: CircuitToolLimits
    onSelectTool?: (tool: CircuitPartTool) => void
    onReset?: () => void
}

type TrayPart = {
    id: CircuitPartTool | "reset"
    label: string
    blockKind: SparkidBlockKind
    limit: number
}

const parts = [
    { id: "battery", label: "Pil", blockKind: "battery", limit: 1 },
    { id: "bulb", label: "Ampul", blockKind: "bulb", limit: 1 },
    { id: "bulb2", label: "Ampul 2", blockKind: "bulb", limit: 1 },
    { id: "switch", label: "Anahtar", blockKind: "switch", limit: 1 },
    { id: "cable", label: "Kablo", blockKind: "cable", limit: 3 },
    { id: "cableCutter", label: "Kesici", blockKind: "warning", limit: 0 },
    { id: "hint", label: "İpucu", blockKind: "question", limit: 0 },
    { id: "reset", label: "Sıfırla", blockKind: "reset", limit: 0 },
] satisfies TrayPart[]

const blockIcons: Record<SparkidBlockKind, string> = {
    battery: "▰",
    bulb: "◉",
    switch: "⌁",
    cable: "∿",
    energy: "⚡",
    turn: "↪",
    reset: "↺",
    question: "?",
    warning: "!",
    "series-circuit": "S",
    "parallel-circuit": "P",
    "free-play": "*",
}

const blockColors: Record<SparkidBlockKind, string> = {
    battery: "#2563eb",
    bulb: "#14b8a6",
    switch: "#8b5cf6",
    cable: "#06b6d4",
    energy: "#fbbf24",
    turn: "#06b6d4",
    reset: "#475569",
    question: "#f97316",
    warning: "#FFB72C",
    "series-circuit": "#35E5F2",
    "parallel-circuit": "#8B5CFF",
    "free-play": "#45E39A",
}

function isToolPart(id: TrayPart["id"]): id is CircuitPartTool {
    return (
        id === "battery" ||
        id === "bulb" ||
        id === "bulb2" ||
        id === "switch" ||
        id === "cable" ||
        id === "cableCutter" ||
        id === "hint"
    )
}

function getPlacedCount(tool: CircuitPartTool, placedParts: CircuitPlacedParts) {
    if (tool === "battery") return placedParts.battery ? 1 : 0
    if (tool === "bulb") return placedParts.bulb ? 1 : 0
    if (tool === "bulb2") return placedParts.bulb2 ? 1 : 0
    if (tool === "switch") return placedParts.switch ? 1 : 0
    if (tool === "cable") return placedParts.cableCount
    if (tool === "cableCutter") return 0

    return 0
}

function getStatusLabel(
    part: TrayPart,
    placedParts: CircuitPlacedParts,
    toolLimits: Record<CircuitPartTool, number>,
) {
    if (part.id === "reset") return "Baştan kur"
    if (!isToolPart(part.id)) return "Yakında"

    const placedCount = getPlacedCount(part.id, placedParts)
    const limit = toolLimits[part.id] ?? part.limit
    const remainingCount = Math.max(limit - placedCount, 0)
    const isHint = part.id === "hint"
    const isCable = part.id === "cable"
    const isCableCutter = part.id === "cableCutter"
    const isPlaceablePlaced = !isHint && !isCable && placedCount > 0
    const cableLimitReached = isCable && remainingCount <= 0

    if (isHint) return "Yardım al"
    if (isCableCutter) return "Kabloyu kes"
    if (cableLimitReached) return "Bağlantıyı düzelt"
    if (isPlaceablePlaced) return "Yerini değiştir"

    return `${remainingCount}/${limit} hak`
}

export default function CircuitPartsTray({
    selectedTool,
    placedParts,
    availableTools = DEFAULT_CIRCUIT_AVAILABLE_TOOLS,
    toolLimits,
    onSelectTool,
    onReset,
}: CircuitPartsTrayProps) {
    const resolvedToolLimits = {
        ...DEFAULT_CIRCUIT_TOOL_LIMITS,
        ...toolLimits,
    }
    const visibleTools = new Set(availableTools)

    if (visibleTools.has("cable")) {
        visibleTools.add("cableCutter")
    }

    const visibleParts = parts.filter((part) => (
        !isToolPart(part.id) || visibleTools.has(part.id)
    ))
    const activePart = parts.find((part) => part.id === selectedTool)

    return (
        <section className="max-h-[calc(100vh-180px)] overflow-y-auto p-1 pr-2 [scrollbar-color:rgba(53,229,242,0.45)_transparent] [scrollbar-width:thin]">
            <div className="mb-2 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 shadow-[0_12px_28px_rgba(2,11,31,0.22)] backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-yellow)]">
                    Devre Kutusu
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-[var(--sparkid-secondary)]">
                    {activePart
                        ? `${activePart.label}: ${getStatusLabel(activePart, placedParts, resolvedToolLimits)}`
                    : "Araç rafı"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                {visibleParts.map((part) => {
                    const selected = isToolPart(part.id) && selectedTool === part.id
                    const status = getStatusLabel(part, placedParts, resolvedToolLimits)
                    const color = blockColors[part.blockKind]

                    return (
                        <button
                            key={part.id}
                            type="button"
                            onClick={() => {
                                if (part.id === "reset") {
                                    onReset?.()
                                    return
                                }

                                if (!isToolPart(part.id)) return
                                if (!visibleTools.has(part.id)) return

                                onSelectTool?.(part.id)
                            }}
                            className={`group relative flex h-[66px] items-center gap-2.5 overflow-hidden rounded-[1.2rem] border px-2.5 text-left shadow-[0_14px_30px_rgba(2,11,31,0.28)] transition active:translate-y-0.5 ${
                                selected
                                    ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-cyan)]/20"
                                    : "border-white/10 bg-[var(--sparkid-card)]/82 hover:border-[var(--sparkid-cyan)]/55 hover:bg-[var(--sparkid-panel)]"
                            }`}
                        >
                            <span
                                aria-hidden
                                className="absolute inset-x-2.5 bottom-0 h-1.5 rounded-t-full opacity-80"
                                style={{ backgroundColor: color }}
                            />
                            <span
                                className="grid h-10 w-10 shrink-0 place-items-center rounded-[1rem] border border-white/15 text-xl font-black text-white shadow-[inset_0_-8px_12px_rgba(0,0,0,0.25),0_10px_20px_rgba(0,0,0,0.22)]"
                                style={{
                                    background: `linear-gradient(145deg, ${color}, #061A3D 82%)`,
                                }}
                            >
                                {blockIcons[part.blockKind]}
                            </span>

                            <span className="min-w-0">
                                <span className="block truncate text-xs font-black uppercase tracking-[0.06em] text-[var(--sparkid-white)]">
                                    {part.label}
                                </span>
                                <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--sparkid-secondary)]">
                                    {status}
                                </span>
                            </span>
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
