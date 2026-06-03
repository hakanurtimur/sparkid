"use client"

import { type ReactNode, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import {
    OrbitControls,
    PerspectiveCamera,
    View,
} from "@react-three/drei"

type SparkidMultiViewCanvasProps = {
    mainScene: ReactNode
    previewScene?: ReactNode
}

function MainViewLighting() {
    return (
        <>
            <hemisphereLight args={["#bcd7ff", "#111827", 0.86]} />
            <directionalLight
                castShadow
                position={[5, 8, 6]}
                intensity={2.15}
                color="#fff1d0"
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-near={1}
                shadow-camera-far={30}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
            />
            <directionalLight
                position={[-5, 4, -4]}
                intensity={0.75}
                color="#35E5F2"
            />
        </>
    )
}

function PreviewViewLighting() {
    return (
        <>
            <ambientLight intensity={0.95} />
            <directionalLight
                position={[3, 4, 4]}
                intensity={2.1}
                color="#fff1d0"
            />
            <pointLight
                position={[-1.6, 1.4, 1.8]}
                color="#35E5F2"
                intensity={0.9}
                distance={5}
            />
        </>
    )
}

export default function SparkidMultiViewCanvas({
                                                   mainScene,
                                                   previewScene,
                                               }: SparkidMultiViewCanvasProps) {
    const eventSourceRef = useRef<HTMLDivElement>(null!)
    const mainViewRef = useRef<HTMLDivElement>(null!)
    const previewViewRef = useRef<HTMLDivElement>(null!)

    return (
        <div
            ref={eventSourceRef}
            className="pointer-events-none absolute inset-0"
        >
            <div
                ref={mainViewRef}
                className="pointer-events-auto absolute inset-0"
            />

            {previewScene && (
                <div
                    ref={previewViewRef}
                    className="pointer-events-auto absolute bottom-5 right-5 z-20 h-40 w-40 overflow-hidden rounded-[1.5rem] border border-white/15 shadow-2xl ring-1 ring-[var(--sparkid-cyan)]/20 md:h-52 md:w-52"
                />
            )}

            <Canvas
                className="pointer-events-none fixed inset-0 z-10"
                eventSource={eventSourceRef}
                eventPrefix="client"
                shadows
                dpr={[1, 1.5]}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                }}
            >
                <View track={mainViewRef}>
                    <PerspectiveCamera
                        makeDefault
                        position={[0, 4.65, 9.6]}
                        fov={42}
                        near={0.1}
                        far={100}
                    />
                    <MainViewLighting />
                    {mainScene}
                    <OrbitControls
                        makeDefault
                        enableDamping
                        dampingFactor={0.08}
                        minDistance={5}
                        maxDistance={14}
                        target={[0, 0.35, 0]}
                    />
                </View>

                {previewScene && (
                    <View track={previewViewRef}>
                        <PerspectiveCamera
                            makeDefault
                            position={[2.4, 1.7, 3.1]}
                            fov={38}
                            near={0.1}
                            far={40}
                        />
                        <PreviewViewLighting />
                        {previewScene}
                        <OrbitControls
                            makeDefault
                            enableDamping
                            dampingFactor={0.08}
                            enablePan={false}
                            minDistance={2}
                            maxDistance={5}
                            target={[0, 0.2, 0]}
                        />
                    </View>
                )}

                <View.Port />
            </Canvas>
        </div>
    )
}
