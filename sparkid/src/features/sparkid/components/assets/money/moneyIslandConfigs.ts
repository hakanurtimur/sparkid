export type MoneyIslandStatus = "available" | "locked"
export type Vec3 = [number, number, number]

export type MoneyIslandLessonConfig = {
    id: string
    title: string
    description: string
    route: string
    status: MoneyIslandStatus
    nodePosition?: Vec3
}

export type MoneyIslandConfig = {
    id: string
    order: number
    name: string
    title: string
    slug: string
    modelPath: string
    accentColor: string
    status: MoneyIslandStatus
    position: Vec3
    rotation: Vec3
    scale: number
    reward: string
    lessons: MoneyIslandLessonConfig[]
}

export const moneyIslandConfigs: MoneyIslandConfig[] = [
    {
        id: "money-island-01-need-want",
        order: 1,
        name: "Need or Want Island",
        title: "İhtiyaç mı, İstek mi?",
        slug: "need-want",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#35E5F2",
        status: "available",
        position: [0, 0, 0],
        rotation: [0, 0.35, 0],
        scale: 1,
        reward: "Choice Lens",
        lessons: [
            {
                id: "need-want-lesson-01",
                title: "İhtiyaç ve İstekleri Ayır",
                description:
                    "Ürünleri İhtiyaç veya İstek paneline bağlayarak karar ver.",
                route: "/money-lab?island=need-want&lesson=1",
                status: "available",
                nodePosition: [-1.85, 0.3, 2.05],
            },
            {
                id: "need-want-lesson-02",
                title: "Akıllı Seçim Yap",
                description:
                    "Alışveriş kararlarında önce gerekli olanı fark et.",
                route: "/money-lab?island=need-want&lesson=2",
                status: "locked",
                nodePosition: [-0.45, 0.3, 1.95],
            },
            {
                id: "need-want-lesson-03",
                title: "Choice Lens'i Kazan",
                description:
                    "Tüm seçimleri doğru yap ve karar lensini aktive et.",
                route: "/money-lab?island=need-want&lesson=3",
                status: "locked",
                nodePosition: [1.05, 0.3, 1.45],
            },
        ],
    },
    {
        id: "money-island-02-budget",
        order: 2,
        name: "Budget Island",
        title: "Bütçe Adası",
        slug: "budget",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#FFD84A",
        status: "locked",
        position: [3.2, 0, -1.2],
        rotation: [0, -0.25, 0],
        scale: 0.95,
        reward: "Budget Planner",
        lessons: [],
    },
    {
        id: "money-island-03-savings",
        order: 3,
        name: "Savings Island",
        title: "Birikim Adası",
        slug: "savings",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#45E39A",
        status: "locked",
        position: [-3.2, 0, -1.4],
        rotation: [0, 0.45, 0],
        scale: 0.95,
        reward: "Savings Jar",
        lessons: [],
    },
    {
        id: "money-island-04-smart-shopping",
        order: 4,
        name: "Smart Shopping Island",
        title: "Akıllı Sepet Adası",
        slug: "smart-shopping",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#FFB72C",
        status: "locked",
        position: [1.8, 0, -3.8],
        rotation: [0, -0.55, 0],
        scale: 1,
        reward: "Smart Cart",
        lessons: [],
    },
    {
        id: "money-island-05-money-master",
        order: 5,
        name: "Money Master Island",
        title: "Money Master Adası",
        slug: "money-master",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#8B5CFF",
        status: "locked",
        position: [-1.8, 0, -3.8],
        rotation: [0, 0.6, 0],
        scale: 1,
        reward: "Money Master Badge",
        lessons: [],
    },
]

export const NEED_WANT_ISLAND_CONFIG = moneyIslandConfigs[0]

export function getMoneyIslandBySlug(
    slug: string,
): MoneyIslandConfig | undefined {
    return moneyIslandConfigs.find((island) => island.slug === slug)
}
