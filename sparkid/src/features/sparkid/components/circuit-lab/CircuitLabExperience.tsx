"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { ContactShadows, Html } from "@react-three/drei"

import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import { IslandEnvironment } from "@/features/sparkid/components/assets/island/IslandEnvironment"
import { IslandLabFloorPattern } from "@/features/sparkid/components/assets/island/IslandLabFloorPattern"
import { POWER_ISLAND_CONFIG } from "@/features/sparkid/components/assets/island/islandConfigs"
import { useIslandProgress } from "@/features/sparkid/components/levels/islandProgress"
import type { SparkyMood } from "@/features/sparkid/components/sparky/RobotMascot"

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
import CircuitSparkyHudGuide from "./CircuitSparkyHudGuide"
import LessonProgressPanel from "./LessonProgressPanel"
import {
    DEFAULT_CIRCUIT_AVAILABLE_TOOLS,
    DEFAULT_CIRCUIT_LEVEL_CONFIG,
    DEFAULT_CIRCUIT_TOOL_LIMITS,
    createCircuitPlacedParts,
    isCircuitPlaceableTool,
    type CircuitLevelConfig,
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
import {
    hasAllPortPairWires,
    hasWireForPortPair,
} from "./utils/circuitWireUtils"
import { detectFreeLabCircuit } from "./utils/detectFreeLabCircuit"
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
    levelConfig?: CircuitLevelConfig
    showDevPanel?: boolean
}

const CABLE_LIMIT = 3
const SHOW_CIRCUIT_PORTS = false

const toolLabels: Record<CircuitPartTool, string> = {
    battery: "Pil",
    switch: "Anahtar",
    bulb: "Ampul",
    bulb2: "Ampul 2",
    cable: "Kablo",
    cableCutter: "Kablo Kesici",
    hint: "İpucu",
}

const sparkyMoodByTone: Record<
    NonNullable<ReturnType<typeof getSparkyLabMessage>["tone"]>,
    SparkyMood
