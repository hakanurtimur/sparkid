import type { CircuitLevelConfig } from "../types"

const SWITCH_CIRCUIT_COMPLETION_WIRES = [
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

const SWITCH_CIRCUIT_PORTS = [
    "battery:plus",
    "battery:minus",
    "switch-1:in",
    "switch-1:out",
    "bulb:a",
    "bulb:b",
]

export const SWITCH_ISLAND_LESSON_1_CONFIG: CircuitLevelConfig = {
    id: "switch-island-lesson-1",
    title: "Anahtarı Tanı",
    islandSlug: "switch",
    lessonNumber: 1,
    description:
        "Anahtarın ON ve OFF durumlarını deneyerek elektrik yolunu nasıl kontrol ettiğini gör.",
    learningGoal:
        "Anahtarın elektrik yolunu açıp kapatan bir kontrol noktası olduğunu deneyerek fark et.",
    missionSteps: [
        "Anahtarı ON konumuna getir.",
        "Anahtarı OFF konumuna geri al.",
        "Anahtar değişince yolun görsel olarak nasıl değiştiğini gözlemle.",
    ],
    successSummary:
        "Anahtarın iki durumunu da test ettin. ON durumunda yol tamamlanır, OFF durumunda elektrik geçemez.",
    completionMode: "switch-toggle-cycle",
    availableTools: ["hint"],
    toolLimits: {
        hint: 0,
    },
    cableLimit: 0,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: { row: 1, col: 2 },
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    initialSwitchMode: "off",
    nextRoute: "/circuit?island=switch&lesson=2",
}

export const SWITCH_ISLAND_LESSON_2_CONFIG: CircuitLevelConfig = {
    id: "switch-island-lesson-2",
    title: "Anahtarlı Devre Kur",
    islandSlug: "switch",
    lessonNumber: 2,
    description:
        "Pilden çıkan enerjiyi anahtardan geçir, ampule ulaştır ve dönüş yolunu tamamla.",
    learningGoal:
        "Anahtar seri devrenin içine girince, bağlantılar doğru olsa bile OFF durumunda ampulün yanmayacağını öğren.",
    missionSteps: [
        "Pil artı ucunu anahtar girişine bağla.",
        "Anahtar çıkışını ampule bağla.",
        "Ampulden pil eksi ucuna dönüş yolunu kur ve anahtarı ON yap.",
    ],
    successSummary:
        "Anahtarlı seri devreyi kurdun. Anahtar ON olunca elektrik ampule ulaşabildi ve ampul yandı.",
    completionMode: "powered",
    availableTools: ["cable", "hint"],
    toolLimits: {
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: { row: 2, col: 0 },
        switch: { row: 1, col: 2 },
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    initialSwitchMode: "off",
    allowedCablePortIds: SWITCH_CIRCUIT_PORTS,
    guidedCablePortPairs: SWITCH_CIRCUIT_COMPLETION_WIRES,
    completionWirePortPairs: SWITCH_CIRCUIT_COMPLETION_WIRES,
    nextRoute: "/circuit?island=switch&lesson=3",
}

export const SWITCH_ISLAND_LESSON_3_CONFIG: CircuitLevelConfig = {
    id: "switch-island-lesson-3",
    title: "Control Gate’i Aç",
    islandSlug: "switch",
    lessonNumber: 3,
    description:
        "Parçaları masaya yerleştir, anahtarlı devreyi kur ve kontrol kapısını çalıştır.",
    learningGoal:
        "Parçaları kendin yerleştirip anahtarlı devre kurarak kontrol kapısını çalıştırmayı öğren.",
    missionSteps: [
        "Pil, anahtar ve ampulü parlayan yuvalara yerleştir.",
        "Devreyi pil, anahtar, ampul ve dönüş yolu sırasıyla bağla.",
        "Anahtarı ON yaparak kontrol kapısını çalıştır.",
    ],
    successSummary:
        "Kontrol kapısını açtın. Anahtarın sadece ampulü değil, bütün enerji yolunu yönetebildiğini gördün.",
    completionMode: "powered",
    availableTools: ["battery", "switch", "bulb", "cable", "hint"],
    toolLimits: {
        battery: 1,
        switch: 1,
        bulb: 1,
        cable: 3,
        hint: 0,
    },
    cableLimit: 3,
    initialPlacedParts: {
        battery: null,
        switch: null,
        bulb: null,
        cableCount: 0,
    },
    initialSwitchMode: "off",
    allowedPlacementCells: {
        battery: [{ row: 2, col: 0 }],
        switch: [{ row: 1, col: 2 }],
        bulb: [{ row: 0, col: 3 }],
    },
    allowedCablePortIds: SWITCH_CIRCUIT_PORTS,
    guidedCablePortPairs: SWITCH_CIRCUIT_COMPLETION_WIRES,
    completionWirePortPairs: SWITCH_CIRCUIT_COMPLETION_WIRES,
}

export function getSwitchIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    const lessonNumber = Array.isArray(lesson) ? lesson[0] : lesson

    if (lessonNumber === "1") {
        return SWITCH_ISLAND_LESSON_1_CONFIG
    }

    if (lessonNumber === "2") {
        return SWITCH_ISLAND_LESSON_2_CONFIG
    }

    if (lessonNumber === "3") {
        return SWITCH_ISLAND_LESSON_3_CONFIG
    }

    return undefined
}
