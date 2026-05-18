"use client"

import * as THREE from "three"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import type { CableShape } from "./SparkidCable"
import CircuitPort from "@/features/sparkid/components/circuit-lab/CircuitPort"
import {
    useCircuitConnections,
    type CircuitPortData,
    type CircuitPortKind,
} from "@/features/sparkid/components/circuit-lab/CircuitConnectionContext"

type Vec3 = [number, number, number]
type CableConnectorType = "plug" | "socket"

type DragTarget = "start" | "end" | null

type StretchableSparkidCableProps = {
    id?: string
    shape?: CableShape
    active?: boolean
    position?: Vec3
    scale?: number
    radius?: number
    color?: string
    energyColor?: string
    startConnector?: CableConnectorType
    endConnector?: CableConnectorType
    editable?: boolean
    snapping?: boolean
    snapDistance?: number
    minLength?: number
    maxLength?: number
}

const COLORS = {
    blue: "#2563EB",
    blueDark: "#174EA6",
    gold: "#F2B430",
    goldDark: "#A45A12",
    black: "#1F2937",
    energy: "#FFD84D",
}

const CONNECTOR_VISUAL_SCALE = 0.72

const CONNECTOR_TIP_DISTANCE: Record<CableConnectorType, number> = {
    plug: 0.72,
    socket: 0.62,
}

const CONNECTOR_INSERT_DEPTH: Record<CableConnectorType, number> = {
    plug: 0.11,
    socket: 0.06,
}

const CONNECTOR_CABLE_EXIT_PADDING: Record<CableConnectorType, number> = {
    plug: 0.14,
    socket: 0.12,
}

function getConnectorRenderDirection({
                                         connectedPort,
                                         fallbackDirection,
                                     }: {
    connectedPort?: CircuitPortData
    fallbackDirection: THREE.Vector3
}) {
    if (connectedPort) {
        return connectedPort.worldNormal
            .clone()
            .multiplyScalar(-1)
            .normalize()
    }

    return fallbackDirection.clone().normalize()
}

function getConnectorCableAnchor({
                                     endpoint,
                                     direction,
                                     connectorType,
                                 }: {
    endpoint: THREE.Vector3
    direction: THREE.Vector3
    connectorType: CableConnectorType
}) {
    const safeDirection = direction.clone().normalize()

    if (safeDirection.lengthSq() === 0) {
        safeDirection.set(1, 0, 0)
    }

    const anchorDistance =
        (
            CONNECTOR_TIP_DISTANCE[connectorType] -
            CONNECTOR_INSERT_DEPTH[connectorType] +
            CONNECTOR_CABLE_EXIT_PADDING[connectorType]
        ) * CONNECTOR_VISUAL_SCALE

    return endpoint
        .clone()
        .sub(safeDirection.multiplyScalar(anchorDistance))
}

function getDefaultEndpoints(shape: CableShape): { start: Vec3; end: Vec3 } {
    if (shape === "straight") {
        return { start: [-1.25, 0, 0], end: [1.25, 0, 0] }
    }

    if (shape === "u") {
        return { start: [-0.85, -0.45, 0], end: [0.85, -0.45, 0] }
    }

    if (shape === "s") {
        return { start: [-1.2, -0.25, 0], end: [1.2, -0.25, 0] }
    }

    if (shape === "loop") {
        return { start: [-0.72, -0.55, 0], end: [0.72, -0.55, 0] }
    }

    if (shape === "wavy") {
        return { start: [-1.35, 0, 0], end: [1.35, 0, 0] }
    }

    if (shape === "spiral") {
        return { start: [0, -0.95, 0], end: [0, 0.95, 0] }
    }

    if (shape === "turn90") {
        return { start: [-0.8, -0.65, 0], end: [0.8, 0.15, 0] }
    }

    if (shape === "z") {
        return { start: [-1.1, 0.45, 0], end: [1.1, -0.45, 0] }
    }

    return { start: [-1.25, -0.1, 0], end: [1.25, -0.1, 0] }
}

