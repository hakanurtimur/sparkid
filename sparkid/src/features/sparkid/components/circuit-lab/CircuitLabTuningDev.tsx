"use client"

import { useMemo } from "react"
import { Leva, useControls } from "leva"

import CircuitLabExperience, {
    DEFAULT_CIRCUIT_TUNING,
    type CircuitRuntimeTuning,
} from "./CircuitLabExperience"

export default function CircuitLabTuningDev() {
    const controls = useControls("Circuit Board", {
        tableX: {
            value: DEFAULT_CIRCUIT_TUNING.table.position[0],
            min: -2,
            max: 2,
            step: 0.01,
        },
        tableY: {
            value: DEFAULT_CIRCUIT_TUNING.table.position[1],
            min: -1,
            max: 1,
            step: 0.01,
        },
        tableZ: {
            value: DEFAULT_CIRCUIT_TUNING.table.position[2],
            min: -2,
            max: 2,
            step: 0.01,
        },
        tableRotY: {
            value: DEFAULT_CIRCUIT_TUNING.table.rotation[1],
            min: -Math.PI,
            max: Math.PI,
            step: 0.01,
        },
        tableScale: {
            value: DEFAULT_CIRCUIT_TUNING.table.scale,
            min: 0.5,
            max: 2,
            step: 0.01,
        },
        gridY: {
            value: DEFAULT_CIRCUIT_TUNING.grid.position[1],
            min: 0,
            max: 1.4,
            step: 0.001,
        },
        gridWidth: {
            value: DEFAULT_CIRCUIT_TUNING.grid.width,
            min: 0.5,
            max: 4,
            step: 0.01,
        },
        gridDepth: {
            value: DEFAULT_CIRCUIT_TUNING.grid.depth,
            min: 0.5,
            max: 3,
            step: 0.01,
        },
        showDebugCells: DEFAULT_CIRCUIT_TUNING.grid.showDebugCells,
        batteryScale: {
            value: DEFAULT_CIRCUIT_TUNING.placement.battery.scale,
            min: 0.04,
            max: 0.3,
            step: 0.005,
        },
        batteryXOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.battery.xOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
        batteryYOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.battery.yOffset,
            min: -0.1,
            max: 0.5,
            step: 0.005,
        },
        batteryZOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.battery.zOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
        switchScale: {
            value: DEFAULT_CIRCUIT_TUNING.placement.switch.scale,
            min: 0.04,
            max: 0.4,
            step: 0.005,
        },
        switchXOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.switch.xOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
        switchYOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.switch.yOffset,
            min: -0.1,
            max: 0.5,
            step: 0.005,
        },
        switchZOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.switch.zOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
        bulbScale: {
            value: DEFAULT_CIRCUIT_TUNING.placement.bulb.scale,
            min: 0.04,
            max: 0.35,
            step: 0.005,
        },
        bulbXOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.bulb.xOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
        bulbYOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.bulb.yOffset,
            min: -0.1,
            max: 0.5,
            step: 0.005,
        },
        bulbZOffset: {
            value: DEFAULT_CIRCUIT_TUNING.placement.bulb.zOffset,
            min: -0.4,
            max: 0.4,
            step: 0.005,
        },
    })

    const tuning = useMemo<CircuitRuntimeTuning>(
        () => ({
            table: {
                ...DEFAULT_CIRCUIT_TUNING.table,
                position: [controls.tableX, controls.tableY, controls.tableZ],
                rotation: [
                    DEFAULT_CIRCUIT_TUNING.table.rotation[0],
                    controls.tableRotY,
                    DEFAULT_CIRCUIT_TUNING.table.rotation[2],
                ],
                scale: controls.tableScale,
            },
            grid: {
                ...DEFAULT_CIRCUIT_TUNING.grid,
                position: [
                    DEFAULT_CIRCUIT_TUNING.grid.position[0],
                    controls.gridY,
                    DEFAULT_CIRCUIT_TUNING.grid.position[2],
                ],
                width: controls.gridWidth,
                depth: controls.gridDepth,
                showDebugCells: controls.showDebugCells,
            },
            placement: {
                battery: {
                    scale: controls.batteryScale,
                    xOffset: controls.batteryXOffset,
                    yOffset: controls.batteryYOffset,
                    zOffset: controls.batteryZOffset,
                },
                switch: {
                    scale: controls.switchScale,
                    xOffset: controls.switchXOffset,
                    yOffset: controls.switchYOffset,
                    zOffset: controls.switchZOffset,
                },
                bulb: {
                    scale: controls.bulbScale,
                    xOffset: controls.bulbXOffset,
                    yOffset: controls.bulbYOffset,
                    zOffset: controls.bulbZOffset,
                },
            },
        }),
        [controls],
    )

    return (
        <>
            <CircuitLabExperience tuning={tuning} />
            <Leva collapsed />
        </>
    )
}
