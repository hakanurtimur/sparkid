import type { CircuitLevelConfig } from "../types"

export const POWER_ISLAND_LESSON_1_CONFIG: CircuitLevelConfig = {
    id: "power-island-lesson-1",
    title: "Pilden Ampule İlk Enerji",
    islandSlug: "power",
    lessonNumber: 1,
    description:
        "Pili masaya yerleştir ve pilin artı ucundan ampule ilk enerji yolunu kur.",
    learningGoal:
        "Enerjinin ampule ulaşmasının tek başına yetmediğini, ampulün yanması için dönüş yoluna da ihtiyaç olduğunu keşfet.",
    missionSteps: [
        "Pili parlayan güç yuvasına yerleştir.",
        "Kabloyla pilin artı ucunu ampule bağla.",
        "Ampulün neden hâlâ yanmadığını gözlemle.",
    ],
    successSummary:
        "İlk enerji yolunu kurdun. Enerji ampule ulaştı ama pile geri dönemediği için devre henüz kapanmadı.",
    availableTools: ["battery", "cable", "hint"],
    toolLimits: {
        battery: 1,
        cable: 1,
        hint: 0,
    },
    cableLimit: 1,
    initialPlacedParts: {
        battery: null,
        switch: null,
        bulb: { row: 0, col: 3 },
        cableCount: 0,
    },
    initialSwitchMode: "off",
    allowedPlacementCells: {
        battery: [{ row: 2, col: 0 }],
    },
    allowedCablePortIds: ["battery:plus", "bulb:a"],
    previewActiveWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
    ],
    completionWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
    ],
    nextRoute: "/circuit?island=power&lesson=2",
}

export const POWER_ISLAND_LESSON_2_CONFIG: CircuitLevelConfig = {
    id: "power-island-lesson-2",
    title: "Dönüş Yolunu Tamamla",
    islandSlug: "power",
    lessonNumber: 2,
    description:
        "Ampulün diğer ucunu pilin eksi ucuna bağla ve kapalı devreyi tamamla.",
    learningGoal:
        "Elektriğin tam tur dolaşması için ampulden pilin eksi ucuna dönen kapalı bir yol gerektiğini öğren.",
    missionSteps: [
        "Ampulün boşta kalan ucunu bul.",
        "Ampulün diğer ucunu pilin eksi ucuna bağla.",
        "Kapalı devre tamamlanınca ampulün yandığını gözlemle.",
    ],
    successSummary:
        "Kapalı devreyi tamamladın. Enerji pilin artı ucundan çıktı, ampulden geçti ve pilin eksi ucuna geri döndü.",
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
    initialWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
    ],
    previewActiveWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
    ],
    completionWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
        {
            fromPortId: "bulb:b",
            toPortId: "battery:minus",
        },
    ],
    nextRoute: "/circuit?island=power&lesson=3",
}

export const POWER_ISLAND_LESSON_3_CONFIG: CircuitLevelConfig = {
    id: "power-island-lesson-3",
    title: "Kapalı Devreyi Test Et",
    islandSlug: "power",
    lessonNumber: 3,
    description:
        "Çalışan devrede dönüş yolunu çıkar, ampulün söndüğünü gör ve devreyi tekrar tamamla.",
    learningGoal:
        "Kapalı devrede bir bağlantı koparsa elektrik akışının durduğunu ve ampulün söndüğünü deneyerek gör.",
    missionSteps: [
        "Çalışan dönüş kablosunu çıkar.",
        "Ampulün sönmesini ve enerji akışının durmasını izle.",
        "Dönüş yolunu tekrar bağlayarak ampulü yeniden yak.",
    ],
    successSummary:
        "Devre kopunca ampulün söndüğünü, dönüş yolu yeniden kurulunca tekrar yandığını test ettin.",
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
        cableCount: 2,
    },
    initialSwitchMode: "on",
    allowedCablePortIds: ["bulb:b", "battery:minus"],
    initialWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
        {
            fromPortId: "bulb:b",
            toPortId: "battery:minus",
        },
    ],
    removableWirePortPairs: [
        {
            fromPortId: "bulb:b",
            toPortId: "battery:minus",
        },
    ],
    completionWirePortPairs: [
        {
            fromPortId: "battery:plus",
            toPortId: "bulb:a",
        },
        {
            fromPortId: "bulb:b",
            toPortId: "battery:minus",
        },
    ],
}

export function getPowerIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    const lessonNumber = Array.isArray(lesson) ? lesson[0] : lesson

    if (lessonNumber === "1") {
        return POWER_ISLAND_LESSON_1_CONFIG
    }

    if (lessonNumber === "2") {
        return POWER_ISLAND_LESSON_2_CONFIG
    }

    if (lessonNumber === "3") {
        return POWER_ISLAND_LESSON_3_CONFIG
    }

    return undefined
}
