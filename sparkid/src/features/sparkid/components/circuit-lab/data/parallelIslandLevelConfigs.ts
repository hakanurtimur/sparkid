import type { CircuitLevelConfig, CircuitPortPair } from "../types"

const BRANCH_ONE_POSITIVE_WIRE: CircuitPortPair = {
    fromPortId: "battery:plus",
    toPortId: "bulb:a",
}

const BRANCH_ONE_RETURN_WIRE: CircuitPortPair = {
    fromPortId: "bulb:b",
    toPortId: "battery:minus",
}

const BRANCH_TWO_POSITIVE_WIRE: CircuitPortPair = {
    fromPortId: "battery:plus",
    toPortId: "bulb-2:a",
}

const BRANCH_TWO_RETURN_WIRE: CircuitPortPair = {
    fromPortId: "bulb-2:b",
    toPortId: "battery:minus",
}

const PARALLEL_CIRCUIT_WIRES: CircuitPortPair[] = [
    BRANCH_ONE_POSITIVE_WIRE,
    BRANCH_ONE_RETURN_WIRE,
    BRANCH_TWO_POSITIVE_WIRE,
    BRANCH_TWO_RETURN_WIRE,
]

const PARALLEL_CIRCUIT_PORTS = [
    "battery:plus",
    "battery:minus",
    "bulb:a",
    "bulb:b",
    "bulb-2:a",
    "bulb-2:b",
]

const SHARED_BATTERY_PORTS = ["battery:plus", "battery:minus"]

const SECOND_BULB = {
    id: "bulb-2",
    cell: { row: 1, col: 1 },
}

export const PARALLEL_ISLAND_LESSON_1_CONFIG: CircuitLevelConfig = {
    id: "parallel-island-lesson-1",
    title: "İkinci Işığı Paralel Bağla",
    islandSlug: "parallel",
    lessonNumber: 1,
    description:
        "Çalışan tek ampullü devreye ikinci ampul için ayrı bir yol ekle.",
    learningGoal:
        "Paralel devrede ikinci ampulün birinci ampulün devamına değil, pile bağlı kendi ayrı yoluna sahip olduğunu öğren.",
    missionSteps: [
        "Çalışan ilk ampulün kendi yolunu incele.",
        "İkinci ampulü pilin artı ucuna bağla.",
        "İkinci ampulden pilin eksi ucuna dönerek ayrı kolu tamamla.",
    ],
    successSummary:
        "İkinci ışık için ayrı bir kol kurdun. İki ampul aynı pilden enerji alıyor ama kendi yollarından çalışıyor.",
    completionMode: "powered",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 4,
        hint: 0,
    },
    cableLimit: 4,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 2,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    sharedCablePortIds: SHARED_BATTERY_PORTS,
    allowedCablePortIds: PARALLEL_CIRCUIT_PORTS,
    initialWirePortPairs: [BRANCH_ONE_POSITIVE_WIRE, BRANCH_ONE_RETURN_WIRE],
    previewActiveWirePortPairs: [BRANCH_ONE_POSITIVE_WIRE, BRANCH_ONE_RETURN_WIRE],
    guidedCablePortPairs: [BRANCH_TWO_POSITIVE_WIRE, BRANCH_TWO_RETURN_WIRE],
    completionWirePortPairs: PARALLEL_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=parallel&lesson=2",
}

export const PARALLEL_ISLAND_LESSON_2_CONFIG: CircuitLevelConfig = {
    id: "parallel-island-lesson-2",
    title: "Bir Kol Koparsa Ne Olur?",
    islandSlug: "parallel",
    lessonNumber: 2,
    description:
        "Paralel devrede bir kol kopsa bile diğer kolun çalışmaya devam ettiğini gözlemle.",
    learningGoal:
        "Paralel devrede her kolun kendi yolu olduğu için bir kol bozulsa bile diğer kolun çalışabileceğini öğren.",
    missionSteps: [
        "İkinci ampulün dönüş kablosunu çıkar.",
        "Bir kolun koptuğunu ve diğer kolun hâlâ tamam olduğunu gözlemle.",
        "İkinci kolun dönüş yolunu tekrar bağla.",
    ],
    successSummary:
        "Paralel kolu onardın. Paralel devrede her ışığın ayrı yolu olduğu için bir koldaki sorun diğerini durdurmaz.",
    completionMode: "powered",
    requiresWireRemoval: true,
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 4,
        hint: 0,
    },
    cableLimit: 4,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 4,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    sharedCablePortIds: SHARED_BATTERY_PORTS,
    allowedCablePortIds: PARALLEL_CIRCUIT_PORTS,
    initialWirePortPairs: PARALLEL_CIRCUIT_WIRES,
    removableWirePortPairs: [BRANCH_TWO_RETURN_WIRE],
    guidedCablePortPairs: [BRANCH_TWO_RETURN_WIRE],
    completionWirePortPairs: PARALLEL_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=parallel&lesson=3",
}

export const PARALLEL_ISLAND_LESSON_3_CONFIG: CircuitLevelConfig = {
    id: "parallel-island-lesson-3",
    title: "Paralel Işık Sistemini Kur",
    islandSlug: "parallel",
    lessonNumber: 3,
    description:
        "İki ampul için iki ayrı tamamlanmış elektrik yolu kur.",
    learningGoal:
        "İki ampulün de pilin artı ve eksi uçlarına ayrı ayrı bağlandığı paralel ışık sistemini sıfırdan kur.",
    missionSteps: [
        "Birinci ampulün pil artıdan pil eksiye dönen yolunu kur.",
        "İkinci ampul için ayrı bir artı bağlantısı kur.",
        "İkinci ampulün dönüş yolunu da pil eksi ucuna bağla.",
    ],
    successSummary:
        "Paralel ışık sistemini kurdun. Elektrik iki farklı yoldan akabiliyor ve iki ampul birlikte çalışıyor.",
    completionMode: "powered",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 4,
        hint: 0,
    },
    cableLimit: 4,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    sharedCablePortIds: SHARED_BATTERY_PORTS,
    allowedCablePortIds: PARALLEL_CIRCUIT_PORTS,
    guidedCablePortPairs: PARALLEL_CIRCUIT_WIRES,
    completionWirePortPairs: PARALLEL_CIRCUIT_WIRES,
}

export function getParallelIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    const lessonNumber = Array.isArray(lesson) ? lesson[0] : lesson

    if (lessonNumber === "1") {
        return PARALLEL_ISLAND_LESSON_1_CONFIG
    }

    if (lessonNumber === "2") {
        return PARALLEL_ISLAND_LESSON_2_CONFIG
    }

    if (lessonNumber === "3") {
        return PARALLEL_ISLAND_LESSON_3_CONFIG
    }

    return undefined
}
