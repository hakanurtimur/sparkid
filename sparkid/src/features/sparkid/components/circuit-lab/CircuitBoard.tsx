"use client";

import type { ReactNode } from "react";

import { CircuitGridOverlay } from "./CircuitGridOverlay";

import {
    CIRCUIT_BOARD_CONFIG,
    type CircuitPlaceablePart,
    type GridCell,
} from "./data/circuitBoardConfig";
import LabTableModel from "@/features/sparkid/components/assets/table/LabTableModel";

type CircuitBoardProps = {
    children?: ReactNode;
    selectedPart?: CircuitPlaceablePart | null;
    selectedCell?: GridCell | null;
    hoveredCell?: GridCell | null;
    occupiedCells?: GridCell[];
    allowedCells?: GridCell[];
    showGrid?: boolean;
    showDebugCells?: boolean;
    onCellHover?: (cell: GridCell | null) => void;
    onCellSelect?: (cell: GridCell) => void;
    tableConfig?: typeof CIRCUIT_BOARD_CONFIG.table;
    gridConfig?: typeof CIRCUIT_BOARD_CONFIG.grid;
};

export function CircuitBoard({
                                 children,
                                 selectedPart = null,
                                 selectedCell = null,
                                 hoveredCell = null,
                                 occupiedCells = [],
                                 allowedCells,
                                 showGrid = true,
                                 showDebugCells = false,
                                 onCellHover,
                                 onCellSelect,
    tableConfig,
    gridConfig
                             }: CircuitBoardProps) {
    const table = tableConfig ?? CIRCUIT_BOARD_CONFIG.table;

    return (
        <group
            name="SparkidCircuitBoard"
            position={table.position}
            rotation={table.rotation}
            scale={table.scale}
        >
            <LabTableModel position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1} />

            {showGrid && (
                <CircuitGridOverlay
                    selectedPart={selectedPart}
                    selectedCell={selectedCell}
                    hoveredCell={hoveredCell}
                    occupiedCells={occupiedCells}
                    allowedCells={allowedCells}
                    showDebugCells={showDebugCells}
                    onCellHover={onCellHover}
                    onCellSelect={onCellSelect}
                    gridConfig={gridConfig}
                />
            )}

            {children}
        </group>
    );
}
