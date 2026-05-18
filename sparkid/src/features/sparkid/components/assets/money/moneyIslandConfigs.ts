export type MoneyIslandStatus = "available" | "locked"

export type MoneyIslandConfig = {
    id: string
    order: number
    name: string
    title: string
    slug: string
    status: MoneyIslandStatus
    reward: string
}

export const moneyIslandConfigs: MoneyIslandConfig[] = [
    {
        id: "money-island-01-need-want",
        order: 1,
        name: "Need or Want Island",
        title: "İhtiyaç mı, İstek mi?",
        slug: "need-want",
        status: "available",
        reward: "Choice Lens",
    },
    {
        id: "money-island-02-budget",
        order: 2,
        name: "Budget Island",
        title: "Bütçe Adası",
        slug: "budget",
        status: "locked",
        reward: "Budget Planner",
    },
    {
        id: "money-island-03-savings",
        order: 3,
        name: "Savings Island",
        title: "Birikim Adası",
        slug: "savings",
        status: "locked",
        reward: "Savings Jar",
    },
    {
        id: "money-island-04-smart-shopping",
        order: 4,
        name: "Smart Shopping Island",
        title: "Akıllı Sepet Adası",
        slug: "smart-shopping",
        status: "locked",
        reward: "Smart Cart",
    },
    {
        id: "money-island-05-money-master",
        order: 5,
        name: "Money Master Island",
        title: "Money Master Adası",
        slug: "money-master",
        status: "locked",
        reward: "Money Master Badge",
    },
]
