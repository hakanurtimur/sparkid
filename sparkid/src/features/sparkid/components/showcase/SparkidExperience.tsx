"use client"

import * as THREE from "three"
import { Suspense, useRef, useState, type ReactNode } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { ContactShadows, OrbitControls } from "@react-three/drei"

import type { TestBatteryAnimation } from "@/features/sparkid/components/assets/circuit-elements/battery/TestBatteryGlbConfig"

import type { TestLightBulbAnimation } from "@/features/sparkid/components/assets/circuit-elements/light-bulb/TestLightBulbGlbConfig"

import SparkyRobot, {
  type SparkyAnimation,
  type SparkyMood,
} from "@/features/sparkid/components/sparky/RobotMascot"

import SparkidCable, {
  type CableShape,
} from "@/features/sparkid/components/assets/circuit-elements/SparkidCable"

import StageLighting from "@/features/sparkid/components/assets/circuit-elements/StageLighting"
import BatteryGlbCharacter from "@/features/sparkid/components/assets/circuit-elements/battery/BatteryGlbCharacter";
import LightBulbGlbCharacter from "@/features/sparkid/components/assets/circuit-elements/light-bulb/LightBulbGlbCharacter";
import LabTableModel from "@/features/sparkid/components/assets/table/LabTableModel"

type CharacterKind = "sparky" | "battery" | "lightBulb" | "cable"

type RigAnimation = "hover" | "bob" | "rotate" | "excited" | "talk"

type LightBulbMood =
    | "off"
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy"

type SparkyControlKey =
    | "idle"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "rotate"
    | "sleepy"

type BatteryControlKey =
    | "idle"
    | "active"
    | "lowEnergy"
    | "talking"
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "rotate"

type LightBulbControlKey =
    | "off"
    | "on"
    | "glow"
    | "happy"
    | "thinking"
    | "warning"
    | "success"
    | "talking"
    | "sleepy"
    | "rotate"

type CableControlKey =
    | "curved"
    | "active"
    | "straight"
    | "u"
    | "s"
    | "loop"
    | "wavy"
    | "spiral"
    | "rotate"

type ControlVisual = {
  label: string
  emoji: string
  duration: number
  bg: string
  border: string
  text: string
  shadow: string
  description: string
}

type SparkyControl = ControlVisual & {
  mood: SparkyMood
  animation: SparkyAnimation
}

type BatteryControl = ControlVisual & {
  animation: TestBatteryAnimation
  rigAnimation: RigAnimation
  stateLabel: string
}

type LightBulbControl = ControlVisual & {
  mood: LightBulbMood
  animation: TestLightBulbAnimation
  stateLabel: string
}

type CableControl = ControlVisual & {
  shape: CableShape
  active: boolean
  rigAnimation: RigAnimation
  stateLabel: string
}

const characterOptions: Record<
    CharacterKind,
    {
      label: string
      emoji: string
      description: string
    }
> = {
  sparky: {
    label: "Sparky",
    emoji: "🤖",
    description: "AI rehber robot.",
  },
  battery: {
    label: "Pil",
    emoji: "🔋",
    description: "Devre enerjisi karakteri.",
  },
  lightBulb: {
    label: "Ampul",
    emoji: "💡",
    description: "Işık ve fikir karakteri.",
  },
  cable: {
    label: "Kablo",
    emoji: "🔌",
    description: "Enerji akışını taşıyan esnek bağlantı kablosu.",
  },
}

