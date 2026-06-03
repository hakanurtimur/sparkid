import type { CircuitLevelConfig, CircuitPortPair } from "../types"

const BASIC_CLOSED_CIRCUIT_WIRES: CircuitPortPair[] = [
    {
        fromPortId: "battery:plus",
        toPortId: "bulb:a",
    },
    {
        fromPortId: "bulb:b",
        toPortId: "battery:minus",
    },
]

const RETURN_PATH_WIRE: CircuitPortPair = {
    fromPortId: "bulb:b",
    toPortId: "battery:minus",
}

const POSITIVE_PATH_WIRE: CircuitPortPair = {
    fromPortId: "battery:plus",
    toPortId: "bulb:a",
}

const WRONG_RETURN_WIRE: CircuitPortPair = {
    fromPortId: "bulb:b",
    toPortId: "battery:plus",
}

const SWITCH_CIRCUIT_WIRES: CircuitPortPair[] = [
    {
        fromPortId: "battery:plus",
        toPortId: "switch-1:in",
    },
    {
        fromPortId: "switch-1:out",
        toPortId: "bulb:a",
    },
    {
        fromPortId: "bulb:b",
        toPortId: "battery:minus",
    },
]

export const FAULT_ISLAND_LESSON_1_CONFIG: CircuitLevelConfig = {
    id: "fault-island-lesson-1",
    title: "Eksik Dönüş Yolunu Bul",
    islandSlug: "fault",
    lessonNumber: 1,
    description:
        "Enerji ampule ulaşıyor ama pile geri dönemiyor. Eksik dönüş yolunu tamamla.",
    learningGoal:
        "Ampule gelen enerjinin geri dönemediğinde devrenin neden çalışmadığını hata ayıklayarak öğren.",
    missionSteps: [
        "Hazır gelen ilk enerji yolunu incele.",
        "Ampulün boşta kalan ucunu pilin eksi ucuna bağla.",
        "Dönüş yolu tamamlanınca ampulün yandığını doğrula.",
    ],
    successSummary:
        "Eksik dönüş yolunu buldun. Enerji artık ampulden geçip pile geri dönebiliyor.",
    completionMode: "wire-pairs",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 2,
        hint: 0,
    },
    cableLimit: 2,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 1,
    },
    initialSwitchMode: "on",
    allowedCablePortIds: ["bulb:b", "battery:minus"],
    initialWirePortPairs: [POSITIVE_PATH_WIRE],
    previewActiveWirePortPairs: [POSITIVE_PATH_WIRE],
    guidedCablePortPairs: [RETURN_PATH_WIRE],
    completionWirePortPairs: BASIC_CLOSED_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=fault&lesson=2",
}

export const FAULT_ISLAND_LESSON_2_CONFIG: CircuitLevelConfig = {
    id: "fault-island-lesson-2",
    title: "Yanlış Kabloyu Düzelt",
    islandSlug: "fault",
    lessonNumber: 2,
    description:
        "Bağlı görünen ama yanlış porta giden kabloyu bul ve doğru dönüş yolunu kur.",
    learningGoal:
        "Bir kablo bağlı görünse bile yanlış porta gidiyorsa devrenin çalışmayacağını fark et.",
    missionSteps: [
        "Turuncu uyarı kablosunu bul.",
        "Yanlış kabloyu kaldır veya değiştir.",
        "Ampulden çıkan yolu pilin eksi ucuna bağla.",
    ],
    successSummary:
        "Yanlış bağlantıyı düzelttin. Bağlı olmak yetmez, kablonun doğru porta gitmesi gerekir.",
    completionMode: "wire-pairs",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 2,
        hint: 0,
    },
    cableLimit: 2,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: null,
        bulb: { row: 1, col: 3 },
        cableCount: 2,
    },
    initialSwitchMode: "on",
    allowedCablePortIds: ["bulb:b", "battery:minus"],
    initialWirePortPairs: [POSITIVE_PATH_WIRE, WRONG_RETURN_WIRE],
    previewActiveWirePortPairs: [POSITIVE_PATH_WIRE],
    removableWirePortPairs: [WRONG_RETURN_WIRE],
    warningWirePortPairs: [WRONG_RETURN_WIRE],
    guidedCablePortPairs: [RETURN_PATH_WIRE],
    completionWirePortPairs: BASIC_CLOSED_CIRCUIT_WIRES,
    nextRoute: "/circuit?island=fault&lesson=3",
}

export const FAULT_ISLAND_LESSON_3_CONFIG: CircuitLevelConfig = {
    id: "fault-island-lesson-3",
    title: "Eksik Güç Kaynağını Bul",
    islandSlug: "fault",
    lessonNumber: 3,
    description:
        "Masada anahtar ve ampul var ama devreyi başlatacak pil eksik. Güç kaynağını ekle.",
    learningGoal:
        "Devrede sadece tüketici ve kontrol parçası olmasının yetmediğini, enerji kaynağı olmadan akış başlamadığını öğren.",
    missionSteps: [
        "Eksik güç kaynağı olan pili masaya yerleştir.",
        "Pilin artı ucunu anahtar girişine bağla.",
        "Anahtar, ampul ve pil eksi ucu üzerinden kapalı yolu tamamla.",
    ],
    successSummary:
        "Eksik güç kaynağını ekledin ve anahtarlı kapalı yolu kurdun. Arıza bu kez yanlış kablo değil, eksik parçaydı.",
    completionMode: "powered",
    availableTools: ["battery", "cable", "hint"],
    toolLimits: {
        battery: 1,
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: null,
        switch: { row: 1, col: 2 },
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    initialSwitchMode: "off",
    allowedPlacementCells: {
        battery: [{ row: 2, col: 0 }],
    },
    allowedCablePortIds: [
        "battery:plus",
        "battery:minus",
        "switch-1:in",
        "switch-1:out",
        "bulb:a",
        "bulb:b",
    ],
    guidedCablePortPairs: SWITCH_CIRCUIT_WIRES,
    completionWirePortPairs: SWITCH_CIRCUIT_WIRES,
}

export function getFaultIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    const lessonNumber = Array.isArray(lesson) ? lesson[0] : lesson

    if (lessonNumber === "1") {
        return FAULT_ISLAND_LESSON_1_CONFIG
    }

    if (lessonNumber === "2") {
        return FAULT_ISLAND_LESSON_2_CONFIG
    }

    if (lessonNumber === "3") {
        return FAULT_ISLAND_LESSON_3_CONFIG
    }

    return undefined
}
