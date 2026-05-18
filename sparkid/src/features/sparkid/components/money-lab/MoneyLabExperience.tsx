"use client"

import { Suspense, useMemo, useState } from "react"
import { ContactShadows, Html, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

import AutoCableLayer from "@/features/sparkid/components/circuit-lab/AutoCableLayer"
import {
    CableConnectionModeProvider,
    type CableWireConnection,
} from "@/features/sparkid/components/circuit-lab/CableConnectionModeContext"
import { CircuitBoard } from "@/features/sparkid/components/circuit-lab/CircuitBoard"
import CircuitCameraRig, {
    type CircuitCameraView,
} from "@/features/sparkid/components/circuit-lab/CircuitCameraRig"
import { CircuitConnectionProvider } from "@/features/sparkid/components/circuit-lab/CircuitConnectionContext"
import CircuitViewControls from "@/features/sparkid/components/circuit-lab/CircuitViewControls"
import PluggerPort from "@/features/sparkid/components/circuit-lab/PluggerPort"
import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import {
    CIRCUIT_BOARD_CONFIG,
    type GridCell,
    type Vec3,
} from "@/features/sparkid/components/circuit-lab/data/circuitBoardConfig"
import { getGridCellCenter } from "@/features/sparkid/components/circuit-lab/utils/getGridCellCenter"

type MoneyTool = "water" | "choiceLine"

const WATER_CARD_MODEL_PATH = "/models/money/product-card-water-normal.glb"

const toolLabels: Record<MoneyTool, string> = {
    water: "Su Kartı",
    choiceLine: "Choice Line",
}

function isSameCell(a: GridCell | null, b: GridCell | null) {
    if (!a || !b) return false
    return a.row === b.row && a.col === b.col
}

function getWaterCardPosition(cell: GridCell): Vec3 {
    const [x, y, z] = getGridCellCenter(CIRCUIT_BOARD_CONFIG.grid, cell)

    return [x, y + 0.12, z]
}

function SceneFallback() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Money Lab yükleniyor...
            </div>
        </Html>
    )
}

function WaterProductCard({
    position,
}: {
    position: Vec3
}) {
    const { scene } = useGLTF(WATER_CARD_MODEL_PATH)

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)

        clone.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return

            object.castShadow = true
            object.receiveShadow = true

            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material]

            materials.forEach((material) => {
                material.needsUpdate = true
            })
        })

        return clone
    }, [scene])

    return (
        <group
            name="MoneyWaterProductCard"
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.16}
        >
            <primitive object={clonedScene} />

            <PluggerPort
                id="product-water:a"
                ownerId="product-water"
                ownerKind="junction"
                kind="socket"
                position={[-0.66, 0.1, 0.22]}
                label="A"
                ringColor="#35E5F2"
                visible
                scale={0.44}
                portType="socket"
                orientation="left"
            />

            <PluggerPort
                id="product-water:b"
                ownerId="product-water"
                ownerKind="junction"
                kind="socket"
                position={[0.66, 0.1, 0.22]}
                label="B"
                ringColor="#FFD84A"
                visible
                scale={0.44}
                portType="socket"
                orientation="right"
            />
        </group>
    )
}

function MoneyLabScene({
    selectedTool,
    waterCell,
    hoveredCell,
    resetKey,
    cableModeToken,
    cameraView,
    onCellHover,
    onCellSelect,
    onWiresChange,
}: {
    selectedTool: MoneyTool | null
    waterCell: GridCell | null
    hoveredCell: GridCell | null
    resetKey: number
    cableModeToken: number
    cameraView: CircuitCameraView
    onCellHover: (cell: GridCell | null) => void
    onCellSelect: (cell: GridCell) => void
    onWiresChange: (wires: CableWireConnection[]) => void
}) {
    const selectedPart = selectedTool === "water" ? "battery" : null
    const cableModeEnabled = selectedTool === "choiceLine"
    const occupiedCells = waterCell && selectedTool !== "water" ? [waterCell] : []

    return (
        <>
            <IslandEnvironment accent="#35E5F2" showBackground={false} />
            <CircuitCameraRig view={cameraView} />

            <CircuitConnectionProvider key={resetKey}>
                <CableConnectionModeProvider
                    enabled={cableModeEnabled}
                    maxWires={3}
                    modeToken={cableModeToken}
                    onWiresChange={onWiresChange}
                >
                    <CircuitBoard
                        tableConfig={CIRCUIT_BOARD_CONFIG.table}
                        gridConfig={CIRCUIT_BOARD_CONFIG.grid}
                        selectedPart={selectedPart}
                        hoveredCell={hoveredCell}
                        occupiedCells={occupiedCells}
                        showGrid
                        showDebugCells={false}
                        onCellHover={onCellHover}
                        onCellSelect={(cell) => {
                            if (
                                waterCell &&
                                selectedTool !== "water" &&
                                isSameCell(cell, waterCell)
                            ) {
                                return
                            }

                            onCellSelect(cell)
                        }}
                    >
                        {waterCell && (
                            <WaterProductCard
                                position={getWaterCardPosition(waterCell)}
                            />
                        )}
                    </CircuitBoard>

                    <AutoCableLayer active={false} />
                </CableConnectionModeProvider>
            </CircuitConnectionProvider>

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.28, 0]}
                receiveShadow
            >
                <planeGeometry args={[9, 9]} />
                <meshStandardMaterial
                    color="#10151f"
                    roughness={0.86}
                    metalness={0.02}
                />
            </mesh>

            <ContactShadows
                position={[0, -0.24, 0]}
                opacity={0.36}
                scale={7}
                blur={2.2}
                far={3.2}
            />
        </>
    )
}