const sparkyControls: Record<SparkyControlKey, SparkyControl> = {
  idle: {
    mood: "idle",
    animation: "hover",
    label: "Bekle",
    emoji: "🤖",
    duration: 0,
    bg: "#eef8ff",
    border: "#bae6fd",
    text: "#075985",
    shadow: "rgba(14, 165, 233, 0.22)",
    description: "Karakter sakin şekilde havada süzülür.",
  },
  happy: {
    mood: "happy",
    animation: "bob",
    label: "Mutlu",
    emoji: "😊",
    duration: 2200,
    bg: "#ecfeff",
    border: "#a5f3fc",
    text: "#0e7490",
    shadow: "rgba(34, 211, 238, 0.26)",
    description: "Gözler parlar, yüz gülümser, hafif zıplar.",
  },
  thinking: {
    mood: "thinking",
    animation: "bob",
    label: "Düşünüyor",
    emoji: "❓",
    duration: 2600,
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#334155",
    shadow: "rgba(100, 116, 139, 0.2)",
    description: "Soru balonu çıkar, karakter düşünceli olur.",
  },
  warning: {
    mood: "warning",
    animation: "bob",
    label: "Uyarı",
    emoji: "⚠️",
    duration: 2300,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
    shadow: "rgba(249, 115, 22, 0.24)",
    description: "Işıklar turuncuya döner, uyarı ifadesi gelir.",
  },
  success: {
    mood: "success",
    animation: "excited",
    label: "Başarı",
    emoji: "⭐",
    duration: 2600,
    bg: "#f7fee7",
    border: "#bef264",
    text: "#4d7c0f",
    shadow: "rgba(132, 204, 22, 0.28)",
    description: "Yeşil ışık, yıldız efekti ve heyecanlı hareket.",
  },
  talking: {
    mood: "talking",
    animation: "talk",
    label: "Konuş",
    emoji: "💬",
    duration: 3200,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    shadow: "rgba(59, 130, 246, 0.24)",
    description: "Konuşma balonu çıkar, ağız ve gövde hareket eder.",
  },
  rotate: {
    mood: "idle",
    animation: "rotate",
    label: "Dön",
    emoji: "🔄",
    duration: 3200,
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    shadow: "rgba(124, 58, 237, 0.22)",
    description: "Karakter sağa sola dönerek farklı açıları gösterir.",
  },
  sleepy: {
    mood: "sleepy",
    animation: "hover",
    label: "Uykulu",
    emoji: "😴",
    duration: 2600,
    bg: "#eef2ff",
    border: "#c7d2fe",
    text: "#4338ca",
    shadow: "rgba(99, 102, 241, 0.22)",
    description: "Gözler kısılır, sakin ve yavaş hover yapar.",
  },
}

const batteryControls: Record<BatteryControlKey, BatteryControl> = {
  idle: {
    animation: "idle",
    rigAnimation: "hover",
    stateLabel: "Standby",
    label: "Bekle",
    emoji: "🔋",
    duration: 0,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    shadow: "rgba(37, 99, 235, 0.2)",
    description: "Pil karakteri sakin bekler.",
  },
  active: {
    animation: "active",
    rigAnimation: "excited",
    stateLabel: "Energy Active",
    label: "Enerji Ver",
    emoji: "⚡",
    duration: 3000,
    bg: "#ecfeff",
    border: "#a5f3fc",
    text: "#0891b2",
    shadow: "rgba(34, 211, 238, 0.3)",
    description: "Cyan enerji parlaması açılır, karakter canlı zıplar.",
  },
  lowEnergy: {
    animation: "lowEnergy",
    rigAnimation: "hover",
    stateLabel: "Low Battery",
    label: "Pil Az",
    emoji: "🪫",
    duration: 3200,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
    shadow: "rgba(249, 115, 22, 0.24)",
    description: "Pil enerjisi düşer, yüz üzgünleşir ve gövde çöker.",
  },
  talking: {
    animation: "talk",
    rigAnimation: "talk",
    stateLabel: "Talking",
    label: "Konuş",
    emoji: "💬",
    duration: 3200,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#2563eb",
    shadow: "rgba(59, 130, 246, 0.24)",
    description: "Pil konuşma animasyonuna geçer.",
  },
  happy: {
    animation: "happy",
    rigAnimation: "bob",
    stateLabel: "Happy Charge",
    label: "Mutlu",
    emoji: "😊",
    duration: 2600,
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
    shadow: "rgba(34, 197, 94, 0.22)",
    description: "Pil neşeli bir bounce yapar.",
  },
  sad: {
    animation: "sad",
    rigAnimation: "hover",
    stateLabel: "Sad",
    label: "Üzgün",
    emoji: "😟",
    duration: 2800,
    bg: "#eef2ff",
    border: "#c7d2fe",
    text: "#4338ca",
    shadow: "rgba(99, 102, 241, 0.22)",
    description: "Pil üzgün moda geçer.",
  },
  angry: {
    animation: "angry",
    rigAnimation: "bob",
    stateLabel: "Overload Warning",
    label: "Sinirli",
    emoji: "😠",
    duration: 2400,
    bg: "#fff1f2",
    border: "#fecdd3",
    text: "#be123c",
    shadow: "rgba(244, 63, 94, 0.24)",
    description: "Pil küçük titreşim yapar.",
  },
  surprised: {
    animation: "surprised",
    rigAnimation: "bob",
    stateLabel: "Voltage Surprise",
    label: "Şaşkın",
    emoji: "😮",
    duration: 2600,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#ea580c",
    shadow: "rgba(249, 115, 22, 0.22)",
    description: "Pil şaşkın moda geçer.",
  },
  rotate: {
    animation: "idle",
    rigAnimation: "rotate",
    stateLabel: "Showcase Rotate",
    label: "Dön",
    emoji: "🔄",
    duration: 3200,
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    shadow: "rgba(124, 58, 237, 0.22)",
    description: "Pil modeli sağa sola dönerek gösterilir.",
  },
}

