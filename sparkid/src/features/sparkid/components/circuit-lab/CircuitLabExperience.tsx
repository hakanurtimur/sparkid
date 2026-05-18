"use client"

import { Suspense, useCallback, useMemo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Html } from "@react-three/drei"

import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import { IslandLabFloorPattern } from "@/features/sparkid/components/assets/island/IslandLabFloorPattern"
import { POWER_ISLAND_CONFIG } from "@/features/sparkid/components/assets/island/islandConfigs"

import AiTutorPanel from "./AiTutorPanel"
import AutoCableLayer from "./AutoCableLayer"
import {
    CableConnectionModeProvider,
    type CableWireConnection,
} from "./CableConnectionModeContext"
import { CircuitBoard } from "./CircuitBoard"
import CircuitCameraRig, {
    type CircuitCameraView,
} from "./CircuitCameraRig"
import { CircuitConnectionProvider } from "./CircuitConnectionContext"
import CircuitViewControls from "./CircuitViewControls"
import { ConnectableBattery } from "./ConnectableBattery"
import ConnectableCircuitSwitch from "./ConnectableCircuitSwitch"
import { ConnectableLightBulb } from "./ConnectableLightBulb"
import CircuitPartsTray from "./CircuitPartsTray"
import {
    INITIAL_CIRCUIT_PLACED_PARTS,
    isCircuitPlaceableTool,
    type CircuitPartTool,
    type CircuitPlacedParts,
} from "./types"
import {
    CIRCUIT_BOARD_CONFIG,
    type CircuitBoardGridConfig,
    type CircuitBoardTableConfig,
    type CircuitPlaceablePart,
    type GridCell,
    type Vec3,
} from "./data/circuitBoardConfig"
import { getGridCellCenter } from "./utils/getGridCellCenter"
import { checkCircuitPower } from "./utils/checkCircuitPower"
import { getSparkyLabMessage } from "./utils/getSparkyLabMessage"

export type CircuitRuntimeTuning = {
    table: CircuitBoardTableConfig
    grid: CircuitBoardGridConfig
    placement: {
        battery: {
            scale: number
            xOffset: number
            yOffset: number
            zOffset: number
        }
        switch: {
            scale: number
            xOffset: number
            yOffset: number
            zOffset: number
        }
        bulb: {
            scale: number
            xOffset: number
            yOffset: number
            zOffset: number
        }
    }
}

type CircuitLabExperienceProps = {
    tuning?: CircuitRuntimeTuning
    showDevPanel?: boolean
}

const CABLE_LIMIT = 3

const toolLabels: Record<CircuitPartTool, string> = {
    battery: "Pil",
    switch: "Anahtar",
    bulb: "Ampul",
    cable: "Kablo",
    hint: "İpucu",
}

export const DEFAULT_CIRCUIT_TUNING: CircuitRuntimeTuning = {
    table: {
        glbPath: CIRCUIT_BOARD_CONFIG.table.glbPath,
        position: CIRCUIT_BOARD_CONFIG.table.position,
        rotation: CIRCUIT_BOARD_CONFIG.table.rotation,
        scale: CIRCUIT_BOARD_CONFIG.table.scale,
    },
    grid: {
        ...CIRCUIT_BOARD_CONFIG.grid,
    },
    placement: {
        battery: {
            scale: CIRCUIT_BOARD_CONFIG.placement.battery.scale,
            xOffset: CIRCUIT_BOARD_CONFIG.placement.battery.xOffset,
            yOffset: CIRCUIT_BOARD_CONFIG.placement.battery.yOffset,
            zOffset: CIRCUIT_BOARD_CONFIG.placement.battery.zOffset,
        },
        switch: {
            scale: CIRCUIT_BOARD_CONFIG.placement.switch.scale,
            xOffset: CIRCUIT_BOARD_CONFIG.placement.switch.xOffset,
            yOffset: CIRCUIT_BOARD_CONFIG.placement.switch.yOffset,
            zOffset: CIRCUIT_BOARD_CONFIG.placement.switch.zOffset,
        },
        bulb: {
            scale: CIRCUIT_BOARD_CONFIG.placement.bulb.scale,
            xOffset: CIRCUIT_BOARD_CONFIG.placement.bulb.xOffset,
            yOffset: CIRCUIT_BOARD_CONFIG.placement.bulb.yOffset,
            zOffset: CIRCUIT_BOARD_CONFIG.placement.bulb.zOffset,
        },
    },
}

function isSameCell(a: GridCell | null, b: GridCell | null) {
    if (!a || !b) return false

    return a.row === b.row && a.col === b.col
}

function isCellOccupied(
    cell: GridCell,
    placedParts: CircuitPlacedParts,
    ignorePart?: CircuitPlaceablePart | null,
) {
    const placedCells = [
        ignorePart === "battery" ? null : placedParts.battery,
        ignorePart === "switch" ? null : placedParts.switch,
        ignorePart === "bulb" ? null : placedParts.bulb,
    ]

    return placedCells.some(
        (placedCell) => isSameCell(cell, placedCell),
    )
}

