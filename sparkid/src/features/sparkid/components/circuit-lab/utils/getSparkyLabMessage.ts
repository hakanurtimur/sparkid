import type { CircuitPartTool, CircuitPlacedParts } from "../types"
import type { SparkyMessage } from "../AiTutorPanel"

type GetSparkyLabMessageInput = {
    selectedTool: CircuitPartTool | null
    placedParts: CircuitPlacedParts
    pendingPortId: string | null
    powered: boolean
}

function hasAllMainParts(placedParts: CircuitPlacedParts) {
    return Boolean(placedParts.battery && placedParts.switch && placedParts.bulb)
}

export function getSparkyLabMessage({
                                        selectedTool,
                                        placedParts,
                                        pendingPortId,
                                        powered,
                                    }: GetSparkyLabMessageInput): SparkyMessage {
    if (powered) {
        return {
            title: "Harika iş!",
            tone: "success",
            stepLabel: "Başardı",
            message:
                "Devre çalışıyor. Enerji pilden çıktı, bağlantılardan geçti ve ampule ulaştı.",
        }
    }

    if (selectedTool === "cable" && pendingPortId) {
        return {
            title: "İkinci portu seç",
            tone: "hint",
            stepLabel: "Kablo",
            message:
                "Güzel başlangıç. Şimdi kablonun diğer ucunu bağlamak istediğin porta tıkla.",
        }
    }

    if (selectedTool === "cable") {
        return {
            title: "Kabloyu bağlayalım",
            tone: "hint",
            stepLabel: "Kablo",
            message:
                "Önce bir başlangıç portu seç. Pilin + ucu devreyi başlatmak için iyi bir noktadır.",
        }
    }

    if (selectedTool === "hint") {
        return {
            title: "Küçük ipucu",
            tone: "hint",
            stepLabel: "İpucu",
            message:
                "Devreyi takip etmek için enerjinin pilden çıktığını, anahtardan geçtiğini ve ampule ulaştığını düşünebilirsin.",
        }
    }

    if (!placedParts.battery) {
        return {
            title: "Önce pili yerleştir",
            tone: "idle",
            stepLabel: "1. Adım",
            message:
                "Devreye enerji verecek parça pil. Devre Kutusu’ndan pili seçip masadaki boş bir kareye yerleştir.",
        }
    }

    if (!placedParts.switch) {
        return {
            title: "Şimdi anahtarı ekle",
            tone: "idle",
            stepLabel: "2. Adım",
            message:
                "Güzel. Anahtar devreyi açıp kapatmamızı sağlar. Anahtarı masada uygun gördüğün bir kareye koyabilirsin.",
        }
    }

    if (!placedParts.bulb) {
        return {
            title: "Ampul zamanı",
            tone: "idle",
            stepLabel: "3. Adım",
            message:
                "Süper. Şimdi ampulü ekleyelim. Devre doğru bağlanınca enerjiyi ampulde göreceğiz.",
        }
    }

    if (hasAllMainParts(placedParts) && placedParts.cableCount === 0) {
        return {
            title: "Kabloları bağlayalım",
            tone: "hint",
            stepLabel: "4. Adım",
            message:
                "Parçalar hazır. Şimdi Kablo’ya tıkla, sonra iki port seçerek parçaları birbirine bağla.",
        }
    }

    if (hasAllMainParts(placedParts) && placedParts.cableCount < 3) {
        return {
            title: "Devreyi tamamla",
            tone: "hint",
            stepLabel: "Bağlantı",
            message:
                "Güzel gidiyorsun. Devrenin çalışması için üç bağlantıya ihtiyacımız var: pil, anahtar ve ampul bir halka gibi bağlanmalı.",
        }
    }

    return {
        title: "Anahtarı dene",
        tone: "success",
        stepLabel: "Kontrol",
        message:
            "Bağlantılar hazır gibi görünüyor. Anahtarı açarak ampulün yanıp yanmadığını test edebilirsin.",
    }
}