const lightBulbControls: Record<LightBulbControlKey, LightBulbControl> = {
  off: {
    mood: "off",
    animation: "hover",
    stateLabel: "Kapalı / Soğuk Cam",
    label: "Kapalı",
    emoji: "⚪",
    duration: 0,
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#64748b",
    shadow: "rgba(100, 116, 139, 0.18)",
    description: "Ampul ışığı kapatır, cam soğuk ve ifadesiz görünür.",
  },
  on: {
    mood: "idle",
    animation: "hover",
    stateLabel: "Açık / Sıcak Işık",
    label: "Açık",
    emoji: "💡",
    duration: 0,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
    shadow: "rgba(251, 146, 60, 0.24)",
    description: "Sıcak sarı ışık yanar, ampul sakin bekler.",
  },
  glow: {
    mood: "idle",
    animation: "excited",
    stateLabel: "Yumuşak Işıma",
    label: "Parla",
    emoji: "✨",
    duration: 2600,
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
    shadow: "rgba(245, 158, 11, 0.28)",
    description: "Ampul neşeli zıplar.",
  },
  happy: {
    mood: "happy",
    animation: "bob",
    stateLabel: "Neşeli Işık",
    label: "Mutlu",
    emoji: "😊",
    duration: 2600,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#ea580c",
    shadow: "rgba(249, 115, 22, 0.24)",
    description: "Ampul mutlu moda geçer.",
  },
  thinking: {
    mood: "thinking",
    animation: "bob",
    stateLabel: "Fikir Arıyor",
    label: "Düşün",
    emoji: "❓",
    duration: 2800,
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#475569",
    shadow: "rgba(100, 116, 139, 0.2)",
    description: "Ampul düşünceli moda geçer.",
  },
  warning: {
    mood: "warning",
    animation: "bob",
    stateLabel: "Dikkat / Aşırı Enerji",
    label: "Uyarı",
    emoji: "⚠️",
    duration: 2400,
    bg: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
    shadow: "rgba(249, 115, 22, 0.26)",
    description: "Ampul uyarı animasyonuna geçer.",
  },
  success: {
    mood: "success",
    animation: "excited",
    stateLabel: "Başarı Işığı",
    label: "Başarı",
    emoji: "⭐",
    duration: 2800,
    bg: "#f7fee7",
    border: "#bef264",
    text: "#4d7c0f",
    shadow: "rgba(132, 204, 22, 0.28)",
    description: "Yeşil başarı ışığı ve heyecanlı hareket.",
  },
  talking: {
    mood: "talking",
    animation: "talk",
    stateLabel: "Konuşuyor",
    label: "Konuş",
    emoji: "💬",
    duration: 3200,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    shadow: "rgba(59, 130, 246, 0.24)",
    description: "Ampul konuşma animasyonuna geçer.",
  },
  sleepy: {
    mood: "sleepy",
    animation: "hover",
    stateLabel: "Kısık Işık",
    label: "Uykulu",
    emoji: "😴",
    duration: 2800,
    bg: "#eef2ff",
    border: "#c7d2fe",
    text: "#4338ca",
    shadow: "rgba(99, 102, 241, 0.22)",
    description: "Ampul uykulu moda geçer.",
  },
  rotate: {
    mood: "idle",
    animation: "rotate",
    stateLabel: "Model Görünümü",
    label: "Dön",
    emoji: "🔄",
    duration: 3400,
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    shadow: "rgba(124, 58, 237, 0.22)",
    description: "Ampul sağa sola dönerek modeli gösterir.",
  },
}

