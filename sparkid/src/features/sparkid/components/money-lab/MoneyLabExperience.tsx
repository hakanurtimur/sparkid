"use client"

import { Suspense, useMemo, useState } from "react"
import {
    ContactShadows,
    Environment,
    Html,
    Line,
    useGLTF,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

import LabTableModel from "@/features/sparkid/components/assets/table/LabTableModel"

type MoneyCategory = "need" | "want"
type MoneyPortId = "product:water" | `category:${MoneyCategory}`
type Vec3 = [number, number, number]

type ProductPlacement = {
    id: string
    label: string
    position: Vec3
}

const WATER_CARD_MODEL_PATH = "/models/money/product-card-water-normal.glb"

const productPlacements: ProductPlacement[] = [
    { id: "slot-left", label: "Sol", position: [-0.72, 0.46, 0.05] },
    { id: "slot-center", label: "Orta", position: [0, 0.46, 0.05] },
    { id: "slot-right", label: "Sağ", position: [0.72, 0.46, 0.05] },
]

const categoryPorts: Record<MoneyCategory, Vec3> = {
    need: [-1.42, 0.78, -0.88],
    want: [1.42, 0.78, -0.88],
}

function MoneyLabFallback() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Money Lab yükleniyor...
            </div>
        </Html>
    )
}

function WaterProductCardModel({
    position,
    selected,
    connected,
    onPlugClick,
}: {
    position: Vec3
    selected: boolean
    connected: boolean
    onPlugClick: () => void
}) {
    const { scene } = useGLTF(WATER_CARD_MODEL_PATH)

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)

        clone.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return

            object.castShadow = true
            object.receiveShadow = true

            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material]

            materials.forEach((material) => {
                material.needsUpdate = true
            })
        })

        return clone
    }, [scene])

    const plugPosition: Vec3 = [0.34, 0.12, 0.02]

    return (
        <group
            name="MoneyProductCardWater"
            position={position}
            rotation={[-Math.PI / 2, 0, 0.04]}
            scale={0.23}
        >
            <primitive object={clonedScene} />

            <mesh position={[0.1, 0.52, 0.02]}>
                <ringGeometry args={[1.82, 1.92, 48]} />
                <meshBasicMaterial
                    color={selected ? "#FFD84A" : "#35E5F2"}
                    transparent
                    opacity={selected ? 0.95 : 0.42}
                    toneMapped={false}
                />
            </mesh>

            <group position={plugPosition} onClick={onPlugClick}>
                <mesh>
                    <sphereGeometry args={[0.16, 24, 16]} />
                    <meshStandardMaterial
                        color={connected ? "#45E39A" : "#35E5F2"}
                        emissive={connected ? "#45E39A" : "#13BBD1"}
                        emissiveIntensity={1.4}
                        roughness={0.28}
                    />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.24, 0.035, 10, 32]} />
                    <meshStandardMaterial
                        color={connected ? "#45E39A" : "#35E5F2"}
                        emissive={connected ? "#45E39A" : "#13BBD1"}
                        emissiveIntensity={1.1}
                    />
                </mesh>
            </group>
        </group>
    )
}

function PlacementPad({
    placement,
    active,
    occupied,
    onPlace,
}: {
    placement: ProductPlacement
    active: boolean
    occupied: boolean
    onPlace: () => void
}) {
    return (
        <group position={placement.position}>
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={(event) => {
                    event.stopPropagation()
                    if (active) onPlace()
                }}
            >
                <circleGeometry args={[0.34, 40]} />
                <meshBasicMaterial
                    color={
                        occupied
                            ? "#45E39A"
                            : active
                              ? "#FFD84A"
                              : "#35E5F2"
                    }
                    transparent
                    opacity={occupied ? 0.1 : active ? 0.24 : 0.08}
                    depthWrite={false}
                />
            </mesh>

            <Html
                center
                position={[0, 0.03, 0]}
                distanceFactor={6}
                className="pointer-events-none select-none"
            >
                <span className="rounded-full border border-white/10 bg-black/35 px-2 py-1 text-[10px] font-black text-white/70 backdrop-blur-md">
                    {placement.label}
                </span>
            </Html>
        </group>
    )
}

