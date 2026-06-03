import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch";
import type { GridCell } from "./data/circuitBoardConfig";

export type CircuitFeedbackState = "empty" | "partial" | "ready" | "powered";

export type CircuitPartTool =
    | "battery"
    | "bulb"
    | "bulb2"
    | "switch"
    | "cable"
    | "cableCutter"
    | "hint";

export type CircuitPlaceableTool = "battery" | "bulb" | "bulb2" | "switch";

export type CircuitToolLimits = Partial<Record<CircuitPartTool, number>>;

export type CircuitPortPair = {
    fromPortId: string;
    toPortId: string;
};

export type CircuitPlacedParts = {
    battery: GridCell | null;
    switch: GridCell | null;
    bulb: GridCell | null;
    bulb2: GridCell | null;
    cableCount: number;
};

export type CircuitExtraBulbConfig = {
    id: string;
    cell: GridCell;
};

export type CircuitLevelConfig = {
    id: string;
    title: string;
    description?: string;
    learningGoal?: string;
    missionSteps?: string[];
    successSummary?: string;
    islandSlug?: string;
    lessonNumber?: number;
    completionMode?: "powered" | "switch-toggle-cycle" | "wire-pairs" | "free-build";
    requiresWireRemoval?: boolean;
    availableTools?: CircuitPartTool[];
    toolLimits?: CircuitToolLimits;
    cableLimit?: number;
    initialPlacedParts?: Partial<CircuitPlacedParts>;
    extraBulbs?: CircuitExtraBulbConfig[];
    initialSwitchMode?: CircuitSwitchMode;
    allowedPlacementCells?: Partial<Record<CircuitPlaceableTool, GridCell[]>>;
    allowedCablePortIds?: string[];
    sharedCablePortIds?: string[];
    guidedCablePortPairs?: CircuitPortPair[];
    initialWirePortPairs?: CircuitPortPair[];
    previewActiveWirePortPairs?: CircuitPortPair[];
    removableWirePortPairs?: CircuitPortPair[];
    warningWirePortPairs?: CircuitPortPair[];
    completionWirePortPairs?: CircuitPortPair[];
    nextRoute?: string;
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
    bulb2: null,
    cableCount: 0,
};

export const DEFAULT_CIRCUIT_AVAILABLE_TOOLS: CircuitPartTool[] = [
    "battery",
    "bulb",
    "bulb2",
    "switch",
    "cable",
    "cableCutter",
    "hint",
];

export const DEFAULT_CIRCUIT_TOOL_LIMITS: Record<CircuitPartTool, number> = {
    battery: 1,
    bulb: 1,
    bulb2: 1,
    switch: 1,
    cable: 3,
    cableCutter: 0,
    hint: 0,
};

export const DEFAULT_CIRCUIT_LEVEL_CONFIG: CircuitLevelConfig = {
    id: "power-basic",
    title: "Devre Laboratuvarı",
    description: "Pil, anahtar, ampul ve kabloyla kapalı devre kur.",
    availableTools: DEFAULT_CIRCUIT_AVAILABLE_TOOLS,
    toolLimits: DEFAULT_CIRCUIT_TOOL_LIMITS,
    cableLimit: DEFAULT_CIRCUIT_TOOL_LIMITS.cable,
    initialPlacedParts: INITIAL_CIRCUIT_PLACED_PARTS,
    initialSwitchMode: "off",
};

export function createCircuitPlacedParts(
    initialPlacedParts?: Partial<CircuitPlacedParts>,
): CircuitPlacedParts {
    return {
        ...INITIAL_CIRCUIT_PLACED_PARTS,
        ...initialPlacedParts,
        cableCount: initialPlacedParts?.cableCount ?? 0,
    };
}

export function isCircuitPlaceableTool(
    tool: CircuitPartTool | null | undefined,
): tool is CircuitPlaceableTool {
    return tool === "battery" || tool === "bulb" || tool === "bulb2" || tool === "switch";
}
