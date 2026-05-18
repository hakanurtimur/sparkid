"use client"

import type { CircuitCameraView } from "./CircuitCameraRig"

type CircuitViewControlsProps = {
    activeView: CircuitCameraView
    onViewChange: (view: CircuitCameraView) => void
}

const viewOptions: Array<{
    view: CircuitCameraView
    label: string
}> = [
    { view: "front", label: "Ön" },
    { view: "left", label: "Sol" },
    { view: "right", label: "Sağ" },
    { view: "top", label: "Üst" },
    { view: "close", label: "Yakın" },
]

export default function CircuitViewControls({
    activeView,
    onViewChange,
}: CircuitViewControlsProps) {
    return (
        <div className="pointer-events-none absolute right-4 top-4 z-40 flex justify-end">
            <div className="pointer-events-auto flex flex-wrap justify-end gap-2 rounded-3xl border border-white/10 bg-black/45 p-2 shadow-2xl backdrop-blur-xl">
                {viewOptions.map((option) => {
                    const active = activeView === option.view

                    return (
                        <button
                            key={option.view}
                            type="button"
                            onClick={() => onViewChange(option.view)}
                            className={`min-h-10 rounded-2xl border px-3 text-xs font-black transition ${
                                active
                                    ? "border-[var(--sparkid-cyan)] bg-[var(--sparkid-cyan)] text-[var(--sparkid-navy-dark)]"
                                    : "border-white/10 bg-white/10 text-white hover:bg-white/15"
                            }`}
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
