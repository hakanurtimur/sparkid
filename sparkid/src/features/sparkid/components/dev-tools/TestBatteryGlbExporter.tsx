"use client"

import * as THREE from "three"
import { Html } from "@react-three/drei"
import { useRef } from "react"

import TestBatteryBodyAsset from "./TestBatteryBodyAsset"
import { testExportBatteryAsGlb } from "./TestExportBatteryAsGlb"

export default function TestBatteryGlbExporter() {
    const exportRef = useRef<THREE.Group>(null)

    async function handleExport() {
        if (!exportRef.current) return

        await testExportBatteryAsGlb(exportRef.current, "test-battery-body.glb")
    }

    return (
        <>
            <Html fullscreen>
                <div className="pointer-events-none fixed left-4 top-4 z-50">
                    <button
                        type="button"
                        className="pointer-events-auto rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-lg"
                        onClick={handleExport}
                    >
                        Export Test Battery GLB
                    </button>
                </div>
            </Html>

            <group ref={exportRef} name="TestBatteryExportRoot">
                <TestBatteryBodyAsset />
            </group>
        </>
    )
}