function buildCablePoints(
    shape: CableShape,
    start: THREE.Vector3,
    end: THREE.Vector3,
    minLength: number,
    maxLength: number
) {
    const distance = start.distanceTo(end)
    const direction = end.clone().sub(start).normalize()

    if (direction.lengthSq() === 0) {
        direction.set(1, 0, 0)
    }

    const perpendicular = new THREE.Vector3(
        -direction.y,
        direction.x,
        0
    ).normalize()

    const mid = start.clone().lerp(end, 0.5)

    const stretch = THREE.MathUtils.clamp(
        (distance - minLength) / (maxLength - minLength),
        0,
        1
    )

    const looseness = 1 - stretch * 0.72

    if (shape === "straight") {
        return [start, end]
    }

    if (shape === "u") {
        const amp = 0.95 * looseness

        return [
            start,
            start.clone().add(perpendicular.clone().multiplyScalar(amp * 0.9)),
            mid.clone().add(perpendicular.clone().multiplyScalar(amp * 1.25)),
            end.clone().add(perpendicular.clone().multiplyScalar(amp * 0.9)),
            end,
        ]
    }

    if (shape === "s") {
        const amp = 0.62 * looseness

        return [
            start,
            start.clone().lerp(end, 0.25).add(perpendicular.clone().multiplyScalar(amp)),
            start.clone().lerp(end, 0.5).add(perpendicular.clone().multiplyScalar(-amp)),
            start.clone().lerp(end, 0.75).add(perpendicular.clone().multiplyScalar(amp)),
            end,
        ]
    }

    if (shape === "loop") {
        const amp = 1.05 * looseness

        return [
            start,
            start.clone().add(perpendicular.clone().multiplyScalar(amp * 0.75)),
            mid.clone().add(perpendicular.clone().multiplyScalar(amp * 1.15)),
            end.clone().add(perpendicular.clone().multiplyScalar(amp * 0.75)),
            end,
        ]
    }

    if (shape === "wavy") {
        const amp = 0.42 * looseness

        return [
            start,
            start.clone().lerp(end, 0.18).add(perpendicular.clone().multiplyScalar(amp)),
            start.clone().lerp(end, 0.36).add(perpendicular.clone().multiplyScalar(-amp)),
            start.clone().lerp(end, 0.54).add(perpendicular.clone().multiplyScalar(amp)),
            start.clone().lerp(end, 0.72).add(perpendicular.clone().multiplyScalar(-amp)),
            start.clone().lerp(end, 0.9).add(perpendicular.clone().multiplyScalar(amp)),
            end,
        ]
    }

    if (shape === "spiral") {
        const points: THREE.Vector3[] = []

        for (let i = 0; i <= 42; i++) {
            const t = i / 42
            const base = start.clone().lerp(end, t)
            const angle = t * Math.PI * 6.2
            const coilRadius = 0.32 * looseness

            base.add(perpendicular.clone().multiplyScalar(Math.sin(angle) * coilRadius))
            base.z += Math.cos(angle) * coilRadius * 0.42

            points.push(base)
        }

        return points
    }

    if (shape === "turn90") {
        const corner = new THREE.Vector3(start.x, end.y, 0)

        return [
            start,
            start.clone().lerp(corner, 0.5),
            corner,
            corner.clone().lerp(end, 0.5),
            end,
        ]
    }

    if (shape === "z") {
        const amp = 0.3 * looseness

        return [
            start,
            start.clone().lerp(end, 0.32).add(perpendicular.clone().multiplyScalar(amp)),
            start.clone().lerp(end, 0.68).add(perpendicular.clone().multiplyScalar(-amp)),
            end,
        ]
    }

    const amp = 0.45 * looseness

    return [start, mid.clone().add(perpendicular.clone().multiplyScalar(amp)), end]
}

