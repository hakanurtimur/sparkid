"use client"

import { useRef, useState } from "react"
import { Html } from "@react-three/drei"

import TestBatteryCharacterModel, {
    type TestBatteryCharacterModelHandle,
} from "./TestBatteryCharacterModel"
import type { TestBatteryAnimation } from "./TestBatteryTypes"

const TEST_ANIMATIONS: TestBatteryAnimation[] = [
    "idle",
    "talk",
    "happy",
    "sad",
    "angry",
    "surprised",
    "active",
    "lowEnergy",
]

export default function TestBatteryAnimationDemo() {
    const [animation, setAnimation] = useState<TestBatteryAnimation>("idle")
    const batteryRef = useRef<TestBatteryCharacterModelHandle>(null)

    function handlePlay(nextAnimation: TestBatteryAnimation) {
        setAnimation(nextAnimation)
        batteryRef.current?.play(nextAnimation)
    }

    return (
        <>
            <TestBatteryCharacterModel
                ref={batteryRef}
                animation={animation}
                position={[0, 0, 0]}
                scale={1}
                loop
            />

            <Html fullscreen>
                <div className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-wrap gap-2">
                    {TEST_ANIMATIONS.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className="pointer-events-auto rounded-xl bg-black px-3 py-2 text-xs font-medium text-white shadow-lg"
                            onClick={() => handlePlay(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </Html>
        </>
    )
}