function CategoryTargetPanel({
    category,
    title,
    description,
    pending,
    connected,
    onPlugClick,
}: {
    category: MoneyCategory
    title: string
    description: string
    pending: boolean
    connected: boolean
    onPlugClick: () => void
}) {
    const position = categoryPorts[category]

    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.92, 0.16, 0.5]} />
                <meshStandardMaterial
                    color={category === "need" ? "#0D2F68" : "#09224F"}
                    roughness={0.58}
                    metalness={0.08}
                    emissive={pending ? "#FFD84A" : "#000000"}
                    emissiveIntensity={pending ? 0.35 : 0}
                />
            </mesh>

            <group
                position={[0, 0.16, 0.28]}
                onClick={(event) => {
                    event.stopPropagation()
                    onPlugClick()
                }}
            >
                <mesh>
                    <sphereGeometry args={[0.09, 24, 16]} />
                    <meshStandardMaterial
                        color={connected ? "#45E39A" : "#FFD84A"}
                        emissive={connected ? "#45E39A" : "#FFD84A"}
                        emissiveIntensity={1.25}
                        roughness={0.25}
                    />
                </mesh>
            </group>

            <Html
                center
                position={[0, 0.32, 0]}
                distanceFactor={5.2}
                className="pointer-events-none select-none"
            >
                <div className="w-32 rounded-2xl border border-white/10 bg-black/45 px-3 py-2 text-center shadow-xl backdrop-blur-md">
                    <p className="text-xs font-black text-white">{title}</p>
                    <p className="mt-1 text-[10px] font-semibold leading-4 text-white/60">
                        {description}
                    </p>
                </div>
            </Html>
        </group>
    )
}

function ChoiceLine({
    from,
    to,
    active,
}: {
    from: Vec3
    to: Vec3
    active: boolean
}) {
    const points = useMemo(() => {
        const start = new THREE.Vector3(...from)
        const end = new THREE.Vector3(...to)
        const middle = start.clone().lerp(end, 0.5)
        middle.y += 0.22

        return new THREE.QuadraticBezierCurve3(start, middle, end).getPoints(24)
    }, [from, to])

    return (
        <Line
            points={points}
            color={active ? "#45E39A" : "#35E5F2"}
            lineWidth={5}
            transparent
            opacity={0.95}
            depthWrite={false}
            toneMapped={false}
        />
    )
}

function MoneyLabScene({
    selectedProduct,
    placedProductSlotId,
    pendingPortId,
    connectedCategory,
    onPlaceWaterCard,
    onProductPlugClick,
    onCategoryPlugClick,
}: {
    selectedProduct: "water" | null
    placedProductSlotId: string | null
    pendingPortId: MoneyPortId | null
    connectedCategory: MoneyCategory | null
    onPlaceWaterCard: (slotId: string) => void
    onProductPlugClick: () => void
    onCategoryPlugClick: (category: MoneyCategory) => void
}) {
    const placedProduct = productPlacements.find((placement) => {
        return placement.id === placedProductSlotId
    })

    const productPlugWorldPosition: Vec3 | null = placedProduct
        ? [
              placedProduct.position[0] + 0.08,
              placedProduct.position[1] + 0.02,
              placedProduct.position[2] - 0.08,
          ]
        : null

    const categoryPlugWorldPosition = connectedCategory
        ? ([
              categoryPorts[connectedCategory][0],
              categoryPorts[connectedCategory][1] + 0.16,
              categoryPorts[connectedCategory][2] + 0.28,
          ] as Vec3)
        : null

    return (
        <>
            <color attach="background" args={["#07111f"]} />
            <fog attach="fog" args={["#07111f", 12, 28]} />

            <hemisphereLight args={["#d7ebff", "#061A3D", 0.85]} />
            <ambientLight intensity={0.65} />

            <directionalLight
                castShadow
                position={[5, 8, 6]}
                intensity={2.4}
                color="#fff8e8"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={1}
                shadow-camera-far={24}
                shadow-camera-left={-7}
                shadow-camera-right={7}
                shadow-camera-top={7}
                shadow-camera-bottom={-7}
            />

            <directionalLight
                position={[-4, 3.5, -4]}
                intensity={0.9}
                color="#35E5F2"
            />

            <Environment
                preset="city"
                background={false}
                environmentIntensity={0.24}
            />

            <LabTableModel
                position={[0, -0.54, 0]}
                rotation={[0, -0.48, 0]}
                scale={1.34}
            />

            {productPlacements.map((placement) => (
                <PlacementPad
                    key={placement.id}
                    placement={placement}
                    active={selectedProduct === "water"}
                    occupied={placedProductSlotId === placement.id}
                    onPlace={() => onPlaceWaterCard(placement.id)}
                />
            ))}

            {placedProduct && (
                <WaterProductCardModel
                    position={placedProduct.position}
                    selected={pendingPortId === "product:water"}
                    connected={Boolean(connectedCategory)}
                    onPlugClick={onProductPlugClick}
                />
            )}

            <CategoryTargetPanel
                category="need"
                title="İhtiyaç"
                description="Gerekli olan"
                pending={pendingPortId === "category:need"}
                connected={connectedCategory === "need"}
                onPlugClick={() => onCategoryPlugClick("need")}
            />

            <CategoryTargetPanel
                category="want"
                title="İstek"
                description="Güzel ama şart değil"
                pending={pendingPortId === "category:want"}
                connected={connectedCategory === "want"}
                onPlugClick={() => onCategoryPlugClick("want")}
            />

            {productPlugWorldPosition && categoryPlugWorldPosition && (
                <ChoiceLine
                    from={productPlugWorldPosition}
                    to={categoryPlugWorldPosition}
                    active={connectedCategory === "need"}
                />
            )}

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.72, 0]}
                receiveShadow
            >
                <planeGeometry args={[9, 9]} />
                <meshStandardMaterial
                    color="#081427"
                    roughness={0.88}
                    metalness={0.02}
                />
            </mesh>

            <ContactShadows
                position={[0, -0.7, 0]}
                opacity={0.38}
                scale={7}
                blur={2.5}
                far={4}
            />
        </>
    )
}

