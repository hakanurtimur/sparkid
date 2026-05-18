"use client"

import { Canvas } from "@react-three/fiber"

import {
    SparkidBlockButton,
    type SparkidBlockKind,
} from "@/features/sparkid/components/ui/SparkidBlockButtonKit"

import type { CircuitPartTool, CircuitPlacedParts } from "./types"

type CircuitPartsTrayProps = {
    selectedTool?: CircuitPartTool | null
    placedParts: CircuitPlacedParts
    onSelectTool?: (tool: CircuitPartTool) => void
    onReset?: () => void
}

type TrayPart = {
    id:
        | CircuitPartTool
        | "reset"
        | "warning"
        | "series-circuit"
        | "parallel-circuit"
        | "free-play"
    label: string
    blockKind: SparkidBlockKind
    limit: number
    position: [number, number, number]
}

const parts = [
    { id: "battery", label: "Pil", blockKind: "battery", limit: 1, position: [-0.62, 2.35, 0] },
    { id: "bulb", label: "Ampul", blockKind: "bulb", limit: 1, position: [-0.62, 1.4, 0] },
    { id: "switch", label: "Anahtar", blockKind: "switch", limit: 1, position: [-0.62, 0.45, 0] },
    { id: "cable", label: "Kablo", blockKind: "cable", limit: 3, position: [-0.62, -0.5, 0] },
    { id: "hint", label: "İpucu", blockKind: "question", limit: 0, position: [-0.62, -1.45, 0] },
    { id: "reset", label: "Sıfırla", blockKind: "reset", limit: 0, position: [-0.62, -2.4, 0] },
    { id: "warning", label: "Uyarı", blockKind: "warning", limit: 0, position: [0.62, 1.85, 0] },
    { id: "series-circuit", label: "Seri", blockKind: "series-circuit", limit: 0, position: [0.62, 0.9, 0] },
    { id: "parallel-circuit", label: "Paralel", blockKind: "parallel-circuit", limit: 0, position: [0.62, -0.05, 0] },
    { id: "free-play", label: "Özgür", blockKind: "free-play", limit: 0, position: [0.62, -1, 0] },
] satisfies TrayPart[]

function isToolPart(id: TrayPart["id"]): id is CircuitPartTool {
    return (
        id === "battery" ||
        id === "bulb" ||
        id === "switch" ||
        id === "cable" ||
        id === "hint"
    )
}

function getPlacedCount(tool: CircuitPartTool, placedParts: CircuitPlacedParts) {
    if (tool === "battery") return placedParts.battery ? 1 : 0
    if (tool === "bulb") return placedParts.bulb ? 1 : 0
    if (tool === "switch") return placedParts.switch ? 1 : 0
    if (tool === "cable") return placedParts.cableCount

    return 0
}

function getStatusLabel(part: TrayPart, placedParts: CircuitPlacedParts) {
    if (part.id === "reset") return "Baştan kur"
    if (!isToolPart(part.id)) return "Yakında"

    const placedCount = getPlacedCount(part.id, placedParts)
    const remainingCount = Math.max(part.limit - placedCount, 0)
    const isHint = part.id === "hint"
    const isCable = part.id === "cable"
    const isPlaceablePlaced = !isHint && !isCable && placedCount > 0
    const cableLimitReached = isCable && remainingCount <= 0

    if (isHint) return "Yardım al"
    if (cableLimitReached) return "Bağlantıyı düzelt"
    if (isPlaceablePlaced) return "Yerini değiştir"

    return `${remainingCount}/${part.limit} hak`
}

export default function CircuitPartsTray({
    selectedTool,
    placedParts,
    onSelectTool,
    onReset,
}: CircuitPartsTrayProps) {
    const activePart = parts.find((part) => part.id === selectedTool)

    return (
        <section className="p-1">
            <div className="mb-2 rounded-2xl border border-white/10 bg-black/35 px-3 py-2 shadow-[0_12px_28px_rgba(2,11,31,0.25)] backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sparkid-yellow)]">
                    Devre Kutusu
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-[var(--sparkid-secondary)]">
                    {activePart
                        ? `${activePart.label}: ${getStatusLabel(activePart, placedParts)}`
                    : "3D araç rafı"}
                </p>
            </div>

            <div className="h-[calc(100vh-220px)] min-h-[500px] max-h-[620px] overflow-visible">
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{
                        position: [0, -0.05, 8.85],
                        fov: 42,
                        near: 0.1,
                        far: 20,
                    }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: "high-performance",
                    }}
                >
                    <ambientLight intensity={1.08} />
                    <directionalLight
                        position={[2.2, 2.8, 4]}
                        intensity={2}
                        color="#fff8e8"
                    />
                    <pointLight
                        position={[-2.6, 1.1, 2.8]}
                        intensity={0.9}
                        color="#35E5F2"
                    />

                    {parts.map((part) => (
                        <SparkidBlockButton
                            key={part.id}
                            kind={part.blockKind}
                            position={part.position}
                            scale={0.78}
                            selected={isToolPart(part.id) && selectedTool === part.id}
                            interactive
                            showConnectors={false}
                            showIndicators
                            showLabel
                            onClick={() => {
                                if (part.id === "reset") {
                                    onReset?.()
                                    return
                                }

                                if (!isToolPart(part.id)) return

                                onSelectTool?.(part.id)
                            }}
                        />
                    ))}
                </Canvas>
            </div>
        </section>
    )
}
