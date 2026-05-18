import { notFound } from "next/navigation"

import { getIslandBySlug } from "@/features/sparkid/components/assets/island/islandConfigs"
import IslandDetailExperience from "@/features/sparkid/components/levels/IslandDetailExperience"

type IslandPageProps = {
    params: Promise<{
        islandSlug: string
    }>
}

export default async function IslandPage({ params }: IslandPageProps) {
    const { islandSlug } = await params
    const island = getIslandBySlug(islandSlug)

    if (!island || island.status === "locked") {
        notFound()
    }

    return <IslandDetailExperience slug={islandSlug} />
}