function isCellOccupiedByOtherPart(
    cell: GridCell,
    placedParts: CircuitPlacedParts,
    selectedPart: CircuitPlaceablePart | null,
) {
    return isCellOccupied(cell, placedParts, selectedPart)
}

function getOccupiedCells(
    placedParts: CircuitPlacedParts,
    selectedPart: CircuitPlaceablePart | null,
) {
    return [
        selectedPart === "battery" ? null : placedParts.battery,
        selectedPart === "switch" ? null : placedParts.switch,
        selectedPart === "bulb" ? null : placedParts.bulb,
    ].filter(
        Boolean,
    ) as GridCell[]
}

function getTunedPartPosition(
    part: CircuitPlaceablePart,
    cell: GridCell,
    tuning: CircuitRuntimeTuning,
): Vec3 {
    const [x, y, z] = getGridCellCenter(tuning.grid, cell)
    const placement = tuning.placement[part]

    return [
        x + placement.xOffset,
        y + placement.yOffset,
        z + placement.zOffset,
    ]
}

function SceneFallback() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Test sahnesi yükleniyor...
            </div>
        </Html>
    )
}

function CircuitLabScene({
                             selectedPart,
                             cableModeEnabled,
                             resetKey,
                             placedParts,
                             hoveredCell,
                             onCellHover,
                             onCellSelect,
                             onWiresChange,
                             onPendingPortChange,
                             powered,
                             switchMode,
                             onSwitchModeChange,
                             tuning,
                             cableModeToken,
                             cameraView,
                         }: {
    selectedPart: CircuitPlaceablePart | null
    cableModeEnabled: boolean
    resetKey: number
    placedParts: CircuitPlacedParts
    hoveredCell: GridCell | null
    onCellHover: (cell: GridCell | null) => void
    onCellSelect: (cell: GridCell) => void
    onWiresChange: (wires: CableWireConnection[]) => void
    onPendingPortChange: (portId: string | null) => void
    powered: boolean
    switchMode: CircuitSwitchMode
    onSwitchModeChange: (nextMode: CircuitSwitchMode) => void
    tuning: CircuitRuntimeTuning
    cableModeToken: number
    cameraView: CircuitCameraView
}) {
    const occupiedCells = useMemo(
        () => getOccupiedCells(placedParts, selectedPart),
        [placedParts, selectedPart],
    )

    return (
        <>
            <IslandEnvironment
                accent={POWER_ISLAND_CONFIG.accentColor}
                showBackground={false}
            />

            <CircuitCameraRig view={cameraView} />

            <CircuitConnectionProvider key={resetKey}>
                <CableConnectionModeProvider
                    enabled={cableModeEnabled}
                    maxWires={CABLE_LIMIT}
                    modeToken={cableModeToken}
                    onWiresChange={onWiresChange}
                    onPendingPortChange={onPendingPortChange}
                >
                    <CircuitBoard
                        tableConfig={tuning.table}
                        gridConfig={tuning.grid}
                        selectedPart={selectedPart}
                        hoveredCell={hoveredCell}
                        occupiedCells={occupiedCells}
                        showGrid
                        showDebugCells={tuning.grid.showDebugCells}
                        onCellHover={onCellHover}
                        onCellSelect={(cell) => {
                            if (
                                isCellOccupiedByOtherPart(
                                    cell,
                                    placedParts,
                                    selectedPart,
                                )
                            ) {
                                return
                            }

                            onCellSelect(cell)
                        }}
                    >
                        {placedParts.battery && (
                            <ConnectableBattery
                                id="battery"
                                position={getTunedPartPosition(
                                    "battery",
                                    placedParts.battery,
                                    tuning,
                                )}
                                scale={tuning.placement.battery.scale}
                                animation={powered ? "active" : "idle"}
                                showPorts
                            />
                        )}

                        {placedParts.switch && (
                            <ConnectableCircuitSwitch
                                id="switch-1"
                                position={getTunedPartPosition(
                                    "switch",
                                    placedParts.switch,
                                    tuning,
                                )}
                                scale={tuning.placement.switch.scale}
                                mode={switchMode}
                                animation={switchMode === "on" ? "toggle" : "idle"}
                                onModeChange={onSwitchModeChange}
                                showPorts
                            />
                        )}

                        {placedParts.bulb && (
                            <ConnectableLightBulb
                                id="bulb"
                                position={getTunedPartPosition(
                                    "bulb",
                                    placedParts.bulb,
                                    tuning,
                                )}
                                scale={tuning.placement.bulb.scale}
                                powered={powered}
                                showPorts
                            />
                        )}

                    </CircuitBoard>

                    <AutoCableLayer active={powered} />
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

            <group
                position={[0, -0.235, 0.08]}
                rotation={POWER_ISLAND_CONFIG.rotation}
                scale={[4.35, 0.72, 4.35]}
            >
                <IslandLabFloorPattern theme="power" />
            </group>

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

export default function CircuitLabExperience({
                                                     tuning = DEFAULT_CIRCUIT_TUNING,
                                                     showDevPanel = true,
                                                 }: CircuitLabExperienceProps) {
    const [selectedTool, setSelectedTool] = useState<CircuitPartTool | null>(
        null,
    )

    const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null)
    const [pendingPortId, setPendingPortId] = useState<string | null>(null)
    const [resetKey, setResetKey] = useState(0)
    const [cableModeToken, setCableModeToken] = useState(0)
    const [cameraView, setCameraView] = useState<CircuitCameraView>("front")
    const [switchMode, setSwitchMode] = useState<CircuitSwitchMode>("off")
    const [wires, setWires] = useState<CableWireConnection[]>([])

    const [placedParts, setPlacedParts] = useState<CircuitPlacedParts>(
        INITIAL_CIRCUIT_PLACED_PARTS,
    )

    const selectedPlaceablePart = isCircuitPlaceableTool(selectedTool)
        ? selectedTool
        : null

    const cableModeEnabled = selectedTool === "cable"

    const selectedLabel = selectedTool
        ? toolLabels[selectedTool]
        : "Parça seçilmedi"

    const circuitPowerState = useMemo(() => {
        return checkCircuitPower({
            wires,
            switchMode,
        })
    }, [switchMode, wires])

    const powered = circuitPowerState.powered

    const sparkyMessage = getSparkyLabMessage({
        selectedTool,
        placedParts,
        pendingPortId,
        powered,
    })

    const handleWiresChange = useCallback((wires: CableWireConnection[]) => {
        setWires(wires)

        setPlacedParts((current) => {
            if (current.cableCount === wires.length) return current

            return {
                ...current,
                cableCount: wires.length,
            }
        })
    }, [])

    const handleSelectTool = (tool: CircuitPartTool) => {
        setPendingPortId(null)

        if (tool === "hint") {
            setSelectedTool(tool)
            return
        }

        if (tool === "cable") {
            setCableModeToken((current) => current + 1)
            setSelectedTool(tool)
            return
        }

        setSelectedTool(tool)
    }

    const handleCellSelect = (cell: GridCell) => {
        if (!selectedPlaceablePart) return

        if (
            isCellOccupiedByOtherPart(cell, placedParts, selectedPlaceablePart)
        ) {
            return
        }

        setPlacedParts((current) => ({
            ...current,
            [selectedPlaceablePart]: cell,
        }))

        setSelectedTool(null)
        setPendingPortId(null)
    }

    const reset = () => {
        setSelectedTool(null)
        setHoveredCell(null)
        setPendingPortId(null)
        setPlacedParts(INITIAL_CIRCUIT_PLACED_PARTS)
        setSwitchMode("off")
        setWires([])
        setCableModeToken((current) => current + 1)
        setResetKey((current) => current + 1)
    }

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#05070b] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[34vh] bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-bottom opacity-70 [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_78%,transparent_100%)]"
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
                    <CircuitLabScene
                        selectedPart={selectedPlaceablePart}
                        cableModeEnabled={cableModeEnabled}
                        resetKey={resetKey}
                        placedParts={placedParts}
                        hoveredCell={hoveredCell}
                        onCellHover={setHoveredCell}
                        onCellSelect={handleCellSelect}
                        onWiresChange={handleWiresChange}
                        onPendingPortChange={setPendingPortId}
                        powered={powered}
                        switchMode={switchMode}
                        onSwitchModeChange={setSwitchMode}
                        tuning={tuning}
                        cableModeToken={cableModeToken}
                        cameraView={cameraView}
                    />
                </Suspense>
            </Canvas>

            <CircuitViewControls
                activeView={cameraView}
                onViewChange={setCameraView}
            />

            {showDevPanel && (
                <div className="pointer-events-auto absolute left-4 top-4 z-40 w-[360px]">
                    <section className="rounded-3xl border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-xl">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200">
                            Circuit Board Test
                        </p>

                        <h1 className="mt-2 text-xl font-black tracking-tight text-white">
                            Devre Kutusu → Grid Yerleşimi
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-white/65">
                            Seçili araç:{" "}
                            <span className="font-black text-yellow-200">
                                {selectedLabel}
                            </span>
                        </p>

                        {selectedTool === "cable" && (
                            <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/60">
                                Önce bir port seç, sonra bağlamak istediğin
                                ikinci porta tıkla. Kablo otomatik çizilecek.
                            </p>
                        )}

                        {selectedTool === "hint" && (
                            <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/60">
                                İpucu paneli Sparky mesajlarıyla birlikte
                                çalışır.
                            </p>
                        )}
                    </section>
                </div>
            )}

            {showDevPanel && (
                <div className="pointer-events-auto absolute left-4 top-[150px] z-40 w-[184px]">
                    <CircuitPartsTray
                        selectedTool={selectedTool}
                        placedParts={placedParts}
                        onSelectTool={handleSelectTool}
                        onReset={reset}
                    />
                </div>
            )}

            {showDevPanel && (
                <div className="pointer-events-auto absolute bottom-4 right-4 z-40 w-[460px] max-w-[calc(100vw-14rem)]">
                    <AiTutorPanel sparkyMessage={sparkyMessage} />
                </div>
            )}
        </main>
    )
}
