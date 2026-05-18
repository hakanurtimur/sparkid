"use client";

import { useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";

import {
    CIRCUIT_BOARD_CONFIG,
    type CircuitPlaceablePart,
    type GridCell,
    type Vec3,
} from "./data/circuitBoardConfig";

type CircuitGridOverlayProps = {
    selectedPart?: CircuitPlaceablePart | null;
    selectedCell?: GridCell | null;
    hoveredCell?: GridCell | null;
    occupiedCells?: GridCell[];
    showVisualGrid?: boolean;
    showDebugCells?: boolean;
    onCellHover?: (cell: GridCell | null) => void;
    onCellSelect?: (cell: GridCell) => void;
    gridConfig?: typeof CIRCUIT_BOARD_CONFIG.grid;
};

function isSameCell(a?: GridCell | null, b?: GridCell | null) {
    if (!a || !b) return false;

    return a.row === b.row && a.col === b.col;
}

function isOccupied(cell: GridCell, occupiedCells: GridCell[]) {
    return occupiedCells.some((occupiedCell) => isSameCell(cell, occupiedCell));
}

function GridBar({
                     position,
                     args,
                     color,
                     opacity,
                 }: {
    position: Vec3;
    args: Vec3;
    color: string;
    opacity: number;
}) {
    return (
        <mesh position={position} renderOrder={30}>
            <boxGeometry args={args} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}

export function CircuitGridOverlay({
                                       selectedPart = null,
                                       selectedCell = null,
                                       hoveredCell = null,
                                       occupiedCells = [],
                                       showVisualGrid = CIRCUIT_BOARD_CONFIG.grid.showVisualGrid,
                                       showDebugCells = false,
                                       onCellHover,
                                       onCellSelect,
    gridConfig,
                                   }: CircuitGridOverlayProps) {
    const grid = gridConfig ?? CIRCUIT_BOARD_CONFIG.grid;

    const columns = grid.columns;
    const rows = grid.rows;

    const cellWidth = grid.width / columns;
    const cellDepth = grid.depth / rows;

    const verticalLines = useMemo(() => {
        if (columns <= 1) return [];

        return Array.from({ length: columns - 1 }, (_, index) => {
            return -grid.width / 2 + cellWidth * (index + 1);
        });
    }, [columns, cellWidth, grid.width]);

    const horizontalLines = useMemo(() => {
        if (rows <= 1) return [];

        return Array.from({ length: rows - 1 }, (_, index) => {
            return -grid.depth / 2 + cellDepth * (index + 1);
        });
    }, [rows, cellDepth, grid.depth]);

    const cells = useMemo(() => {
        return Array.from({ length: rows * columns }, (_, index) => {
            const row = Math.floor(index / columns);
            const col = index % columns;

            return {
                row,
                col,
                x: -grid.width / 2 + cellWidth / 2 + col * cellWidth,
                z: -grid.depth / 2 + cellDepth / 2 + row * cellDepth,
            };
        });
    }, [rows, columns, grid.width, grid.depth, cellWidth, cellDepth]);

    const cellsInteractive = Boolean(selectedPart);

    return (
        <>
        {cellsInteractive && (
        <group
            name="SparkidCircuitGridOverlay"
            position={grid.position}
            rotation={grid.rotation}
            renderOrder={30}
        >
            {showVisualGrid && (
                <group name="SparkidCircuitGridLines">
                    {verticalLines.map((x, index) => (
                        <GridBar
                            key={`vertical-${index}`}
                            position={[x, 0.006, 0]}
                            args={[0.006, 0.012, grid.depth]}
                            color={grid.visualLineColor}
                            opacity={grid.visualLineOpacity}
                        />
                    ))}

                    {horizontalLines.map((z, index) => (
                        <GridBar
                            key={`horizontal-${index}`}
                            position={[0, 0.007, z]}
                            args={[grid.width, 0.012, 0.006]}
                            color={grid.visualLineColor}
                            opacity={grid.visualLineOpacity}
                        />
                    ))}
                </group>
            )}

            <group name="SparkidCircuitGridCells">
                {cells.map((cell) => {
                    const currentCell = {
                        row: cell.row,
                        col: cell.col,
                    };

                    const occupied = isOccupied(currentCell, occupiedCells);
                    const selected = isSameCell(currentCell, selectedCell);
                    const hovered = isSameCell(currentCell, hoveredCell);
                    const placeable = Boolean(selectedPart) && !occupied;

                    const color = selected
                        ? grid.selectedCellColor
                        : hovered
                            ? grid.hoveredCellColor
                            : placeable
                                ? grid.placeableCellColor
                                : "#ffffff";

                    const opacity = selected
                        ? 0.32
                        : hovered
                            ? 0.22
                            : placeable
                                ? 0.08
                                : showDebugCells
                                    ? 0.045
                                    : 0.002;

                    return (
                        <mesh
                            key={`cell-${cell.row}-${cell.col}`}
                            position={[cell.x, grid.cellHitboxLift, cell.z]}
                            renderOrder={35}
                            onPointerEnter={(event: ThreeEvent<PointerEvent>) => {
                                event.stopPropagation();
                                onCellHover?.(currentCell);
                            }}
                            onPointerLeave={(event: ThreeEvent<PointerEvent>) => {
                                event.stopPropagation();
                                onCellHover?.(null);
                            }}
                            onPointerDown={(event: ThreeEvent<PointerEvent>) => {
                                event.stopPropagation();

                                if (occupied) return;
                                if (!selectedPart) return;

                                onCellSelect?.(currentCell);
                            }}
                        >
                            <boxGeometry
                                args={[cellWidth, grid.cellHitboxHeight, cellDepth]}
                            />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={opacity}
                                depthWrite={false}
                                toneMapped={false}
                            />
                        </mesh>
                    );
                })}
            </group>
        </group>
        )}
        </>
    );
}