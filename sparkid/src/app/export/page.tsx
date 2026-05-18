"use client"

import { Canvas } from "@react-three/fiber"
import {
  ContactShadows,
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei"
import { Suspense } from "react"

import TestLightBulbGlbExporter from "@/features/sparkid/components/dev-tools/TestLightBulbGlbExporter";

export default function SparkidExportPage() {
  return (
      <main className="h-screen w-screen overflow-hidden bg-[#05070b]">
        <Canvas
            shadows
            dpr={[1, 2]}
            camera={{
              position: [0, 0.6, 6],
              fov: 42,
              near: 0.1,
              far: 100,
            }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#05070b"]} />

            <ambientLight intensity={0.85} />

            <directionalLight
                position={[3, 5, 4]}
                intensity={2.4}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            <pointLight position={[-3, 2.4, 3]} intensity={1.4} color="#38bdf8" />
            <pointLight position={[3, 1.8, 2]} intensity={0.9} color="#facc15" />

            <Environment preset="city" />

            <TestLightBulbGlbExporter />

            <Grid
                position={[0, -1.8, 0]}
                args={[8, 8]}
                cellSize={0.4}
                cellThickness={0.45}
                cellColor="#1f2937"
                sectionSize={1.6}
                sectionThickness={0.8}
                sectionColor="#334155"
                fadeDistance={10}
                fadeStrength={1}
                infiniteGrid
            />

            <ContactShadows
                position={[0, -1.78, 0]}
                opacity={0.45}
                scale={8}
                blur={2.8}
                far={4}
            />

            <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.08}
                minDistance={3.2}
                maxDistance={8}
                target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </main>
  )
}
