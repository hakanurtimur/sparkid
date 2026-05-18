import { useGLTF } from "@react-three/drei"

export function preloadGlb(src: string) {
    useGLTF.preload(src)
}