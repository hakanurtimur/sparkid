"use client"

import * as THREE from "three"
import { useMemo, useRef } from "react"

import LightBulbCharacter from "@/features/sparkid/components/assets/circuit-elements/LightBulbCharacter"
import { GlbExportButton } from "@/features/sparkid/glb"

import {
    TEST_LIGHT_BULB_EXPORT_FILE_NAME,
    TEST_LIGHT_BULB_NODES,
} from "@/features/sparkid/components/assets/circuit-elements/light-bulb/TestLightBulbGlbConfig"
import { createTestLightBulbClips } from "@/features/sparkid/components/assets/circuit-elements/light-bulb/createTestLightBulbClips"

export default function TestLightBulbGlbExporter() {
    const exportRef = useRef<THREE.Group>(null)

    const animations = useMemo(() => {
        return createTestLightBulbClips()
    }, [])

    return (
        <>
            <group ref={exportRef} name="TestLightBulbExportRoot">
                <LightBulbCharacter
                    mood="off"
                    animation="hover"
                    position={[0, 0, 0]}
                    scale={1}
                    followPointer={false}
                    showEmoteBubble={false}
                    bodyNodeName={TEST_LIGHT_BULB_NODES.body}
                    disableRuntimeAnimation
                />
            </group>

            <GlbExportButton
                targetRef={exportRef}
                fileName={TEST_LIGHT_BULB_EXPORT_FILE_NAME}
                animations={animations}
                label="Export LightBulb Body GLB"
            />
        </>
    )
}