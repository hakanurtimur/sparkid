import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch";
import type { GridCell } from "./data/circuitBoardConfig";

export type CircuitFeedbackState = "empty" | "partial" | "ready" | "powered";

export type CircuitPartTool = "battery" | "bulb" | "switch" | "cable" | "hint";

export type CircuitPlaceableTool = "battery" | "bulb" | "switch";

export type CircuitPlacedParts = {
    battery: GridCell | null;
    switch: GridCell | null;
    bulb: GridCell | null;
    cableCount: number;
};

export type CircuitLabState = {
    feedbackState: CircuitFeedbackState;
    switchMode: CircuitSwitchMode;
    powered: boolean;
    connectionCount: number;
    hasBatteryConnection: boolean;
    hasSwitchConnection: boolean;
    hasBulbConnection: boolean;
};

export const INITIAL_CIRCUIT_PLACED_PARTS: CircuitPlacedParts = {
    battery: null,
    switch: null,
    bulb: null,
    cableCount: 0,
};

export function isCircuitPlaceableTool(
    tool: CircuitPartTool | null | undefined,
): tool is CircuitPlaceableTool {
    return tool === "battery" || tool === "bulb" || tool === "switch";
}