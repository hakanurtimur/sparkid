import type { CircuitLevelConfig } from "../types"

const FREE_LAB_PORTS = [
    "battery:plus",
    "battery:minus",
    "switch-1:in",
    "switch-1:out",
    "bulb:a",
    "bulb:b",
    "bulb-2:a",
    "bulb-2:b",
]

export const FREE_LAB_SANDBOX_CONFIG: CircuitLevelConfig = {
    id: "free-lab-sandbox",
    title: "Serbest Devre Masası",
    islandSlug: "free-lab",
    lessonNumber: 1,
    description:
        "Öğrendiğin parçaları istediğin yere yerleştir, istediğin gibi bağla ve çalışan devreyi keşfet.",
    learningGoal:
        "Pil, anahtar, iki ampul ve kablolarla kendi devreni kur. En az bir ampulü gerçek bir kapalı yolla yak.",
    missionSteps: [
        "Parçaları masada istediğin boş hücrelere yerleştir.",
        "Kablolarla pilin artısından başlayıp parçaların içinden geçerek pilin eksisine dönen bir yol kur.",
        "Basit, anahtarlı, seri veya paralel çalışan bir devreyi yak ve Sparky’nin raporunu oku.",
    ],
    successSummary:
        "Kendi çalışan devreni kurdun. Artık devreleri deneyebilir, test edebilir ve hatalarını anlayabilirsin.",
    completionMode: "free-build",
    availableTools: ["battery", "switch", "bulb", "bulb2", "cable", "hint"],
    toolLimits: {
        battery: 1,
        switch: 1,
        bulb: 1,
        bulb2: 1,
        cable: 6,
        hint: 0,
    },
    cableLimit: 6,
    initialPlacedParts: {
        battery: null,
        switch: null,
        bulb: null,
        bulb2: null,
        cableCount: 0,
    },
    initialSwitchMode: "off",
    sharedCablePortIds: ["battery:plus", "battery:minus"],
    allowedCablePortIds: FREE_LAB_PORTS,
}

export function getFreeLabIslandCircuitLevelConfig(
    lesson?: string | string[] | null,
) {
    void lesson

    return FREE_LAB_SANDBOX_CONFIG
}
