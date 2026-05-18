export type IslandStatus = "available" | "locked"
export type Vec3 = [number, number, number]

export type IslandReward = {
    id: string
    name: string
    displayName: string
    description: string
}

export type IslandLessonConfig = {
    id: string
    title: string
    description: string
    route: string
    status: IslandStatus
    nodePosition?: Vec3
}

export type IslandWorldConfig = {
    id: string
    order: number
    name: string
    title: string
    slug: string
    modelPath: string
    accentColor: string
    status: IslandStatus
    position: Vec3
    rotation: Vec3
    scale: number
    reward: IslandReward
    lessons: IslandLessonConfig[]
}

export const islandWorldConfig = [
    {
        id: "island-01-power",
        order: 1,
        name: "Power Island",
        title: "Kapalı Devre Adası",
        slug: "power",
        modelPath: "/models/islands/island-01-power__static.glb",
        accentColor: "#00aaff",
        status: "available",
        position: [0, 0, 0],
        rotation: [0, 0.35, 0],
        scale: 1,
        reward: {
            id: "bulb-tool",
            name: "Bulb Tool",
            displayName: "Ampul Aracı",
            description: "Devre tamamlandığında ışık üretir.",
        },
        lessons: [
            {
                id: "power-lesson-01",
                title: "Ampulü Keşfet",
                description: "Ampulün elektrik gelmeden yanmadığını gözlemle.",
                route: "/circuit?island=power&lesson=1",
                status: "available",
                nodePosition: [-1.85, 0.3, 2.05],
            },
            {
                id: "power-lesson-02",
                title: "Kapalı Devreyi Kur",
                description: "Elektriğin akması için tam bir yol oluştur.",
                route: "/circuit?island=power&lesson=2",
                status: "locked",
                nodePosition: [-0.45, 0.3, 1.95],
            },
            {
                id: "power-lesson-03",
                title: "Ampul Totemini Yak",
                description: "Devre tamamlanınca ampulü ve adayı aydınlat.",
                route: "/circuit?island=power&lesson=3",
                status: "locked",
                nodePosition: [1.05, 0.3, 1.45],
            },
        ],
    },
    // {
    //     id: "island-02-switch",
    //     order: 2,
    //     name: "Switch Island",
    //     title: "Anahtar Adası",
    //     slug: "switch",
    //     modelPath: "/models/islands/island-02-switch__static.glb",
    //     accentColor: "#ff9f1c",
    //     status: "locked",
    //     position: [3.2, 0, -1.2],
    //     rotation: [0, -0.25, 0],
    //     scale: 0.95,
    //     reward: {
    //         id: "switch-tool",
    //         name: "Switch Tool",
    //         displayName: "Anahtar Aracı",
    //         description: "Elektriğin yolunu açıp kapatmanı sağlar.",
    //     },
    //     lessons: [
    //         {
    //             id: "switch-lesson-01",
    //             title: "Anahtarı Keşfet",
    //             description: "Anahtarın ON ve OFF durumlarını gözlemle.",
    //             route: "/circuit?island=switch&lesson=1",
    //             status: "locked",
    //         },
    //         {
    //             id: "switch-lesson-02",
    //             title: "Anahtarlı Devre Kur",
    //             description: "Anahtarı devrenin yoluna yerleştir.",
    //             route: "/circuit?island=switch&lesson=2",
    //             status: "locked",
    //         },
    //         {
    //             id: "switch-lesson-03",
    //             title: "Control Gate’i Aç",
    //             description: "Anahtarı kullanarak adadaki kapıya enerji ver.",
    //             route: "/circuit?island=switch&lesson=3",
    //             status: "locked",
    //         },
    //     ],
    // },
    // {
    //     id: "island-03-fault",
    //     order: 3,
    //     name: "Fault Island",
    //     title: "Arıza Adası",
    //     slug: "fault",
    //     modelPath: "/models/islands/island-03-fault__static.glb",
    //     accentColor: "#ff4d6d",
    //     status: "locked",
    //     position: [-3.2, 0, -1.4],
    //     rotation: [0, 0.45, 0],
    //     scale: 0.95,
    //     reward: {
    //         id: "spark-scanner",
    //         name: "Spark Scanner",
    //         displayName: "Kıvılcım Tarayıcı",
    //         description: "Eksik veya hatalı bağlantıları bulmana yardım eder.",
    //     },
    //     lessons: [
    //         {
    //             id: "fault-lesson-01",
    //             title: "Bozuk Devreyi Gör",
    //             description: "Devrenin neden çalışmadığını gözlemle.",
    //             route: "/circuit?island=fault&lesson=1",
    //             status: "locked",
    //         },
    //         {
    //             id: "fault-lesson-02",
    //             title: "Eksik Yolu Bul",
    //             description: "Elektriğin geri dönemediği noktayı bul.",
    //             route: "/circuit?island=fault&lesson=2",
    //             status: "locked",
    //         },
    //         {
    //             id: "fault-lesson-03",
    //             title: "Sistemi Onar",
    //             description: "Hatalı bağlantıyı düzelt ve adayı tekrar çalıştır.",
    //             route: "/circuit?island=fault&lesson=3",
    //             status: "locked",
    //         },
    //     ],
    // },
    // {
    //     id: "island-04-power-pack",
    //     order: 4,
    //     name: "Power Pack Island",
    //     title: "Gelişmiş Pil Adası",
    //     slug: "power-pack",
    //     modelPath: "/models/islands/island-04-power-pack__static.glb",
    //     accentColor: "#ffd166",
    //     status: "locked",
    //     position: [1.8, 0, -3.8],
    //     rotation: [0, -0.55, 0],
    //     scale: 1,
    //     reward: {
    //         id: "power-pack",
    //         name: "Power Pack",
    //         displayName: "Power Pack",
    //         description: "Daha büyük deneyler için ekstra bağlantı noktaları sağlar.",
    //     },
    //     lessons: [
    //         {
    //             id: "power-pack-lesson-01",
    //             title: "Büyük Devreyi Tanı",
    //             description: "Birden fazla ampulün aynı devrede nasıl çalışacağını gör.",
    //             route: "/circuit?island=power-pack&lesson=1",
    //             status: "locked",
    //         },
    //         {
    //             id: "power-pack-lesson-02",
    //             title: "Seri Devre Kur",
    //             description: "Ampulleri tek yol üzerinde sırayla bağla.",
    //             route: "/circuit?island=power-pack&lesson=2",
    //             status: "locked",
    //         },
    //         {
    //             id: "power-pack-lesson-03",
    //             title: "Power Pack’i Aktive Et",
    //             description: "Büyük devreyi tamamla ve gelişmiş pili kazan.",
    //             route: "/circuit?island=power-pack&lesson=3",
    //             status: "locked",
    //         },
    //     ],
    // },
    // {
    //     id: "island-05-branch",
    //     order: 5,
    //     name: "Branch Island",
    //     title: "Dallanma Adası",
    //     slug: "branch",
    //     modelPath: "/models/islands/island-05-branch__static.glb",
    //     accentColor: "#8b5cf6",
    //     status: "locked",
    //     position: [-1.8, 0, -3.8],
    //     rotation: [0, 0.6, 0],
    //     scale: 1,
    //     reward: {
    //         id: "branch-node",
    //         name: "Branch Node",
    //         displayName: "Dallanma Düğümü",
    //         description: "Elektriğin iki farklı yola ayrılmasını sağlar.",
    //     },
    //     lessons: [
    //         {
    //             id: "branch-lesson-01",
    //             title: "Dallanmayı Keşfet",
    //             description: "Elektriğin birden fazla yoldan gidebileceğini öğren.",
    //             route: "/circuit?island=branch&lesson=1",
    //             status: "locked",
    //         },
    //         {
    //             id: "branch-lesson-02",
    //             title: "Paralel Devre Kur",
    //             description: "Enerjiyi iki farklı kola ayır.",
    //             route: "/circuit?island=branch&lesson=2",
    //             status: "locked",
    //         },
    //         {
    //             id: "branch-lesson-03",
    //             title: "İki Bölgeyi Aydınlat",
    //             description: "Sol ve sağ enerji yollarını aynı anda çalıştır.",
    //             route: "/circuit?island=branch&lesson=3",
    //             status: "locked",
    //         },
    //     ],
    // },
] satisfies IslandWorldConfig[]

export const POWER_ISLAND_CONFIG = islandWorldConfig[0]

export function getIslandBySlug(slug: string) {
    return islandWorldConfig.find((island) => island.slug === slug)
}
