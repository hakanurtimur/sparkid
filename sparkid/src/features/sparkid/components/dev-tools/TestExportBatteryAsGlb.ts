import * as THREE from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"

import { createTestBatteryAnimationClips } from "./TestBatteryAnimationClips"

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}

export async function testExportBatteryAsGlb(
    object: THREE.Object3D,
    fileName = "test-battery-body.glb"
) {
    object.updateMatrixWorld(true)

    const exporter = new GLTFExporter()
    const animations = createTestBatteryAnimationClips()

    const result = await exporter.parseAsync(object, {
        binary: true,
        onlyVisible: true,
        trs: true,
        animations,
    })

    if (!(result instanceof ArrayBuffer)) {
        throw new Error("GLB export failed. Expected ArrayBuffer.")
    }

    const blob = new Blob([result], {
        type: "model/gltf-binary",
    })

    downloadBlob(blob, fileName)
}