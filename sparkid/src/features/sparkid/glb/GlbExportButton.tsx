"use client"

import * as THREE from "three"
import { Html } from "@react-three/drei"
import type { RefObject } from "react"

import { exportObjectAsGlb } from "./exportObjectAsGlb"

type GlbExportButtonProps = {
    targetRef: RefObject<THREE.Object3D | null>
    fileName: string
    animations?: THREE.AnimationClip[]
    label?: string
}

export default function GlbExportButton({
                                            targetRef,
                                            fileName,
                                            animations = [],
                                            label = "Export GLB",
                                        }: GlbExportButtonProps) {
    async function handleExport() {
        if (!targetRef.current) {
            console.warn("No export target found.")
            return
        }

        await exportObjectAsGlb({
            object: targetRef.current,
            fileName,
            animations,
        })
    }

    return (
        <Html fullscreen>
            <div className="pointer-events-none fixed left-4 top-4 z-50">
                <button
                    type="button"
                    className="pointer-events-auto rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-lg"
                    onClick={handleExport}
                >
                    {label}
                </button>
            </div>
        </Html>
    )
}