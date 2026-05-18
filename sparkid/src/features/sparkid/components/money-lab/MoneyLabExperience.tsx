"use client"

import { Suspense } from "react"
import { ContactShadows, Environment, Html } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

import LabTableModel from "@/features/sparkid/components/assets/table/LabTableModel"

function MoneyLabFallback() {
    return (
        <Html center>
            <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
                Money Lab yükleniyor...
            </div>
        </Html>
    )
}

function MoneyLabScene() {
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
    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#07111f]">
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
                    <MoneyLabScene />
                </Suspense>
            </Canvas>
        </main>
    )
}