function Connector({
                       position,
                       direction,
                       type,
                       color,
                   }: {
    position: THREE.Vector3
    direction: THREE.Vector3
    type: CableConnectorType
    color: string
}) {
    const directionX = direction.x
    const directionY = direction.y
    const directionZ = direction.z

    const quaternion = useMemo(() => {
        const from = new THREE.Vector3(0, 1, 0)
        const to = new THREE.Vector3(directionX, directionY, directionZ).normalize()

        if (to.lengthSq() === 0) {
            to.set(1, 0, 0)
        }

        return new THREE.Quaternion().setFromUnitVectors(from, to)
    }, [directionX, directionY, directionZ])

    const visualPosition = useMemo(() => {
        const safeDirection = new THREE.Vector3(
            directionX,
            directionY,
            directionZ,
        ).normalize()

        if (safeDirection.lengthSq() === 0) {
            safeDirection.set(1, 0, 0)
        }

        const tipDistance = CONNECTOR_TIP_DISTANCE[type]
        const insertDepth = CONNECTOR_INSERT_DEPTH[type]

        return position
            .clone()
            .sub(
                safeDirection.multiplyScalar(
                    (tipDistance - insertDepth) * CONNECTOR_VISUAL_SCALE
                )
            )
    }, [position, directionX, directionY, directionZ, type])

    return (
        <group
            position={visualPosition}
            quaternion={quaternion}
            scale={CONNECTOR_VISUAL_SCALE}
        >
            <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.18, 0.15, 0.24, 48]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.34}
                    metalness={0.12}
                />
            </mesh>

            <mesh castShadow receiveShadow position={[0, -0.03, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.055, 48]} />
                <meshStandardMaterial
                    color={COLORS.blueDark}
                    roughness={0.38}
                    metalness={0.1}
                />
            </mesh>

            <mesh castShadow receiveShadow position={[0, 0.27, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.14, 64]} />
                <meshStandardMaterial
                    color={COLORS.gold}
                    roughness={0.22}
                    metalness={0.72}
                />
            </mesh>

            <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.18, 0.022, 16, 64]} />
                <meshStandardMaterial
                    color={COLORS.goldDark}
                    roughness={0.25}
                    metalness={0.68}
                />
            </mesh>

            <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.18, 0.022, 16, 64]} />
                <meshStandardMaterial
                    color={COLORS.goldDark}
                    roughness={0.25}
                    metalness={0.68}
                />
            </mesh>

            {type === "plug" ? (
                <>
                    <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
                        <cylinderGeometry args={[0.075, 0.095, 0.28, 48]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>

                    <mesh castShadow receiveShadow position={[0, 0.66, 0]}>
                        <sphereGeometry args={[0.076, 32, 16]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>
                </>
            ) : (
                <>
                    <mesh castShadow receiveShadow position={[0, 0.49, 0]}>
                        <cylinderGeometry args={[0.145, 0.17, 0.23, 48]} />
                        <meshStandardMaterial
                            color={COLORS.gold}
                            roughness={0.18}
                            metalness={0.82}
                        />
                    </mesh>

                    <mesh position={[0, 0.615, 0]}>
                        <cylinderGeometry args={[0.078, 0.078, 0.018, 32]} />
                        <meshStandardMaterial
                            color={COLORS.black}
                            roughness={0.38}
                            metalness={0.2}
                        />
                    </mesh>
                </>
            )}
        </group>
    )
}

function DragHandle({
                        position,
                        active,
                        onPointerDown,
                    }: {
    position: THREE.Vector3
    active: boolean
    onPointerDown: (event: ThreeEvent<PointerEvent>) => void
}) {
    return (
        <group position={position} onPointerDown={onPointerDown}>
            <mesh>
                <sphereGeometry args={[0.24, 24, 12]} />
                <meshBasicMaterial
                    color={active ? "#FFD84D" : "#ffffff"}
                    transparent
                    opacity={0.1}
                    depthWrite={false}
                />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.24, 0.012, 12, 48]} />
                <meshBasicMaterial
                    color={active ? "#FFD84D" : "#2563EB"}
                    transparent
                    opacity={active ? 0.95 : 0.55}
                />
            </mesh>
        </group>
    )
}

function EnergyFlow({
                        curve,
                        radius,
                        color,
                    }: {
    curve: THREE.CatmullRomCurve3
    radius: number
    color: string
}) {
    const particleRefs = useRef<THREE.Mesh[]>([])
    const particleCount = 13

    useFrame((state) => {
        const t = state.clock.elapsedTime

        for (let i = 0; i < particleCount; i++) {
            const mesh = particleRefs.current[i]
            if (!mesh) continue

            const progress = (t * 0.45 + i / particleCount) % 1
            const point = curve.getPointAt(progress)

            mesh.position.set(point.x, point.y, point.z + radius * 1.5)

            const pulse = 0.75 + Math.sin(t * 8 + i) * 0.22
            mesh.scale.setScalar(pulse)
        }
    })

    return (
        <group>
            {Array.from({ length: particleCount }).map((_, index) => (
                <mesh
                    key={index}
                    ref={(mesh) => {
                        if (mesh) particleRefs.current[index] = mesh
                    }}
                >
                    <sphereGeometry args={[radius * 0.3, 16, 8]} />
                    <meshBasicMaterial color={color} transparent opacity={0.95} />
                </mesh>
            ))}
        </group>
    )
}