const cableControls: Record<CableControlKey, CableControl> = {
  curved: {
    shape: "curved",
    active: false,
    rigAnimation: "hover",
    stateLabel: "Esnek Kablo",
    label: "Kıvrımlı",
    emoji: "〰️",
    duration: 0,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    shadow: "rgba(37, 99, 235, 0.2)",
    description: "Kablo yumuşak kıvrımlı formda bekler.",
  },
  active: {
    shape: "wavy",
    active: true,
    rigAnimation: "excited",
    stateLabel: "Enerji Akışı Aktif",
    label: "Enerji Akışı",
    emoji: "⚡",
    duration: 3200,
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
    shadow: "rgba(245, 158, 11, 0.28)",
    description: "Kablo üzerinde sarı enerji noktaları akar.",
  },
  straight: {
    shape: "straight",
    active: false,
    rigAnimation: "hover",
    stateLabel: "Düz Kablo",
    label: "Düz",
    emoji: "➖",
    duration: 0,
    bg: "#f8fafc",
    border: "#cbd5e1",
    text: "#334155",
    shadow: "rgba(100, 116, 139, 0.18)",
    description: "Düz bağlantı kablosu görünümü.",
  },
  u: {
    shape: "u",
    active: false,
    rigAnimation: "hover",
    stateLabel: "U Şekli",
    label: "U Şekli",
    emoji: "∪",
    duration: 0,
    bg: "#eef8ff",
    border: "#bae6fd",
    text: "#075985",
    shadow: "rgba(14, 165, 233, 0.22)",
    description: "Oyuncak U kablo varyantı.",
  },
  s: {
    shape: "s",
    active: false,
    rigAnimation: "hover",
    stateLabel: "S Şekli",
    label: "S Şekli",
    emoji: "〰️",
    duration: 0,
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    shadow: "rgba(124, 58, 237, 0.22)",
    description: "S kıvrımlı kablo varyantı.",
  },
  loop: {
    shape: "loop",
    active: false,
    rigAnimation: "hover",
    stateLabel: "Halka Kablo",
    label: "Halka",
    emoji: "⭕",
    duration: 0,
    bg: "#ecfeff",
    border: "#a5f3fc",
    text: "#0e7490",
    shadow: "rgba(34, 211, 238, 0.24)",
    description: "Halka formunda esnek kablo.",
  },
  wavy: {
    shape: "wavy",
    active: false,
    rigAnimation: "bob",
    stateLabel: "Dalgalı Kablo",
    label: "Dalgalı",
    emoji: "🌊",
    duration: 0,
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#2563eb",
    shadow: "rgba(59, 130, 246, 0.22)",
    description: "Dalgalı oyuncak kablo formu.",
  },
  spiral: {
    shape: "spiral",
    active: false,
    rigAnimation: "bob",
    stateLabel: "Spiral Kablo",
    label: "Spiral",
    emoji: "🌀",
    duration: 0,
    bg: "#faf5ff",
    border: "#e9d5ff",
    text: "#7e22ce",
    shadow: "rgba(168, 85, 247, 0.22)",
    description: "Spiral kablo şekli.",
  },
  rotate: {
    shape: "curved",
    active: false,
    rigAnimation: "rotate",
    stateLabel: "Model Görünümü",
    label: "Dön",
    emoji: "🔄",
    duration: 3200,
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    shadow: "rgba(124, 58, 237, 0.22)",
    description: "Kablo modeli sağa sola dönerek gösterilir.",
  },
}

