"use client"

import * as THREE from "three"
import { Line } from "@react-three/drei"
import { useMemo } from "react"

import { useCableConnectionMode } from "./CableConnectionModeContext"
import { useCircuitConnections } from "./CircuitConnectionContext"
import {
    CIRCUIT_BOARD_CONFIG,
    type CircuitBoardGridConfig,
    type CircuitBoardTableConfig,
} from "./data/circuitBoardConfig"
import type { CircuitPortPair } from "./types"
import { hasWireForPortPair } from "./utils/circuitWireUtils"

type AutoCableLayerProps = {
    active?: boolean
    cutterActive?: boolean
    tableConfig?: CircuitBoardTableConfig
    gridConfig?: CircuitBoardGridConfig
    previewActiveWirePortPairs?: CircuitPortPair[]
    removableWirePortPairs?: CircuitPortPair[]
    warningWirePortPairs?: CircuitPortPair[]
}

type AutoCableWireProps = {
    fromPortId: string
    toPortId: string
    tableConfig: CircuitBoardTableConfig
    gridConfig: CircuitBoardGridConfig
    routeIndex?: number
    active?: boolean
    previewActive?: boolean
    warning?: boolean
    removable?: boolean
    color?: string
    activeColor?: string
    previewActiveColor?: string
    lineWidth?: number
    onRemove?: () => void
}

const SCISSORS_CURSOR =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext x='3' y='24' font-size='22'%3E%E2%9C%82%3C/text%3E%3C/svg%3E\") 8 22, crosshair"

function createBoardMatrix(tableConfig: CircuitBoardTableConfig) {
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3(...tableConfig.position)
    const rotation = new THREE.Euler(...tableConfig.rotation)
    const scale = new THREE.Vector3(
        tableConfig.scale,
        tableConfig.scale,
        tableConfig.scale,
    )

    matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale)

    return matrix
}

function getGridLineCoordinates(size: number, divisions: number) {
    return Array.from({ length: divisions + 1 }, (_, index) => {
        return -size / 2 + (size / divisions) * index
    })
}

function getNearestGridLine(value: number, lines: number[]) {
    return lines.reduce((nearest, line) => {
        return Math.abs(line - value) < Math.abs(nearest - value)
            ? line
            : nearest
    }, lines[0])
}

function getCableRouteSpace(
    tableConfig: CircuitBoardTableConfig,
    gridConfig: CircuitBoardGridConfig,
) {
    const boardMatrix = createBoardMatrix(tableConfig)
    const inverseBoardMatrix = boardMatrix.clone().invert()

    return {
        boardMatrix,
        inverseBoardMatrix,
        gridConfig,
        xLines: getGridLineCoordinates(gridConfig.width, gridConfig.columns),
        zLines: getGridLineCoordinates(gridConfig.depth, gridConfig.rows),
    }
}

function getCableExitPoint(
    position: THREE.Vector3,
    normal: THREE.Vector3,
    y: number,
    exitDistance: number,
) {
    const exit = position.clone().add(normal.clone().normalize().multiplyScalar(exitDistance))
    exit.y = y

    return exit
}

function getCablePoints({
                            from,
                            to,
                            fromNormal,
                            toNormal,
                            routeSpace,
                            routeIndex = 0,
                        }: {
    from: THREE.Vector3
    to: THREE.Vector3
    fromNormal: THREE.Vector3
    toNormal: THREE.Vector3
    routeSpace: ReturnType<typeof getCableRouteSpace>
    routeIndex?: number
}) {
    const fromLocal = from.clone().applyMatrix4(routeSpace.inverseBoardMatrix)
    const toLocal = to.clone().applyMatrix4(routeSpace.inverseBoardMatrix)
    const distance = fromLocal.distanceTo(toLocal)
    const tableCableY = routeSpace.gridConfig.position[1] + 0.035
    const portExitLift = 0.018
    const exitDistance = Math.min(0.2, 0.11 + distance * 0.035)
    const routeSpread = (routeIndex % 3) * 0.08
    const routeSign = routeIndex % 2 === 0 ? 1 : -1

    const fromLocalNormal = fromNormal
        .clone()
        .transformDirection(routeSpace.inverseBoardMatrix)
    const toLocalNormal = toNormal
        .clone()
        .transformDirection(routeSpace.inverseBoardMatrix)

    const start = fromLocal.clone()
    const end = toLocal.clone()
    const startExit = getCableExitPoint(
        fromLocal,
        fromLocalNormal,
        fromLocal.y + portExitLift,
        exitDistance,
    )
    const endExit = getCableExitPoint(
        toLocal,
        toLocalNormal,
        toLocal.y + portExitLift,
        exitDistance,
    )
    const startDrop = startExit.clone()
    startDrop.y = tableCableY

    const endDrop = endExit.clone()
    endDrop.y = tableCableY

    const xDelta = Math.abs(endDrop.x - startDrop.x)
    const zDelta = Math.abs(endDrop.z - startDrop.z)
    const midpoint = startDrop.clone().lerp(endDrop, 0.5)
    const laneOffset = Math.max(0.018, routeSpread)

    const lanePoints: THREE.Vector3[] =
        xDelta >= zDelta
            ? [
                new THREE.Vector3(
                    startDrop.x,
                    tableCableY,
                    getNearestGridLine(midpoint.z, routeSpace.zLines)
                    + routeSign * laneOffset,
                ),
                new THREE.Vector3(
                    endDrop.x,
                    tableCableY,
                    getNearestGridLine(midpoint.z, routeSpace.zLines)
                    + routeSign * laneOffset,
                ),
            ]
            : [
                new THREE.Vector3(
                    getNearestGridLine(midpoint.x, routeSpace.xLines)
                    + routeSign * laneOffset,
                    tableCableY,
                    startDrop.z,
                ),
                new THREE.Vector3(
                    getNearestGridLine(midpoint.x, routeSpace.xLines)
                    + routeSign * laneOffset,
                    tableCableY,
                    endDrop.z,
                ),
            ]

    const curve = new THREE.CatmullRomCurve3(
        [start, startExit, startDrop, ...lanePoints, endDrop, endExit, end],
        false,
        "centripetal",
        0.25,
    )

    return curve.getPoints(36).map((point) => point.applyMatrix4(routeSpace.boardMatrix))
}

