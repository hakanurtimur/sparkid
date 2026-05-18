export type Vec3 = [number, number, number];

export type GridCell = {
    row: number;
    col: number;
};

export type CircuitPlaceablePart = "battery" | "switch" | "bulb";

export const CIRCUIT_BOARD_CONFIG = {
    table: {
        glbPath: "/models/sparkid/sparkid-lab-table-no-grid.glb",
        position: [0, 0, 0] as Vec3,
        rotation: [0, -0.48, 0] as Vec3,
        scale: 1.35,
    },

    grid: {
        position: [0, 0.776, 0] as Vec3,
        rotation: [0, 0, 0] as Vec3,

        width: 2.26,
        depth: 1.55,

        columns: 4,
        rows: 4,

        showVisualGrid: true,
        showDebugCells: false,

        visualLineColor: "#8aa0b8",
        visualLineOpacity: 0.28,

        selectedCellColor: "#facc15",
        hoveredCellColor: "#38bdf8",
        placeableCellColor: "#35e5f2",

        cellHitboxLift: 0.035,
        cellHitboxHeight: 0.012,
    },

    placement: {
        battery: {
            defaultCell: { row: 1, col: 0 } as GridCell,
            scale: 0.1,
            xOffset: 0.07,
            yOffset: 0.15,
            zOffset: 0,
        },

        switch: {
            defaultCell: { row: 1, col: 1 } as GridCell,
            scale: 0.2,
            xOffset: 0,
            yOffset: 0.02,
            zOffset: 0,
        },

        bulb: {
            defaultCell: { row: 1, col: 3 } as GridCell,
            scale: 0.15,
            xOffset: 0,
            yOffset: 0.16,
            zOffset: 0,
        },
    },
};

export type CircuitBoardTableConfig = typeof CIRCUIT_BOARD_CONFIG.table;
export type CircuitBoardGridConfig = typeof CIRCUIT_BOARD_CONFIG.grid;
