import { notFound } from "next/navigation"

import { getMoneyIslandBySlug } from "@/features/sparkid/components/assets/money/moneyIslandConfigs"
import MoneyIslandDetailExperience from "@/features/sparkid/components/money-levels/MoneyIslandDetailExperience"

type MoneyIslandPageProps = {
    params: Promise<{
        moneyIslandSlug: string
    }>
}

export default async function MoneyIslandPage({
    params,
}: MoneyIslandPageProps) {
    const { moneyIslandSlug } = await params
    const island = getMoneyIslandBySlug(moneyIslandSlug)

    if (!island || island.status === "locked") {
        notFound()
    }

    return <MoneyIslandDetailExperience slug={moneyIslandSlug} />
}