> = {
    idle: "idle",
    hint: "thinking",
    success: "success",
    warning: "warning",
    error: "warning",
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
        ignorePart === "bulb2" ? null : placedParts.bulb2,
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

function isCellAllowed(cell: GridCell, allowedCells?: GridCell[]) {
    if (!allowedCells) return true

    return allowedCells.some((allowedCell) => isSameCell(cell, allowedCell))
}

function getOccupiedCells(
    placedParts: CircuitPlacedParts,
    selectedPart: CircuitPlaceablePart | null,
) {
    return [
        selectedPart === "battery" ? null : placedParts.battery,
        selectedPart === "switch" ? null : placedParts.switch,
        selectedPart === "bulb" ? null : placedParts.bulb,
        selectedPart === "bulb2" ? null : placedParts.bulb2,
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
    const placement =
        part === "bulb2" ? tuning.placement.bulb : tuning.placement[part]

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

function createInitialWires(
    portPairs: CircuitLevelConfig["initialWirePortPairs"],
): CableWireConnection[] {
    return (portPairs ?? []).map((pair, index) => ({
        id: `initial-wire-${index}-${pair.fromPortId}-${pair.toPortId}`,
        fromPortId: pair.fromPortId,
        toPortId: pair.toPortId,
    }))
}

function getGuidedCablePortIds({
                                   guidedPairs,
                                   wires,
                                   pendingPortId,
                                   fallbackPortIds,
                               }: {
    guidedPairs?: CircuitLevelConfig["guidedCablePortPairs"]
    wires: CableWireConnection[]
    pendingPortId: string | null
    fallbackPortIds?: string[]
}) {
    if (!guidedPairs?.length) return fallbackPortIds

    const activePair = guidedPairs.find((pair) => {
        return !hasWireForPortPair(wires, pair)
    })

    if (!activePair) return []

    if (!pendingPortId) {
        return [activePair.fromPortId, activePair.toPortId]
    }

    if (pendingPortId === activePair.fromPortId) {
        return [activePair.toPortId]
    }

    if (pendingPortId === activePair.toPortId) {
        return [activePair.fromPortId]
    }

    return [activePair.fromPortId, activePair.toPortId]
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
                             onWireRemove,
                             onPendingPortChange,
                             cutterModeEnabled,
                             powered,
                             switchMode,
                             onSwitchModeChange,
                             tuning,
                             cableModeToken,
                             cameraView,
                             levelConfig,
                             cableLimit,
                             allowedCablePortIds,
                             sharedCablePortIds,
                             initialWires,
                             allowedPlacementCells,
                             previewActiveWirePortPairs,
                             removableWirePortPairs,
                             warningWirePortPairs,
                             poweredBulbIds,
                         }: {
    selectedPart: CircuitPlaceablePart | null
    cableModeEnabled: boolean
    resetKey: number
    placedParts: CircuitPlacedParts
    hoveredCell: GridCell | null
    onCellHover: (cell: GridCell | null) => void
    onCellSelect: (cell: GridCell) => void
    onWiresChange: (wires: CableWireConnection[]) => void
    onWireRemove: (wire: CableWireConnection) => void
    onPendingPortChange: (portId: string | null) => void
    cutterModeEnabled: boolean
    powered: boolean
    switchMode: CircuitSwitchMode
    onSwitchModeChange: (nextMode: CircuitSwitchMode) => void
    tuning: CircuitRuntimeTuning
    cableModeToken: number
    cameraView: CircuitCameraView
    levelConfig: CircuitLevelConfig
    cableLimit: number
    allowedCablePortIds?: string[]
    sharedCablePortIds?: string[]
    initialWires?: CableWireConnection[]
    allowedPlacementCells?: GridCell[]
    previewActiveWirePortPairs?: CircuitLevelConfig["previewActiveWirePortPairs"]
    removableWirePortPairs?: CircuitLevelConfig["removableWirePortPairs"]
    warningWirePortPairs?: CircuitLevelConfig["warningWirePortPairs"]
    poweredBulbIds?: string[]
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
                effects={false}
            />

            <CircuitCameraRig view={cameraView} />

            <CircuitConnectionProvider key={resetKey}>
                <CableConnectionModeProvider
                    enabled={cableModeEnabled}
                    maxWires={cableLimit}
                    allowedPortIds={allowedCablePortIds}
                    sharedPortIds={sharedCablePortIds}
                    initialWires={initialWires}
                    modeToken={cableModeToken}
                    onWiresChange={onWiresChange}
                    onWireRemove={onWireRemove}
                    onPendingPortChange={onPendingPortChange}
                >
                    <CircuitBoard
                        tableConfig={tuning.table}
                        gridConfig={tuning.grid}
                        selectedPart={selectedPart}
                        hoveredCell={hoveredCell}
                        occupiedCells={occupiedCells}
                        allowedCells={allowedPlacementCells}
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
                                || !isCellAllowed(cell, allowedPlacementCells)
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
                                showPorts={SHOW_CIRCUIT_PORTS}
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
                                showPorts={SHOW_CIRCUIT_PORTS}
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
                                powered={poweredBulbIds?.includes("bulb") ?? powered}
                                showPorts={SHOW_CIRCUIT_PORTS}
                            />
                        )}

                        {placedParts.bulb2 && (
                            <ConnectableLightBulb
                                id="bulb-2"
                                position={getTunedPartPosition(
                                    "bulb2",
                                    placedParts.bulb2,
                                    tuning,
                                )}
                                scale={tuning.placement.bulb.scale}
                                powered={poweredBulbIds?.includes("bulb-2") ?? powered}
                                showPorts={SHOW_CIRCUIT_PORTS}
                            />
                        )}

                        {levelConfig.extraBulbs?.map((extraBulb) => (
                            <ConnectableLightBulb
                                key={extraBulb.id}
                                id={extraBulb.id}
                                position={getTunedPartPosition(
                                    "bulb",
                                    extraBulb.cell,
                                    tuning,
                                )}
                                scale={tuning.placement.bulb.scale}
                                powered={poweredBulbIds?.includes(extraBulb.id) ?? powered}
                                showPorts={SHOW_CIRCUIT_PORTS}
                            />
                        ))}

                    </CircuitBoard>

                    <AutoCableLayer
                        active={powered}
                        cutterActive={cutterModeEnabled}
                        tableConfig={tuning.table}
                        gridConfig={tuning.grid}
                        previewActiveWirePortPairs={previewActiveWirePortPairs}
                        removableWirePortPairs={removableWirePortPairs}
                        warningWirePortPairs={warningWirePortPairs}
                    />
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
                                                     levelConfig = DEFAULT_CIRCUIT_LEVEL_CONFIG,
                                                     showDevPanel = true,
                                                 }: CircuitLabExperienceProps) {
    const islandProgress = useIslandProgress(levelConfig.islandSlug ?? "free")
    const initialPlacedParts = useMemo(
        () => createCircuitPlacedParts(levelConfig.initialPlacedParts),
        [levelConfig.initialPlacedParts],
    )
    const initialWires = useMemo(
        () => createInitialWires(levelConfig.initialWirePortPairs),
        [levelConfig.initialWirePortPairs],
    )
    const configuredAvailableTools: CircuitPartTool[] = levelConfig.availableTools
        ?? DEFAULT_CIRCUIT_AVAILABLE_TOOLS
    const availableTools = useMemo<CircuitPartTool[]>(() => {
        if (!configuredAvailableTools.includes("cable")) {
            return configuredAvailableTools
        }

        return Array.from(
            new Set<CircuitPartTool>([
                ...configuredAvailableTools,
                "cableCutter",
            ]),
        )
    }, [configuredAvailableTools])
    const toolLimits = useMemo(
        () => ({
            ...DEFAULT_CIRCUIT_TOOL_LIMITS,
            ...levelConfig.toolLimits,
        }),
        [levelConfig.toolLimits],
    )
    const cableLimit = levelConfig.cableLimit
        ?? toolLimits.cable
        ?? CABLE_LIMIT
    const initialSwitchMode = levelConfig.initialSwitchMode ?? "off"
    const levelIsLocked = Boolean(
        levelConfig.islandSlug &&
        levelConfig.lessonNumber &&
        !islandProgress.isLessonUnlocked(levelConfig.lessonNumber),
    )

    const [selectedTool, setSelectedTool] = useState<CircuitPartTool | null>(
        null,
    )

    const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null)
    const [pendingPortId, setPendingPortId] = useState<string | null>(null)
    const [resetKey, setResetKey] = useState(0)
    const [cableModeToken, setCableModeToken] = useState(0)
    const [cameraView, setCameraView] = useState<CircuitCameraView>("front")
    const [switchMode, setSwitchMode] = useState<CircuitSwitchMode>(
        initialSwitchMode,
    )
    const [wires, setWires] = useState<CableWireConnection[]>(initialWires)
    const [wireRemovalCount, setWireRemovalCount] = useState(0)
    const [hasTurnedSwitchOn, setHasTurnedSwitchOn] = useState(false)
    const [hasTurnedSwitchOff, setHasTurnedSwitchOff] = useState(false)

    const [placedParts, setPlacedParts] = useState<CircuitPlacedParts>(
        initialPlacedParts,
    )

    const selectedPlaceablePart = isCircuitPlaceableTool(selectedTool)
        ? selectedTool
        : null

    const cableModeEnabled = selectedTool === "cable"
    const cutterModeEnabled = selectedTool === "cableCutter"
    const allowedPlacementCells = selectedPlaceablePart
        ? levelConfig.allowedPlacementCells?.[selectedPlaceablePart]
        : undefined
    const guidedCablePortIds = useMemo(
        () => getGuidedCablePortIds({
            guidedPairs: levelConfig.guidedCablePortPairs,
            wires,
            pendingPortId,
            fallbackPortIds: levelConfig.allowedCablePortIds,
        }),
        [
            levelConfig.allowedCablePortIds,
            levelConfig.guidedCablePortPairs,
            pendingPortId,
            wires,
        ],
    )

    const selectedLabel = selectedTool
        ? toolLabels[selectedTool]
        : "Parça seçilmedi"

    const circuitPowerState = useMemo(() => {
        return checkCircuitPower({
            wires,
            switchMode,
        })
    }, [switchMode, wires])
    const freeLabCircuitState = useMemo(() => {
        return detectFreeLabCircuit({
            wires,
            switchMode,
        })
    }, [switchMode, wires])

    const wirePairsComplete = levelConfig.completionWirePortPairs
        ? hasAllPortPairWires(wires, levelConfig.completionWirePortPairs)
        : false
    const levelCircuitWired =
        levelConfig.completionMode === "powered"
            && levelConfig.completionWirePortPairs
            ? wirePairsComplete
            : circuitPowerState.isCircuitComplete
    const powered =
        levelConfig.completionMode === "free-build"
            ? freeLabCircuitState.powered
            : levelConfig.completionMode === "powered"
            && levelConfig.completionWirePortPairs
                ? switchMode === "on" && wirePairsComplete
                : circuitPowerState.powered
    const switchToggleCycleComplete = hasTurnedSwitchOn && hasTurnedSwitchOff
    const lessonComplete =
        levelConfig.completionMode === "switch-toggle-cycle"
            ? switchToggleCycleComplete
            : levelConfig.completionMode === "free-build"
                ? freeLabCircuitState.powered
            : levelConfig.completionMode === "powered"
                ? powered
                    && (!levelConfig.completionWirePortPairs || wirePairsComplete)
                    && (!levelConfig.requiresWireRemoval || wireRemovalCount > 0)
                : levelConfig.completionWirePortPairs
                    ? wirePairsComplete
                        && (!levelConfig.requiresWireRemoval || wireRemovalCount > 0)
                        && (levelConfig.id !== "power-island-lesson-3" || wireRemovalCount > 0)
                    : powered

    const sparkyMessage = getSparkyLabMessage({
        selectedTool,
        placedParts,
        pendingPortId,
        powered,
        wires,
        levelConfig,
        lessonComplete,
        wireRemovalCount,
        switchMode,
        switchToggleCycleComplete,
        isCircuitWired: levelCircuitWired,
        freeLabCircuitType: freeLabCircuitState.circuitType,
    })
    const sparkyMood = sparkyMoodByTone[sparkyMessage.tone ?? "idle"]

    useEffect(() => {
        if (selectedTool === "cableCutter") return

        document.body.style.cursor = "auto"

        return () => {
            document.body.style.cursor = "auto"
        }
    }, [selectedTool])

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

    const handleWireRemove = useCallback(() => {
        setWireRemovalCount((current) => current + 1)
    }, [])

    const handleSwitchModeChange = useCallback((nextMode: CircuitSwitchMode) => {
        setSwitchMode(nextMode)

        if (nextMode === "on") {
            setHasTurnedSwitchOn(true)
        } else {
            setHasTurnedSwitchOff(true)
        }
    }, [])

    const handleSelectTool = (tool: CircuitPartTool) => {
        if (!availableTools.includes(tool)) return

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

        if (tool === "cableCutter") {
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
            || !isCellAllowed(cell, allowedPlacementCells)
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
        setPlacedParts(createCircuitPlacedParts(levelConfig.initialPlacedParts))
        setSwitchMode(levelConfig.initialSwitchMode ?? "off")
        setWires(createInitialWires(levelConfig.initialWirePortPairs))
        setWireRemovalCount(0)
        setHasTurnedSwitchOn(false)
        setHasTurnedSwitchOff(false)
        setCableModeToken((current) => current + 1)
        setResetKey((current) => current + 1)
    }

    const markCurrentLessonComplete = () => {
        if (!levelConfig.islandSlug || !levelConfig.lessonNumber) return

        islandProgress.markLessonComplete(levelConfig.lessonNumber)
    }

    useEffect(() => {
        if (!lessonComplete || !levelConfig.islandSlug || !levelConfig.lessonNumber) {
            return
        }

        islandProgress.markLessonComplete(levelConfig.lessonNumber)
    }, [
        islandProgress,
        lessonComplete,
        levelConfig.islandSlug,
        levelConfig.lessonNumber,
    ])

    if (levelIsLocked) {
        return (
            <main className="grid h-screen w-screen place-items-center overflow-hidden bg-[#05070b] p-6 text-white">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-75"
                />

                <section className="relative z-10 w-[min(460px,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-[var(--sparkid-card)]/90 p-6 text-center shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--sparkid-yellow)]">
                        Bölüm kilitli
                    </p>

                    <h1 className="mt-3 text-2xl font-black text-[var(--sparkid-white)]">
                        Önce önceki bölümü tamamla
                    </h1>

                    <p className="mt-3 text-sm font-semibold leading-6 text-[var(--sparkid-muted)]">
                        Bu bölüme geçmek için sıradaki görevi adım adım
                        bitirmelisin. Ada ekranına dönüp açık node’dan devam et.
                    </p>

                    <Link
                        href={`/levels/${levelConfig.islandSlug}`}
                        className="mt-5 inline-flex rounded-2xl border border-[var(--sparkid-cyan)]/40 bg-[var(--sparkid-cyan)] px-5 py-3 text-sm font-black text-[var(--sparkid-navy-dark)] shadow-[0_14px_34px_rgba(53,229,242,0.22)] transition hover:scale-[1.02]"
                    >
                        Ada Detayına Dön
                    </Link>
                </section>
            </main>
        )
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
                        onWireRemove={handleWireRemove}
                        onPendingPortChange={setPendingPortId}
                        cutterModeEnabled={cutterModeEnabled}
                        powered={powered}
                        switchMode={switchMode}
                        onSwitchModeChange={handleSwitchModeChange}
                        tuning={tuning}
                        cableModeToken={cableModeToken}
                        cameraView={cameraView}
                        levelConfig={levelConfig}
                        cableLimit={cableLimit}
                        allowedCablePortIds={guidedCablePortIds}
                        sharedCablePortIds={levelConfig.sharedCablePortIds}
                        initialWires={initialWires}
                        allowedPlacementCells={allowedPlacementCells}
                        previewActiveWirePortPairs={levelConfig.previewActiveWirePortPairs}
                        removableWirePortPairs={levelConfig.removableWirePortPairs}
                        warningWirePortPairs={levelConfig.warningWirePortPairs}
                        poweredBulbIds={
                            levelConfig.completionMode === "free-build"
                                ? freeLabCircuitState.poweredBulbIds
                                : undefined
                        }
                    />

                    <CircuitSparkyHudGuide
                        mood={sparkyMood}
                        animation={sparkyMessage.tone === "success" ? "excited" : "talk"}
                    />
                </Suspense>
            </Canvas>

            {showDevPanel && (
                <div className="pointer-events-none absolute bottom-4 right-[500px] z-30 h-44 w-44 rounded-[1.75rem] border border-[var(--sparkid-cyan)]/45 shadow-[0_0_32px_rgba(53,229,242,0.18)] ring-1 ring-white/10 max-xl:right-[480px] max-lg:hidden" />
            )}

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
                            {levelConfig.title}
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

                        {selectedTool === "cableCutter" && (
                            <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/60">
                                Kesmek istediğin kablonun üstüne gel ve tıkla.
                                Bu araç yeni bağlantı kurmaz.
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
                <div className="pointer-events-auto absolute left-4 top-[150px] z-40 w-[360px] max-w-[calc(100vw-2rem)]">
                    <CircuitPartsTray
                        selectedTool={selectedTool}
                        placedParts={placedParts}
                        availableTools={availableTools}
                        toolLimits={toolLimits}
                        onSelectTool={handleSelectTool}
                        onReset={reset}
                    />
                </div>
            )}

            {showDevPanel && (
                <div className="pointer-events-auto absolute bottom-4 right-4 z-40 w-[460px] max-w-[calc(100vw-14rem)]">
                    <LessonProgressPanel
                        title={levelConfig.title}
                        learningGoal={levelConfig.learningGoal}
                        missionSteps={levelConfig.missionSteps}
                        lessonComplete={lessonComplete}
                    />

                    <AiTutorPanel sparkyMessage={sparkyMessage} />

                    {lessonComplete
                        && levelConfig.islandSlug && (
                            <div className="mt-3 rounded-[1.5rem] border border-emerald-300/25 bg-emerald-300/12 p-4 shadow-[0_18px_42px_rgba(69,227,154,0.12)]">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">
                                    Bölüm tamamlandı
                                </p>

                                {levelConfig.successSummary && (
                                    <p className="mt-2 text-sm font-bold leading-6 text-emerald-50/88">
                                        {levelConfig.successSummary}
                                    </p>
                                )}

                                <Link
                                    href={`/levels/${levelConfig.islandSlug}`}
                                    onClick={markCurrentLessonComplete}
                                    className="mt-3 block rounded-2xl border border-[var(--sparkid-cyan)]/40 bg-[var(--sparkid-cyan)] px-4 py-3 text-center text-sm font-black text-[var(--sparkid-navy-dark)] shadow-[0_14px_34px_rgba(53,229,242,0.22)] transition hover:scale-[1.01]"
                                >
                                    Adaya Dön
                                </Link>
                            </div>
                        )}
                </div>
            )}
        </main>
    )
}
