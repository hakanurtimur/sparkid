import type { GridCell, Vec3 } from "../data/circuitBoardConfig";

type GridConfig = {
    position: Vec3;
    width: number;
    depth: number;
    columns: number;
    rows: number;
};

export function getGridCellCenter(
    grid: GridConfig,
    cell: GridCell,
): Vec3 {
    const safeCol = Math.min(Math.max(cell.col, 0), grid.columns - 1);
    const safeRow = Math.min(Math.max(cell.row, 0), grid.rows - 1);

    const cellWidth = grid.width / grid.columns;
    const cellDepth = grid.depth / grid.rows;

    const x = -grid.width / 2 + cellWidth / 2 + safeCol * cellWidth;
    const z = -grid.depth / 2 + cellDepth / 2 + safeRow * cellDepth;

    return [
        grid.position[0] + x,
        grid.position[1],
        grid.position[2] + z,
    ];
}