function GenericCharacterRig({
                               animation,
                               children,
                             }: {
  animation: RigAnimation
  children: ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    const t = state.clock.elapsedTime

    let y = Math.sin(t * 1.6) * 0.04
    let rotZ = Math.sin(t * 1.2) * 0.02
    let rotY = 0

    if (animation === "bob") {
      y = Math.sin(t * 2.3) * 0.06
      rotZ = Math.sin(t * 1.8) * 0.035
    }

    if (animation === "rotate") {
      y = Math.sin(t * 1.3) * 0.035
      rotY = Math.sin(t * 0.9) * 0.65
    }

    if (animation === "excited") {
      y = Math.abs(Math.sin(t * 5.2)) * 0.1
      rotZ = Math.sin(t * 7.5) * 0.075
    }

    if (animation === "talk") {
      y = Math.sin(t * 3.4) * 0.05
      rotZ = Math.sin(t * 5.5) * 0.035
    }

    group.position.y = THREE.MathUtils.lerp(group.position.y, y, 0.08)
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, rotZ, 0.08)
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, rotY, 0.08)
  })

  return <group ref={groupRef}>{children}</group>
}

function CharacterStage({
                          character,
                          sparkyControl,
                          batteryControl,
                          lightBulbControl,
                          cableControl,
                        }: {
  character: CharacterKind
  sparkyControl: SparkyControl
  batteryControl: BatteryControl
  lightBulbControl: LightBulbControl
  cableControl: CableControl
}) {
  const table = (
      <LabTableModel
          position={[0, -1.78, 0]}
          scale={1.28}
      />
  )

  if (character === "sparky") {
    return (
        <>
          {table}
          <SparkyRobot
              mood={sparkyControl.mood}
              animation={sparkyControl.animation}
              position={[0, -0.08, 0]}
              scale={1}
              followPointer
              showEmoteBubble
              emoteBubblePosition={[1.35, 0.95, 0.82]}
              emoteBubbleScale={0.95}
              emoteBubbleSide="right"
          />
        </>
    )
  }

  if (character === "battery") {
    return (
        <>
          {table}
          <group position={[0, -0.1, 0]}>
            <GenericCharacterRig animation={batteryControl.rigAnimation}>
              <BatteryGlbCharacter
                  animation={batteryControl.animation}
                  position={[0, 0, 0]}
                  scale={0.88}
                  showEmoteBubble
                  showSigns
                  showCheeks
              />
            </GenericCharacterRig>
          </group>
        </>
    )
  }

  if (character === "cable") {
    return (
        <>
          {table}
          <group position={[0, -0.12, 0]}>
            <GenericCharacterRig animation={cableControl.rigAnimation}>
              <SparkidCable
                  shape={cableControl.shape}
                  active={cableControl.active}
                  position={[0, 0.22, 0]}
                  scale={1.28}
                  radius={0.085}
                  color="#2563EB"
                  energyColor="#FFD84D"
                  startConnector="socket"
                  endConnector="plug"
              />
            </GenericCharacterRig>
          </group>
        </>
    )
  }



  return (
      <>
        {table}
        <LightBulbGlbCharacter
            mood={lightBulbControl.mood}
            animation={lightBulbControl.animation}
            position={[0, -0.04, 0]}
            scale={1.05}
        />
      </>
  )
}