export default function MoneyLabExperience() {
    const [selectedProduct, setSelectedProduct] = useState<"water" | null>(null)
    const [placedProductSlotId, setPlacedProductSlotId] = useState<string | null>(
        null,
    )
    const [pendingPortId, setPendingPortId] = useState<MoneyPortId | null>(null)
    const [connectedCategory, setConnectedCategory] =
        useState<MoneyCategory | null>(null)

    const handleSelectWater = () => {
        setSelectedProduct("water")
        setPendingPortId(null)
    }

    const handlePlaceWaterCard = (slotId: string) => {
        setPlacedProductSlotId(slotId)
        setSelectedProduct(null)
        setPendingPortId(null)
        setConnectedCategory(null)
    }

    const handleProductPlugClick = () => {
        if (!placedProductSlotId) return
        setPendingPortId((current) =>
            current === "product:water" ? null : "product:water",
        )
    }

    const handleCategoryPlugClick = (category: MoneyCategory) => {
        if (pendingPortId !== "product:water") return
        setConnectedCategory(category)
        setPendingPortId(null)
    }

    const reset = () => {
        setSelectedProduct(null)
        setPlacedProductSlotId(null)
        setPendingPortId(null)
        setConnectedCategory(null)
    }

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#07111f] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[url('/sparkid/backgrounds/circuit-night-sky.png')] bg-cover bg-center opacity-70"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(53,229,242,0.12),rgba(7,17,31,0.44)_54%,rgba(2,11,31,0.92)_100%)]"
            />

            <Canvas
                className="absolute inset-0 h-full w-full"
                shadows
                dpr={[1, 1.5]}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
                camera={{
                    position: [3.8, 2.35, 4.55],
                    fov: 31,
                    near: 0.1,
                    far: 100,
                }}
            >
                <Suspense fallback={<MoneyLabFallback />}>
                    <MoneyLabScene
                        selectedProduct={selectedProduct}
                        placedProductSlotId={placedProductSlotId}
                        pendingPortId={pendingPortId}
                        connectedCategory={connectedCategory}
                        onPlaceWaterCard={handlePlaceWaterCard}
                        onProductPlugClick={handleProductPlugClick}
                        onCategoryPlugClick={handleCategoryPlugClick}
                    />
                </Suspense>
            </Canvas>

            <section className="pointer-events-auto absolute left-4 top-4 z-40 rounded-[1.75rem] border border-white/10 bg-black/45 p-4 shadow-2xl backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--sparkid-cyan)]">
                    Money Item Shelf
                </p>
                <button
                    type="button"
                    onClick={handleSelectWater}
                    className={`mt-3 flex min-w-44 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
                        selectedProduct === "water"
                            ? "border-[var(--sparkid-yellow)] bg-[var(--sparkid-yellow)]/15"
                            : "border-[var(--sparkid-cyan)]/35 bg-[var(--sparkid-panel)]/80"
                    }`}
                >
                    <span className="text-2xl">💧</span>
                    <span>
                        <span className="block text-sm font-black">
                            Su Kartı
                        </span>
                        <span className="block text-xs font-semibold text-white/55">
                            Seç ve masaya koy
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={reset}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/10"
                >
                    Sıfırla
                </button>

                <p className="mt-3 max-w-52 text-xs font-semibold leading-5 text-white/55">
                    Kartı seç, masadaki bir noktaya tıkla. Sonra kart plug&apos;ından İhtiyaç veya İstek plug&apos;ına bağla.
                </p>
            </section>
        </main>
    )
}

useGLTF.preload(WATER_CARD_MODEL_PATH)