export default function StretchableSparkidCable({
                                                    id = "cable-1",
                                                    shape = "curved",
                                                    active = false,
                                                    position = [0, 0, 0],
                                                    scale = 1,
                                                    radius = 0.09,
                                                    color = COLORS.blue,
                                                    energyColor = COLORS.energy,
                                                    startConnector = "plug",
                                                    endConnector = "plug",
                                                    editable = true,
                                                    snapping = true,
                                                    snapDistance = 0.34,
                                                    minLength = 1.15,
                                                    maxLength = 3.3,
                                                }: StretchableSparkidCableProps) {
    const camera = useThree((state) => state.camera)
    const canvasElement = useThree((state) => state.gl.domElement)

    const {
        findNearestPort,
        connectPorts,
        disconnectPort,
        getConnectedPortId,
        getPort,
    } = useCircuitConnections()

    const rootRef = useRef<THREE.Group>(null)
    const draggingRef = useRef<DragTarget>(null)

    const [draggingTarget, setDraggingTarget] = useState<DragTarget>(null)

    const raycasterRef = useRef(new THREE.Raycaster())
    const pointerRef = useRef(new THREE.Vector2())
    const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0))

    const startPortKind: CircuitPortKind =
        startConnector === "plug" ? "plug" : "socket"

    const endPortKind: CircuitPortKind =
        endConnector === "plug" ? "plug" : "socket"

    const preset = useMemo(() => getDefaultEndpoints(shape), [shape])

    const [start, setStart] = useState<Vec3>(preset.start)
    const [end, setEnd] = useState<Vec3>(preset.end)

    const startRef = useRef(new THREE.Vector3(...preset.start))
    const endRef = useRef(new THREE.Vector3(...preset.end))
    const lastVisualCommitRef = useRef(0)

    const previousIdentityRef = useRef({
        id,
        shape,
    })

    useEffect(() => {
        const idChanged = previousIdentityRef.current.id !== id
        const shapeChanged = previousIdentityRef.current.shape !== shape

        if (!idChanged && !shapeChanged) return

        previousIdentityRef.current = {
            id,
            shape,
        }

        setStart(preset.start)
        setEnd(preset.end)

        startRef.current.set(...preset.start)
        endRef.current.set(...preset.end)

        disconnectPort(`${id}:start`)
        disconnectPort(`${id}:end`)
    }, [id, shape, preset.start, preset.end, disconnectPort])

    useEffect(() => {
        startRef.current.set(...start)
    }, [start])

    useEffect(() => {
        endRef.current.set(...end)
    }, [end])

    useEffect(() => {
        const commitEndpointState = (
            target: Exclude<DragTarget, null>,
            next: THREE.Vector3,
            force = false
        ) => {
            const now = performance.now()

            if (!force && now - lastVisualCommitRef.current < 32) {
                return
            }

            lastVisualCommitRef.current = now

            if (target === "start") {
                setStart([next.x, next.y, next.z])
                return
            }

            setEnd([next.x, next.y, next.z])
        }

        const clampPoint = (next: THREE.Vector3, fixed: THREE.Vector3) => {
            const delta = next.clone().sub(fixed)
            const distance = delta.length()

            if (distance < 0.001) {
                return fixed.clone().add(new THREE.Vector3(minLength, 0, 0))
            }

            if (distance > maxLength) {
                return fixed.clone().add(delta.normalize().multiplyScalar(maxLength))
            }

            if (distance < minLength) {
                return fixed.clone().add(delta.normalize().multiplyScalar(minLength))
            }

            return next
        }

        const snapEndpointToNearestPort = (target: Exclude<DragTarget, null>) => {
            if (!snapping || !rootRef.current) return

            const endpointLocal =
                target === "start" ? startRef.current : endRef.current

            const endpointWorld = rootRef.current.localToWorld(endpointLocal.clone())

            const movingKind = target === "start" ? startPortKind : endPortKind

            const nearestPort = findNearestPort(endpointWorld, {
                maxDistance: snapDistance,
                movingKind,
                excludeIds: [`${id}:start`, `${id}:end`],
            })

            if (!nearestPort) return

            const snappedLocal = rootRef.current.worldToLocal(
                nearestPort.worldPosition.clone()
            )

            if (target === "start") {
                startRef.current.copy(snappedLocal)
                commitEndpointState("start", snappedLocal, true)
            }

            if (target === "end") {
                endRef.current.copy(snappedLocal)
                commitEndpointState("end", snappedLocal, true)
            }

            connectPorts(`${id}:${target}`, nearestPort.id)
        }

        const handleMove = (event: PointerEvent) => {
            if (!editable || !draggingRef.current || !rootRef.current) return

            const rect = canvasElement.getBoundingClientRect()

            pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

            raycasterRef.current.setFromCamera(pointerRef.current, camera)

            const localOrigin = new THREE.Vector3(0, 0, 0)
            const worldOrigin = rootRef.current.localToWorld(localOrigin)

            planeRef.current.constant = -worldOrigin.z

            const worldHit = new THREE.Vector3()
            const didHit = raycasterRef.current.ray.intersectPlane(
                planeRef.current,
                worldHit
            )

            if (!didHit) return

            const localHit = rootRef.current.worldToLocal(worldHit.clone())

            if (draggingRef.current === "start") {
                const next = clampPoint(localHit, endRef.current)

                startRef.current.copy(next)
                commitEndpointState("start", next)
            }

            if (draggingRef.current === "end") {
                const next = clampPoint(localHit, startRef.current)

                endRef.current.copy(next)
                commitEndpointState("end", next)
            }
        }

        const handleUp = () => {
            const droppedTarget = draggingRef.current

            if (droppedTarget) {
                snapEndpointToNearestPort(droppedTarget)

                const finalPoint =
                    droppedTarget === "start" ? startRef.current : endRef.current

                commitEndpointState(droppedTarget, finalPoint, true)
            }

            draggingRef.current = null
            setDraggingTarget(null)
        }

        window.addEventListener("pointermove", handleMove)
        window.addEventListener("pointerup", handleUp)
        window.addEventListener("pointercancel", handleUp)

        return () => {
            window.removeEventListener("pointermove", handleMove)
            window.removeEventListener("pointerup", handleUp)
            window.removeEventListener("pointercancel", handleUp)
        }
    }, [
        camera,
        connectPorts,
        editable,
        endPortKind,
        findNearestPort,
        canvasElement,
        id,
        maxLength,
        minLength,
        snapDistance,
        snapping,
        startPortKind,
    ])

    useFrame(() => {
        if (!rootRef.current) return
        if (draggingRef.current) return

        const startConnectedId = getConnectedPortId(`${id}:start`)
        const endConnectedId = getConnectedPortId(`${id}:end`)

        if (startConnectedId) {
            const port = getPort(startConnectedId)

            if (port) {
                const local = rootRef.current.worldToLocal(
                    port.worldPosition.clone()
                )

                if (local.distanceToSquared(startRef.current) > 0.000001) {
                    startRef.current.copy(local)
                    setStart([local.x, local.y, local.z])
                }
            }
        }

        if (endConnectedId) {
            const port = getPort(endConnectedId)

            if (port) {
                const local = rootRef.current.worldToLocal(
                    port.worldPosition.clone()
                )

                if (local.distanceToSquared(endRef.current) > 0.000001) {
                    endRef.current.copy(local)
                    setEnd([local.x, local.y, local.z])
                }
            }
        }
    })

    const startVec = useMemo(() => new THREE.Vector3(...start), [start])
    const endVec = useMemo(() => new THREE.Vector3(...end), [end])

    const basePoints = useMemo(() => {
        return buildCablePoints(shape, startVec, endVec, minLength, maxLength)
    }, [shape, startVec, endVec, minLength, maxLength])

    const baseCurve = useMemo(() => {
        return new THREE.CatmullRomCurve3(basePoints, false, "centripetal", 0.45)
    }, [basePoints])

    const startDirection = useMemo(() => {
        return baseCurve.getTangentAt(0.001).multiplyScalar(-1).normalize()
    }, [baseCurve])

    const endDirection = useMemo(() => {
        return baseCurve.getTangentAt(0.999).normalize()
    }, [baseCurve])

    const startConnectedId = getConnectedPortId(`${id}:start`)
    const endConnectedId = getConnectedPortId(`${id}:end`)

    const startConnectedPort = startConnectedId
        ? getPort(startConnectedId)
        : undefined

    const endConnectedPort = endConnectedId
        ? getPort(endConnectedId)
        : undefined

    const startRenderDirection = useMemo(() => {
        return getConnectorRenderDirection({
            connectedPort: startConnectedPort,
            fallbackDirection: startDirection,
        })
    }, [startConnectedPort, startDirection])

    const endRenderDirection = useMemo(() => {
        return getConnectorRenderDirection({
            connectedPort: endConnectedPort,
            fallbackDirection: endDirection,
        })
    }, [endConnectedPort, endDirection])

    const startCableAnchorVec = useMemo(() => {
        return getConnectorCableAnchor({
            endpoint: startVec,
            direction: startRenderDirection,
            connectorType: startConnector,
        })
    }, [startVec, startRenderDirection, startConnector])

    const endCableAnchorVec = useMemo(() => {
        return getConnectorCableAnchor({
            endpoint: endVec,
            direction: endRenderDirection,
            connectorType: endConnector,
        })
    }, [endVec, endRenderDirection, endConnector])

    const points = useMemo(() => {
        return buildCablePoints(
            shape,
            startCableAnchorVec,
            endCableAnchorVec,
            minLength,
            maxLength
        )
    }, [
        shape,
        startCableAnchorVec,
        endCableAnchorVec,
        minLength,
        maxLength,
    ])

    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.45)
    }, [points])

    const tubeSegments = draggingTarget ? 24 : 72
    const tubeRadialSegments = draggingTarget ? 6 : 12
    const highlightRadialSegments = 8

    const startDragging = (
        target: Exclude<DragTarget, null>,
        event: ThreeEvent<PointerEvent>
    ) => {
        if (!editable) return

        event.stopPropagation()

        draggingRef.current = target
        setDraggingTarget(target)

        disconnectPort(`${id}:${target}`)
    }

    return (
        <group ref={rootRef} position={position} scale={scale}>
            <CircuitPort
                id={`${id}:start`}
                ownerId={id}
                ownerKind="cable"
                kind={startPortKind}
                position={startVec}
                normal={startRenderDirection}
                visible={false}
            />

            <CircuitPort
                id={`${id}:end`}
                ownerId={id}
                ownerKind="cable"
                kind={endPortKind}
                position={endVec}
                normal={endRenderDirection}
                visible={false}
            />

            <mesh>
                <tubeGeometry
                    args={[curve, tubeSegments, radius, tubeRadialSegments, false]}
                />
                <meshStandardMaterial
                    color={color}
                    roughness={0.28}
                    metalness={0.12}
                    emissive={active ? color : "#000000"}
                    emissiveIntensity={active ? 0.14 : 0}
                />
            </mesh>

            {!draggingTarget && (
                <mesh position={[0, 0, radius * 0.9]}>
                    <tubeGeometry
                        args={[
                            curve,
                            tubeSegments,
                            radius * 0.18,
                            highlightRadialSegments,
                            false,
                        ]}
                    />
                    <meshBasicMaterial color="#7bb9ff" transparent opacity={0.4} />
                </mesh>
            )}

            {active && (
                <>
                    <EnergyFlow curve={curve} radius={radius} color={energyColor} />

                    <pointLight
                        position={[0, 0.25, 0.85]}
                        color={energyColor}
                        intensity={0.9}
                        distance={3.8}
                        decay={2}
                    />
                </>
            )}

            <Connector
                position={startVec}
                direction={startRenderDirection}
                type={startConnector}
                color={color}
            />

            <Connector
                position={endVec}
                direction={endRenderDirection}
                type={endConnector}
                color={color}
            />

            {editable && (
                <>
                    <DragHandle
                        position={startVec}
                        active={draggingTarget === "start"}
                        onPointerDown={(event) => startDragging("start", event)}
                    />

                    <DragHandle
                        position={endVec}
                        active={draggingTarget === "end"}
                        onPointerDown={(event) => startDragging("end", event)}
                    />
                </>
            )}
        </group>
    )
}
