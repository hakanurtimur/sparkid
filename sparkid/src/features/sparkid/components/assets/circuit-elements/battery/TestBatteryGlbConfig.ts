export const TEST_BATTERY_MODEL_PATH = "/models/sparkid/test-battery-body.glb"

export const TEST_BATTERY_EXPORT_FILE_NAME = "test-battery-body.glb"

export const TEST_BATTERY_NODES = {
    body: "TestBatteryBody",
} as const

export type TestBatteryAnimation =
    | "idle"
    | "talk"
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "active"
    | "lowEnergy"