function MoneyToolsTray({
    selectedTool,
    onSelectTool,
    onReset,
}: {
    selectedTool: MoneyTool | null
    onSelectTool: (tool: MoneyTool) => void
    onReset: () => void
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-cyan)]">
                Money Kutusu
            </p>

            <div className="mt-4 grid gap-3">
                {(["water", "choiceLine"] as MoneyTool[]).map((tool) => {
                    const active = selectedTool === tool

                    return (
                        <button
                            key={tool}
                            type="button"
                            onClick={() => onSelectTool(tool)}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
                                active
                                    ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-yellow)]/15"
                                    : "border-[var(--sparkid-cyan)]/35 bg-[var(--sparkid-panel)]/80"
                            }`}
                        >
                            <span className="text-2xl">
                                {tool === "water" ? "💧" : "⌁"}
                            </span>
                            <span>
                                <span className="block text-sm font-black text-white">
                                    {toolLabels[tool]}
                                </span>
                                <span className="block text-xs font-semibold text-white/55">
                                    {tool === "water"
                                        ? "Grid'e yerleştir"
                                        : "İki plug seç"}
                                </span>
                            </span>
                        </button>
                    )
                })}

                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/10"
                >
                    Sıfırla
                </button>
            </div>
        </section>
    )
}

export default function MoneyLabExperience() {
    const [selectedTool, setSelectedTool] = useState<MoneyTool | null>(null)
    const [waterCell, setWaterCell] = useState<GridCell | null>(null)
    const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null)
    const [resetKey, setResetKey] = useState(0)
    const [cableModeToken, setCableModeToken] = useState(0)
    const [cameraView, setCameraView] = useState<CircuitCameraView>("front")
    const [, setWires] = useState<CableWireConnection[]>([])

    const handleSelectTool = (tool: MoneyTool) => {
        if (tool === "choiceLine") {
            setCableModeToken((current) => current + 1)
        }

        setSelectedTool(tool)
    }

    const handleCellSelect = (cell: GridCell) => {
        if (selectedTool !== "water") return

        setWaterCell(cell)
        setHoveredCell(null)
        setSelectedTool(null)
        setWires([])
        setCableModeToken((current) => current + 1)
        setResetKey((current) => current + 1)
    }

    const reset = () => {
        setSelectedTool(null)
        setWaterCell(null)
        setHoveredCell(null)
        setWires([])
        setCableModeToken((current) => current + 1)
        setResetKey((current) => current + 1)
    }

    const selectedLabel = selectedTool ? toolLabels[selectedTool] : "Item seçilmedi"

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#05070b] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-70"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(53,229,242,0.06),rgba(2,11,31,0.2)_54%,rgba(2,11,31,0.44)_100%)]"
            />

            <Canvas
                shadows
                dpr={[1, 1.5]}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
                camera={{
                    position: [3.8, 2.35, 4.55],
                    fov: 31,
                    near: 0.1,
                    far: 100,
                }}
            >
                <Suspense fallback={<SceneFallback />}>
                    <MoneyLabScene
                        selectedTool={selectedTool}
                        waterCell={waterCell}
                        hoveredCell={hoveredCell}
                        resetKey={resetKey}
                        cableModeToken={cableModeToken}
                        cameraView={cameraView}
                        onCellHover={setHoveredCell}
                        onCellSelect={handleCellSelect}
                        onWiresChange={setWires}
                    />
                </Suspense>
            </Canvas>

            <CircuitViewControls
                activeView={cameraView}
                onViewChange={setCameraView}
            />

            <div className="pointer-events-auto absolute left-4 top-4 z-40 w-[360px]">
                <section className="mb-3 rounded-3xl border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                        Money Board Test
                    </p>
                    <h1 className="mt-2 text-xl font-black tracking-tight text-white">
                        Money Item → Grid Yerleşimi
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                        Seçili araç:{" "}
                        <span className="font-black text-yellow-200">
                            {selectedLabel}
                        </span>
                    </p>
                </section>

                <MoneyToolsTray
                    selectedTool={selectedTool}
                    onSelectTool={handleSelectTool}
                    onReset={reset}
                />
            </div>
        </main>
    )
}

useGLTF.preload(WATER_CARD_MODEL_PATH)
