import CircuitLabExperience from "@/features/sparkid/components/circuit-lab/CircuitLabExperience"
import { getFaultIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/faultIslandLevelConfigs"
import { getFreeLabIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/freeLabIslandLevelConfigs"
import { getParallelIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/parallelIslandLevelConfigs"
import { getPowerIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/powerIslandLevelConfigs"
import { getSeriesIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/seriesIslandLevelConfigs"
import { getSwitchIslandCircuitLevelConfig } from "@/features/sparkid/components/circuit-lab/data/switchIslandLevelConfigs"

type CircuitPageProps = {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function CircuitPage({ searchParams }: CircuitPageProps) {
    const params = await searchParams
    const island = Array.isArray(params?.island)
        ? params?.island[0]
        : params?.island
    const levelConfig =
        island === "power"
            ? getPowerIslandCircuitLevelConfig(params?.lesson)
            : island === "switch"
                ? getSwitchIslandCircuitLevelConfig(params?.lesson)
                : island === "fault"
                    ? getFaultIslandCircuitLevelConfig(params?.lesson)
                    : island === "series"
                        ? getSeriesIslandCircuitLevelConfig(params?.lesson)
                        : island === "parallel"
                            ? getParallelIslandCircuitLevelConfig(params?.lesson)
                            : island === "free-lab"
                                ? getFreeLabIslandCircuitLevelConfig(params?.lesson)
                                : undefined

    return (
        <CircuitLabExperience
            key={levelConfig?.id ?? "default-circuit-lab"}
            levelConfig={levelConfig}
        />
    )
}
