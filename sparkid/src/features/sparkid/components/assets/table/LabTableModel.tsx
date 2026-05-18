"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

export type LabTableModelProps = {
    position?: Vec3;
    rotation?: Vec3;
    scale?: number;
    visible?: boolean;
};

const LAB_TABLE_GLB_PATH = "/models/sparkid/sparkid-lab-table-no-grid.glb";

export default function LabTableModel({
                                  position = [0, 0, 0],
                                  rotation = [0, -0.48, 0],
                                  scale = 1.35,
                                  visible = true,
                              }: LabTableModelProps) {
    const { scene } = useGLTF(LAB_TABLE_GLB_PATH);

    const tableScene = useMemo(() => {
        const clonedScene = scene.clone(true);

        clonedScene.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return;

            object.castShadow = true;
            object.receiveShadow = true;

            if (object.material) {
                const materials = Array.isArray(object.material)
                    ? object.material
                    : [object.material];

                materials.forEach((material) => {
                    material.needsUpdate = true;
                });
            }
        });

        return clonedScene;
    }, [scene]);

    if (!visible) return null;

    return (
        <group
            name="SparkidLabTable"
            position={position}
            rotation={rotation}
            scale={scale}
        >
            <primitive object={tableScene} />
        </group>
    );
}

useGLTF.preload(LAB_TABLE_GLB_PATH);