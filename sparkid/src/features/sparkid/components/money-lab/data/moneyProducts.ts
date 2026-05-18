export type MoneyCategory = "need" | "want"

export type MoneyProduct = {
    id: string
    displayName: string
    emoji: string
    correctCategory: MoneyCategory
    shortExplanation: string
}

export const moneyProducts: MoneyProduct[] = [
    {
        id: "water",
        displayName: "Su",
        emoji: "💧",
        correctCategory: "need",
        shortExplanation: "Su günlük yaşam için temel bir ihtiyaçtır.",
    },
    {
        id: "notebook",
        displayName: "Defter",
        emoji: "📘",
        correctCategory: "need",
        shortExplanation: "Defter okulda ders çalışmak için gereklidir.",
    },
    {
        id: "lunch",
        displayName: "Öğle Yemeği",
        emoji: "🍽️",
        correctCategory: "need",
        shortExplanation:
            "Öğle yemeği sağlıklı kalmak ve gün içinde enerji almak için ihtiyaçtır.",
    },
    {
        id: "toy",
        displayName: "Oyuncak",
        emoji: "🧸",
        correctCategory: "want",
        shortExplanation: "Oyuncak eğlencelidir ama zorunlu değildir.",
    },
    {
        id: "game-skin",
        displayName: "Oyun İçi Kostüm",
        emoji: "🎮",
        correctCategory: "want",
        shortExplanation:
            "Oyun içi kostüm güzel olabilir ama temel ihtiyaç değildir.",
    },
    {
        id: "headphones",
        displayName: "Kulaklık",
        emoji: "🎧",
        correctCategory: "want",
        shortExplanation:
            "Kulaklık bazı durumlarda faydalı olabilir ama bu görevde istek olarak değerlendirilir.",
    },
]
