import type { CircuitLevelConfig, CircuitPortPair } from "../types"

const FIRST_SERIES_WIRE: CircuitPortPair = {
    fromPortId: "battery:plus",
    toPortId: "bulb:a",
}

const MIDDLE_SERIES_WIRE: CircuitPortPair = {
    fromPortId: "bulb:b",
    toPortId: "bulb-2:a",
}

const RETURN_SERIES_WIRE: CircuitPortPair = {
    fromPortId: "bulb-2:b",
    toPortId: "battery:minus",
}

const SERIES_CIRCUIT_WIRES: CircuitPortPair[] = [
    FIRST_SERIES_WIRE,
    MIDDLE_SERIES_WIRE,
    RETURN_SERIES_WIRE,
]

const SERIES_CIRCUIT_PORTS = [
    "battery:plus",
    "battery:minus",
    "bulb:a",
    "bulb:b",
    "bulb-2:a",
    "bulb-2:b",
]

const SECOND_BULB = {
    id: "bulb-2",
    cell: { row: 1, col: 1 },
}

export const SERIES_ISLAND_LESSON_1_CONFIG: CircuitLevelConfig = {
    id: "series-island-lesson-1",
    title: "İkinci Ampulü Zincire Ekle",
    islandSlug: "series",
    lessonNumber: 1,
    description:
        "Çalışan tek ampullü devreye ikinci ampulü aynı yolun devamı olarak ekle.",
    learningGoal:
        "Seri devrede ikinci ampulün ayrı bir kısa yola değil, birinci ampulün devamına eklenmesi gerektiğini öğren.",
    missionSteps: [
        "Çalışan tek ampullü devrede dönüş kablosunu çıkar.",
        "Birinci ampulün çıkışını ikinci ampulün girişine bağla.",
        "İkinci ampulden pilin eksi ucuna dönerek zinciri tamamla.",
    ],
    successSummary:
        "İkinci ampulü seri zincire ekledin. Elektrik artık önce birinci ampulden, sonra ikinci ampulden geçerek pile dönüyor.",
    completionMode: "powered",
    requiresWireRemoval: true,
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 2,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    allowedCablePortIds: SERIES_CIRCUIT_PORTS,
    initialWirePortPairs: [FIRST_SERIES_WIRE, {
        fromPortId: "bulb:b",
        toPortId: "battery:minus",
    }],
    previewActiveWirePortPairs: [FIRST_SERIES_WIRE],
    removableWirePortPairs: [{
        fromPortId: "bulb:b",
        toPortId: "battery:minus",
    }],
    guidedCablePortPairs: [MIDDLE_SERIES_WIRE, RETURN_SERIES_WIRE],
    completionWirePortPairs: SERIES_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=series&lesson=2",
}

export const SERIES_ISLAND_LESSON_2_CONFIG: CircuitLevelConfig = {
    id: "series-island-lesson-2",
    title: "Zincirdeki Kopukluğu Bul",
    islandSlug: "series",
    lessonNumber: 2,
    description:
        "Seri devrede bir bağlantı koparsa tüm devrenin durduğunu gözlemle.",
    learningGoal:
        "Seri devrede tek bir kopukluğun bütün ışık zincirini durdurduğunu deneyerek öğren.",
    missionSteps: [
        "İki ampul arasındaki orta kabloyu çıkar.",
        "Tek yol koptuğu için ışıkların söndüğünü gözlemle.",
        "Orta kabloyu tekrar bağlayarak iki ampulü yeniden yak.",
    ],
    successSummary:
        "Seri zincirde kopukluğu bulup onardın. Bir halka koparsa bütün seri devre durur.",
    completionMode: "powered",
    requiresWireRemoval: true,
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 3,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    allowedCablePortIds: SERIES_CIRCUIT_PORTS,
    initialWirePortPairs: SERIES_CIRCUIT_WIRES,
    removableWirePortPairs: [MIDDLE_SERIES_WIRE],
    guidedCablePortPairs: [MIDDLE_SERIES_WIRE],
    completionWirePortPairs: SERIES_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=series&lesson=3",
}

export const SERIES_ISLAND_LESSON_3_CONFIG: CircuitLevelConfig = {
    id: "series-island-lesson-3",
    title: "Seri Işık Zincirini Kur",
    islandSlug: "series",
    lessonNumber: 3,
    description:
        "İki ampulü tek bir elektrik yolu üzerinde arka arkaya bağla.",
    learningGoal:
        "Sıfırdan seri devre kurarak elektriğin tek zincir gibi iki ampulden sırayla geçtiğini öğren.",
    missionSteps: [
        "Pilin artı ucunu birinci ampule bağla.",
        "Birinci ampulün çıkışını ikinci ampule bağla.",
        "İkinci ampulden pilin eksi ucuna dönerek devreyi tamamla.",
    ],
    successSummary:
        "Seri ışık zincirini sıfırdan kurdun. Elektrik tek yol üzerinden iki ampulden geçip pile döndü.",
    completionMode: "powered",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    extraBulbs: [SECOND_BULB],
    initialSwitchMode: "on",
    allowedCablePortIds: SERIES_CIRCUIT_PORTS,
    guidedCablePortPairs: SERIES_CIRCUIT_WIRES,
    completionWirePortPairs: SERIES_CIRCUIT_WIRES,
}

export function getSeriesIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    const lessonNumber = Array.isArray(lesson) ? lesson[0] : lesson

    if (lessonNumber === "1") {
        return SERIES_ISLAND_LESSON_1_CONFIG
    }

    if (lessonNumber === "2") {
        return SERIES_ISLAND_LESSON_2_CONFIG
    }

    if (lessonNumber === "3") {
        return SERIES_ISLAND_LESSON_3_CONFIG
    }

    return undefined
}
