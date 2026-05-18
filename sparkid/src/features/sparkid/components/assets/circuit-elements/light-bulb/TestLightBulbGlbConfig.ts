export const TEST_LIGHT_BULB_MODEL_PATH =
    "/models/sparkid/test-light-bulb-body.glb"

export const TEST_LIGHT_BULB_EXPORT_FILE_NAME = "test-light-bulb-body.glb"

export const TEST_LIGHT_BULB_NODES = {
    body: "TestLightBulbBody",
} as const

export type TestLightBulbMood =
    | "off"
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy"

export type TestLightBulbAnimation =
    | "hover"
    | "bob"
    | "rotate"
    | "excited"
    | "talk"