export function SparkidExperience() {
  const [character, setCharacter] = useState<CharacterKind>("sparky")
  const [sparkyKey, setSparkyKey] = useState<SparkyControlKey>("idle")
  const [batteryKey, setBatteryKey] = useState<BatteryControlKey>("idle")
  const [lightBulbKey, setLightBulbKey] = useState<LightBulbControlKey>("on")
  const [cableKey, setCableKey] = useState<CableControlKey>("curved")

  const timeoutRef = useRef<number | null>(null)

  const activeCharacter = characterOptions[character]

  const activeSparkyControl = sparkyControls[sparkyKey]
  const activeBatteryControl = batteryControls[batteryKey]
  const activeLightBulbControl = lightBulbControls[lightBulbKey]
  const activeCableControl = cableControls[cableKey]

  const activeVisual: ControlVisual =
      character === "battery"
          ? activeBatteryControl
          : character === "sparky"
              ? activeSparkyControl
              : character === "lightBulb"
                  ? activeLightBulbControl
                  : activeCableControl

  const activeControlEntries =
      character === "battery"
          ? Object.entries(batteryControls)
          : character === "lightBulb"
              ? Object.entries(lightBulbControls)
              : character === "cable"
                  ? Object.entries(cableControls)
                  : Object.entries(sparkyControls)

  function clearCurrentTimeout() {
    if (!timeoutRef.current) return

    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const playSparkyControl = (key: SparkyControlKey) => {
    const control = sparkyControls[key]

    setSparkyKey(key)
    clearCurrentTimeout()

    if (control.duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setSparkyKey("idle")
      }, control.duration)
    }
  }

  const playBatteryControl = (key: BatteryControlKey) => {
    const control = batteryControls[key]

    setBatteryKey(key)
    clearCurrentTimeout()

    if (control.duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setBatteryKey("idle")
      }, control.duration)
    }
  }

  const playLightBulbControl = (key: LightBulbControlKey) => {
    const control = lightBulbControls[key]

    setLightBulbKey(key)
    clearCurrentTimeout()

    if (control.duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setLightBulbKey("on")
      }, control.duration)
    }
  }

  const playCableControl = (key: CableControlKey) => {
    const control = cableControls[key]

    setCableKey(key)
    clearCurrentTimeout()

    if (control.duration > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setCableKey("curved")
      }, control.duration)
    }
  }

  const playActiveControl = (key: string) => {
    if (character === "battery") {
      playBatteryControl(key as BatteryControlKey)
      return
    }

    if (character === "lightBulb") {
      playLightBulbControl(key as LightBulbControlKey)
      return
    }

    if (character === "cable") {
      playCableControl(key as CableControlKey)
      return
    }

    playSparkyControl(key as SparkyControlKey)
  }

  const isActiveControl = (key: string) => {
    if (character === "battery") return batteryKey === key
    if (character === "lightBulb") return lightBulbKey === key
    if (character === "cable") return cableKey === key

    return sparkyKey === key
  }

  return (
      <main className="min-h-screen bg-[#fff8ea] p-4 text-[#23170e] sm:p-6 lg:p-8">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-5 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[2rem] border border-[#ead6b5] bg-[#fff3d8] shadow-[0_24px_70px_rgba(98,65,24,0.14)] lg:min-h-[calc(100vh-4rem)]">
            <div className="relative min-h-[520px] flex-1">
              <Canvas
                  camera={{
                    position: [0, 0.18, 5.45],
                    fov: character === "cable" ? 34 : 38,
                    near: 0.1,
                    far: 100,
                  }}
                  shadows
                  dpr={[1, 2]}
                  gl={{
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.18,
                  }}
                  className="h-full w-full"
              >
                <color attach="background" args={["#fff3d8"]} />

                <StageLighting
                    energetic={
                        (character === "battery" && batteryKey === "active") ||
                        (character === "cable" && activeCableControl.active) ||
                        (character === "lightBulb" &&
                            ["glow", "happy", "success"].includes(lightBulbKey))
                    }
                />

                <Suspense fallback={null}>
                  <CharacterStage
                      character={character}
                      sparkyControl={activeSparkyControl}
                      batteryControl={activeBatteryControl}
                      lightBulbControl={activeLightBulbControl}
                      cableControl={activeCableControl}
                  />
                </Suspense>

                <ContactShadows
                    position={[0, -1.42, 0]}
                    opacity={0.22}
                    scale={5}
                    blur={2.4}
                    far={4}
                />

                <OrbitControls />
              </Canvas>
            </div>

            <div className="border-t border-[#ead6b5] bg-white/75 p-4 backdrop-blur">
              <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2563be]">
                    Karakter Seçimi
                  </p>

                  <h2 className="mt-1 text-lg font-black text-[#17324a]">
                    {activeCharacter.emoji} {activeCharacter.label}
                  </h2>

                  <p className="mt-1 text-sm text-[#6d5845]">
                    {activeCharacter.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(characterOptions).map(([key, option]) => {
                    const characterKey = key as CharacterKind
                    const isActive = character === characterKey

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setCharacter(characterKey)}
                            className="rounded-2xl border px-3 py-3 text-left text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
                            style={{
                              background: isActive ? "#eff6ff" : "#ffffff",
                              borderColor: isActive ? "#2563be" : "#ead6b5",
                              color: isActive ? "#1d4ed8" : "#6d5845",
                              boxShadow: isActive
                                  ? "0 12px 28px rgba(37, 99, 190, 0.18)"
                                  : "none",
                            }}
                        >
                          <span className="mr-2">{option.emoji}</span>
                          {option.label}
                        </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2563be]">
                    Animasyon Kontrolü
                  </p>

                  <h2
                      className="mt-1 text-lg font-black"
                      style={{ color: activeVisual.text }}
                  >
                    {activeVisual.emoji} {activeVisual.label}
                  </h2>
                </div>

                <p className="max-w-sm text-right text-sm leading-5 text-[#6d5845]">
                  {activeVisual.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {activeControlEntries.map(([key, control]) => {
                  const isActive = isActiveControl(key)

                  return (
                      <button
                          key={key}
                          type="button"
                          onClick={() => playActiveControl(key)}
                          className="rounded-2xl border px-3 py-3 text-left text-sm font-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
                          style={{
                            background: control.bg,
                            borderColor: isActive ? control.text : control.border,
                            color: control.text,
                            boxShadow: isActive
                                ? `0 12px 28px ${control.shadow}`
                                : "none",
                            outline: isActive
                                ? `3px solid ${control.border}`
                                : "none",
                          }}
                      >
                        <span className="mr-2">{control.emoji}</span>
                        {control.label}
                      </button>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="flex flex-col justify-center rounded-[2rem] border border-[#ead6b5] bg-white/80 p-6 shadow-[0_24px_70px_rgba(98,65,24,0.12)] backdrop-blur sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2563be]">
              Sparkid Circuit Lab
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#24170d]">
              Karakter Test Alanı
            </h1>

            <p className="mt-4 text-base leading-7 text-[#6d5845]">
              Sparky, pil, ampul ve kablo assetlerini aynı sahnede test edebilirsin.
              Seçili assete göre animasyon kit’i otomatik değişir.
            </p>

            <div className="mt-8 space-y-4">
              <article className="rounded-3xl border border-[#d7ecff] bg-[#eef8ff] p-5">
                <h2 className="text-lg font-bold text-[#17324a]">
                  Aktif Karakter
                </h2>

                <p className="mt-3 leading-7 text-[#4f6474]">
                  {activeCharacter.emoji} {activeCharacter.label} —{" "}
                  {activeCharacter.description}
                </p>
              </article>

              <article
                  className="rounded-3xl border p-5 transition-all"
                  style={{
                    background: activeVisual.bg,
                    borderColor: activeVisual.border,
                    boxShadow: `0 18px 45px ${activeVisual.shadow}`,
                  }}
              >
                <p
                    className="text-xs font-black uppercase tracking-[0.22em]"
                    style={{ color: activeVisual.text }}
                >
                  Aktif Durum
                </p>

                <h2
                    className="mt-2 text-xl font-black"
                    style={{ color: activeVisual.text }}
                >
                  {activeVisual.emoji} {activeVisual.label}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6d5845]">
                  {activeVisual.description}
                </p>

                <div className="mt-4 rounded-2xl bg-white/55 p-4 text-sm font-bold text-[#6d5845]">
                  <p>Character: {character}</p>

                  {character === "battery" ? (
                      <>
                        <p>Battery State: {activeBatteryControl.stateLabel}</p>
                        <p>Battery Animation: {activeBatteryControl.animation}</p>
                        <p>Rig Animation: {activeBatteryControl.rigAnimation}</p>
                      </>
                  ) : character === "sparky" ? (
                      <>
                        <p>Mood: {activeSparkyControl.mood}</p>
                        <p>Animation: {activeSparkyControl.animation}</p>
                      </>
                  ) : character === "cable" ? (
                      <>
                        <p>Cable State: {activeCableControl.stateLabel}</p>
                        <p>Cable Shape: {activeCableControl.shape}</p>
                        <p>
                          Energy Active:{" "}
                          {activeCableControl.active ? "true" : "false"}
                        </p>
                        <p>Rig Animation: {activeCableControl.rigAnimation}</p>
                      </>
                  ) : (
                      <>
                        <p>Light State: {activeLightBulbControl.stateLabel}</p>
                        <p>Mood: {activeLightBulbControl.mood}</p>
                        <p>Animation: {activeLightBulbControl.animation}</p>
                      </>
                  )}
                </div>
              </article>
            </div>
          </aside>
        </div>
      </main>
  )
}

export default SparkidExperience
