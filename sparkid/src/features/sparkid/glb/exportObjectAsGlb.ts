import * as THREE from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"

type ExportObjectAsGlbArgs = {
    object: THREE.Object3D
    fileName: string
    animations?: THREE.AnimationClip[]
    onlyVisible?: boolean
    trs?: boolean
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
}

export async function exportObjectAsGlb({
                                            object,
                                            fileName,
                                            animations = [],
                                            onlyVisible = true,
                                            trs = true,
                                        }: ExportObjectAsGlbArgs) {
    object.updateMatrixWorld(true)

    const exporter = new GLTFExporter()

    const result = await exporter.parseAsync(object, {
        binary: true,
        onlyVisible,
        trs,
        animations,
    })

    if (!(result instanceof ArrayBuffer)) {
        throw new Error("GLB export failed. Expected ArrayBuffer result.")
    }

    const blob = new Blob([result], {
        type: "model/gltf-binary",
    })

    downloadBlob(blob, fileName)
}