function AutoCableWire({
                           fromPortId,
                           toPortId,
                           tableConfig,
                           gridConfig,
                           routeIndex = 0,
                           active = false,
                           previewActive = false,
                           warning = false,
                           removable = false,
                           color = "#2563EB",
                           activeColor = "#FFD84D",
                           previewActiveColor = "#35E5F2",
                           lineWidth = 5,
                           onRemove,
                       }: AutoCableWireProps) {
    const { version, getPort } = useCircuitConnections()

    const routeSpace = useMemo(() => {
        return getCableRouteSpace(tableConfig, gridConfig)
    }, [gridConfig, tableConfig])

    const points = useMemo(() => {
        void version

        const fromPort = getPort(fromPortId)
        const toPort = getPort(toPortId)

        if (!fromPort || !toPort) return null

        const from = fromPort.worldPosition.clone()
        const to = toPort.worldPosition.clone()

        return getCablePoints({
            from,
            to,
            fromNormal: fromPort.worldNormal,
            toNormal: toPort.worldNormal,
            routeSpace,
            routeIndex,
        })
    }, [fromPortId, getPort, routeIndex, routeSpace, toPortId, version])

    if (!points) return null

    const energized = active || previewActive || warning
    const cableColor = warning
        ? "#FF6B35"
        : active
            ? activeColor
            : previewActive
                ? previewActiveColor
                : color

    return (
        <group
            onPointerOver={(event) => {
                if (!removable) return
                event.stopPropagation()
                document.body.style.cursor = SCISSORS_CURSOR
            }}
            onPointerOut={(event) => {
                if (!removable) return
                event.stopPropagation()
                document.body.style.cursor = "default"
            }}
            onPointerDown={(event) => {
                if (!removable) return
                event.stopPropagation()
                onRemove?.()
            }}
        >
            <Line
                points={points}
                color={cableColor}
                lineWidth={lineWidth}
                transparent
                opacity={warning ? 0.96 : energized ? 1 : 0.92}
                depthWrite={false}
                toneMapped={false}
            />

            {removable && (
                <Line
                    points={points}
                    color="#ffffff"
                    lineWidth={18}
                    transparent
                    opacity={0}
                    depthWrite={false}
                    toneMapped={false}
                />
            )}
        </group>
    )
}

export default function AutoCableLayer({
                                           active = false,
                                           cutterActive = false,
                                           tableConfig = CIRCUIT_BOARD_CONFIG.table,
                                           gridConfig = CIRCUIT_BOARD_CONFIG.grid,
                                           previewActiveWirePortPairs = [],
                                           removableWirePortPairs = [],
                                           warningWirePortPairs = [],
                                       }: AutoCableLayerProps) {
    const { removeWire, wires } = useCableConnectionMode()

    return (
        <group name="SparkidAutoCableLayer" renderOrder={20}>
            {wires.map((wire, index) => {
                const previewActive = previewActiveWirePortPairs.some((pair) => {
                    return hasWireForPortPair([wire], pair)
                })
                const removable = cutterActive
                const removableWarning = removableWirePortPairs.some((pair) => {
                    return hasWireForPortPair([wire], pair)
                })
                const warning = warningWirePortPairs.some((pair) => {
                    return hasWireForPortPair([wire], pair)
                })

                return (
                    <AutoCableWire
                        key={wire.id}
                        fromPortId={wire.fromPortId}
                        toPortId={wire.toPortId}
                        tableConfig={tableConfig}
                        gridConfig={gridConfig}
                        routeIndex={index}
                        active={active}
                        previewActive={previewActive}
                        warning={warning || removableWarning}
                        removable={removable}
                        color={
                            index === 0
                                ? "#2563EB"
                                : index === 1
                                    ? "#0ea5e9"
                                    : "#38bdf8"
                        }
                        activeColor="#FFD84D"
                        lineWidth={warning ? 6.5 : active ? 6 : previewActive ? 5.5 : 5}
                        onRemove={() => removeWire(wire.id)}
                    />
                )
            })}
        </group>
    )
}
