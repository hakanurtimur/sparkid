"use client"

const ICON_Z = 0.37
const LINE_RADIUS = 0.018
const NODE_RADIUS = 0.048
const SMALL_NODE_RADIUS = 0.028

function IconMaterial() {
    return <meshBasicMaterial color="#ffffff" toneMapped={false} />
}

function IconRoot({ children }: { children: React.ReactNode }) {
    return <group position={[0, 0.035, ICON_Z]}>{children}</group>
}

function IconNode({
                      position,
                      radius = NODE_RADIUS,
                  }: {
    position: [number, number, number]
    radius?: number
}) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[radius, 18, 12]} />
            <IconMaterial />
        </mesh>
    )
}

function IconLine({
                      position,
                      length,
                      rotation = [0, 0, 0],
                  }: {
    position: [number, number, number]
    length: number
    rotation?: [number, number, number]
}) {
    return (
        <mesh position={position} rotation={rotation}>
            <capsuleGeometry args={[LINE_RADIUS, length, 8, 18]} />
            <IconMaterial />
        </mesh>
    )
}

function IconDiamond({
                         position = [0, 0, 0],
                         size = 0.19,
                     }: {
    position?: [number, number, number]
    size?: number
}) {
    const half = size * 0.5

    return (
        <group position={position}>
            <IconLine
                position={[-half * 0.5, half * 0.5, 0]}
                length={size * 0.72}
                rotation={[0, 0, -Math.PI / 4]}
            />
            <IconLine
                position={[half * 0.5, half * 0.5, 0]}
                length={size * 0.72}
                rotation={[0, 0, Math.PI / 4]}
            />
            <IconLine
                position={[-half * 0.5, -half * 0.5, 0]}
                length={size * 0.72}
                rotation={[0, 0, Math.PI / 4]}
            />
            <IconLine
                position={[half * 0.5, -half * 0.5, 0]}
                length={size * 0.72}
                rotation={[0, 0, -Math.PI / 4]}
            />
        </group>
    )
}

export function WarningIcon() {
    return (
        <IconRoot>
            {/* dış diamond */}
            <IconDiamond size={0.36} />

            {/* iç ünlem */}
            <IconLine position={[0, 0.03, 0.01]} length={0.14} />
            <IconNode position={[0, -0.11, 0.01]} radius={SMALL_NODE_RADIUS} />
        </IconRoot>
    )
}

export function SeriesCircuitIcon() {
    return (
        <IconRoot>
            {/* ana yatay bağlantı */}
            <IconLine
                position={[0, 0, 0]}
                length={0.34}
                rotation={[0, 0, Math.PI / 2]}
            />

            {/* 3 seri node */}
            <IconNode position={[-0.18, 0, 0]} />
            <IconNode position={[0, 0, 0]} />
            <IconNode position={[0.18, 0, 0]} />

            {/* merkezde küçük enerji tick */}
            <IconLine position={[0, 0.11, 0.01]} length={0.06} />
        </IconRoot>
    )
}

export function ParallelCircuitIcon() {
    return (
        <IconRoot>
            {/* sol ve sağ rail */}
            <IconLine position={[-0.18, 0, 0]} length={0.28} />
            <IconLine position={[0.18, 0, 0]} length={0.28} />

            {/* 3 paralel kol */}
            <IconLine
                position={[0, 0.11, 0]}
                length={0.24}
                rotation={[0, 0, Math.PI / 2]}
            />
            <IconLine
                position={[0, 0, 0]}
                length={0.24}
                rotation={[0, 0, Math.PI / 2]}
            />
            <IconLine
                position={[0, -0.11, 0]}
                length={0.24}
                rotation={[0, 0, Math.PI / 2]}
            />

            {/* orta iki node */}
            <IconNode position={[-0.04, 0, 0.01]} radius={SMALL_NODE_RADIUS} />
            <IconNode position={[0.04, 0, 0.01]} radius={SMALL_NODE_RADIUS} />
        </IconRoot>
    )
}

export function FreePlayIcon() {
    return (
        <IconRoot>
            {/* merkez node */}
            <IconNode position={[0, 0.01, 0]} radius={0.052} />

            {/* 3 özgür kol */}
            <IconLine
                position={[-0.1, 0.11, 0]}
                length={0.14}
                rotation={[0, 0, -0.72]}
            />
            <IconLine
                position={[0.1, 0.11, 0]}
                length={0.14}
                rotation={[0, 0, 0.72]}
            />
            <IconLine
                position={[0, -0.12, 0]}
                length={0.14}
                rotation={[0, 0, 0]}
            />

            {/* uç node'lar */}
            <IconNode position={[-0.16, 0.17, 0.01]} radius={SMALL_NODE_RADIUS} />
            <IconNode position={[0.16, 0.17, 0.01]} radius={SMALL_NODE_RADIUS} />
            <IconNode position={[0, -0.22, 0.01]} radius={SMALL_NODE_RADIUS} />
        </IconRoot>
    )
}
