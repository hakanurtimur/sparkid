import {PluggerPortType} from "@/features/sparkid/components/circuit-lab/SparkidPlugger";


export type Vec3 = [number, number, number]

export const PLUGGER_VISUAL_BASE_SCALE = 0.34

// SparkidPlugger içindeki gerçek görünen bağlantı ağzı.
// Socket deliği / plug ucu bu eksende önde duruyor.
export const PLUGGER_LOCAL_CONTACT_POINT: Vec3 = [0, 0, 0.74]

// Plug socket içine biraz giriyormuş gibi dursun.
export const PLUGGER_INSERTION_DEPTH = 0.08

export function getPluggerVisualScale(scale = 1) {
    return scale * PLUGGER_VISUAL_BASE_SCALE
}

export function getPluggerContactOffset(scale = 1): Vec3 {
    const visualScale = getPluggerVisualScale(scale)

    return [
        PLUGGER_LOCAL_CONTACT_POINT[0] * visualScale,
        PLUGGER_LOCAL_CONTACT_POINT[1] * visualScale,
        PLUGGER_LOCAL_CONTACT_POINT[2] * visualScale,
    ]
}

export function getPluggerInsertionOffset({
                                              scale = 1,
                                              type,
                                          }: {
    scale?: number
    type: PluggerPortType
}): Vec3 {
    const visualScale = getPluggerVisualScale(scale)

    const insertion =
        type === "plug"
            ? PLUGGER_INSERTION_DEPTH * visualScale
            : PLUGGER_INSERTION_DEPTH * 0.55 * visualScale

    return [
        PLUGGER_LOCAL_CONTACT_POINT[0] * visualScale,
        PLUGGER_LOCAL_CONTACT_POINT[1] * visualScale,
        PLUGGER_LOCAL_CONTACT_POINT[2] * visualScale - insertion,
    ]
}