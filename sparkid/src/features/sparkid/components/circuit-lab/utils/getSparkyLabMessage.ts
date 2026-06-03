import type {
    CircuitLevelConfig,
    CircuitPartTool,
    CircuitPlacedParts,
} from "../types"
import type { CircuitSwitchMode } from "@/features/sparkid/components/assets/circuit-elements/CircuitSwitch"
import type { SparkyMessage } from "../AiTutorPanel"
import { hasWireBetween, type CircuitWireLike } from "./circuitWireUtils"
import type { FreeLabCircuitType } from "./detectFreeLabCircuit"

type GetSparkyLabMessageInput = {
    selectedTool: CircuitPartTool | null
    placedParts: CircuitPlacedParts
    pendingPortId: string | null
    powered: boolean
    wires?: CircuitWireLike[]
    levelConfig?: CircuitLevelConfig
    lessonComplete?: boolean
    wireRemovalCount?: number
    switchMode?: CircuitSwitchMode
    switchToggleCycleComplete?: boolean
    isCircuitWired?: boolean
    freeLabCircuitType?: FreeLabCircuitType | null
}

function hasAllMainParts(placedParts: CircuitPlacedParts) {
    return Boolean(placedParts.battery && placedParts.switch && placedParts.bulb)
}

export function getSparkyLabMessage({
                                        selectedTool,
                                        placedParts,
                                        pendingPortId,
                                        powered,
                                        wires = [],
                                        levelConfig,
                                        lessonComplete = false,
                                        wireRemovalCount = 0,
                                        switchMode = "off",
                                        switchToggleCycleComplete = false,
                                        isCircuitWired = false,
                                        freeLabCircuitType = null,
                                    }: GetSparkyLabMessageInput): SparkyMessage {
    if (levelConfig?.id === "power-island-lesson-1") {
        if (lessonComplete) {
            return {
                title: "İlk enerji yolu hazır",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Çok iyi! Enerji ampule ulaştı. Ampulün yanmaması normal: enerji henüz pile geri dönemiyor. Sonraki bölümde dönüş yolunu kuracağız.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Ampule bağla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Şimdi kablonun diğer ucunu ampulün parlayan bağlantı noktasına tak.",
            }
        }

        if (selectedTool === "cable") {
            return {
                title: "İlk kabloyu bağlayalım",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Pilin artı ucunu ampule bağlayarak enerjinin ampule doğru yola çıkmasını sağlayalım.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Bu bölümde sadece ilk yolu kuruyoruz: pilin artı ucundan ampule giden bağlantı. Ampul henüz yanmayacak.",
            }
        }

        if (!placedParts.battery) {
            return {
                title: "Önce pili yerleştir",
                tone: "idle",
                stepLabel: "1. Adım",
                message:
                    "Önce devreye enerji verecek pili masaya yerleştirelim. Parlayan pil slotuna tıkla.",
            }
        }

        return {
            title: "Pil hazır",
            tone: "hint",
            stepLabel: "2. Adım",
            message:
                "Harika! Pil devrenin enerji kaynağıdır. Şimdi kabloyu seç ve pilin artı ucunu ampule bağla.",
        }
    }

    if (levelConfig?.id === "power-island-lesson-2") {
        if (lessonComplete || powered) {
            return {
                title: "Kapalı devre tamamlandı",
                tone: "success",
                stepLabel: "Bölüm 2",
                message:
                    "Başardın! Enerji pilin artı ucundan çıktı, ampulden geçti ve pilin eksi ucuna geri döndü. Tam tur tamamlanınca ampul yanar.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Dönüş yolunu bitir",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Şimdi kablonun diğer ucunu pilin eksi ucuna tak. Böylece enerji geri dönebilecek.",
            }
        }

        if (selectedTool === "cable") {
            return {
                title: "Dönüş yolunu kur",
                tone: "hint",
                stepLabel: "Bölüm 2",
                message:
                    "Enerji ampule ulaştı. Şimdi ampulün diğer ucunu pilin eksi ucuna bağlayarak dönüş yolunu tamamla.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Ampulün yanması için enerji sadece ampule gitmez; ampulden çıkıp pilin eksi ucuna geri dönmelidir.",
            }
        }

        return {
            title: "İlk bağlantı hazır",
            tone: "idle",
            stepLabel: "1. Adım",
            message:
                "İlk enerji yolu hazır. Kabloyu seç ve ampulün boş ucunu pilin eksi ucuna bağla.",
        }
    }

    if (levelConfig?.id === "power-island-lesson-3") {
        if (lessonComplete && wireRemovalCount > 0) {
            return {
                title: "Kapalı devreyi test ettin",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Mükemmel! Kablo çıkınca yol koptu ve ampul söndü; kabloyu geri takınca tam tur yeniden oluştu. Kapalı devreyi gerçekten test ettin.",
            }
        }

        if (!powered && wireRemovalCount > 0 && selectedTool === "cable" && pendingPortId) {
            return {
                title: "Tekrar bağla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Şimdi kablonun diğer ucunu pilin eksi ucuna tak ve ampulün yeniden yanmasını izle.",
            }
        }

        if (!powered && wireRemovalCount > 0) {
            return {
                title: "Ampul söndü",
                tone: "warning",
                stepLabel: "Test",
                message:
                    "Gördün mü? Dönüş yolu kopunca enerji devreyi tamamlayamadı ve ampul söndü. Şimdi kabloyu seçip dönüş yolunu tekrar kur.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Parlayan dönüş kablosuna tıklayarak onu çıkarabilirsin. Devre kopunca ampul söner.",
            }
        }

        return {
            title: "Devre çalışıyor",
            tone: "success",
            stepLabel: "Bölüm 3",
            message:
                "Devre çalışıyor! Şimdi küçük bir test yapalım. Parlayan dönüş kablosuna tıkla ve ampule ne olduğunu gör.",
        }
    }

    if (levelConfig?.id === "fault-island-lesson-1") {
        if (lessonComplete || powered) {
            return {
                title: "Dönüş yolu tamamlandı",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Harika! Eksik dönüş yolunu buldun. Elektrik ampulden çıkıp pile geri dönebildiği için devre artık tamam.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Doğru uca dön",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu pilin eksi ucuna bağla. Elektrik ampulden çıkıp pile geri dönmeli.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Ampulün boşta kalan ucunu pilin eksi ucuna bağlamayı dene.",
            }
        }

        return {
            title: "Eksik dönüş yolu",
            tone: "warning",
            stepLabel: "Bölüm 1",
            message:
                "Enerji ampule kadar geliyor ama geri dönemiyor. Devre tamamlanmadığı için ampul yanmıyor.",
        }
    }

    if (levelConfig?.id === "fault-island-lesson-2") {
        if (lessonComplete || powered) {
            return {
                title: "Yanlış kablo düzeldi",
                tone: "success",
                stepLabel: "Bölüm 2",
                message:
                    "Süper! Kablo bağlı görünüyordu ama yanlış uca gidiyordu. Doğru eksi uca bağlayınca elektrik doğru yoldan döndü.",
            }
        }

        if (wireRemovalCount > 0) {
            return {
                title: "Sorunlu kablo kalktı",
                tone: "hint",
                stepLabel: "Onarım",
                message:
                    "Evet, sorun o kabloduydu. Şimdi ampulden çıkan yolu pilin eksi ucuna bağlayalım.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Eksi uca bağla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Ampulden çıkan yol pilin artı ucuna değil, eksi ucuna dönmeli.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Turuncu kablo yanlış yere gidiyor. Onu kaldırabilir veya doğru dönüş kablosuyla değiştirebilirsin.",
            }
        }

        return {
            title: "Yanlış kabloyu bul",
            tone: "warning",
            stepLabel: "Bölüm 2",
            message:
                "Bu devrede bir kablo yanlış yere gidiyor. Kablo bağlı görünüyor ama elektrik doğru yoldan dönemiyor.",
        }
    }

    if (levelConfig?.id === "fault-island-lesson-3") {
        if (!placedParts.battery) {
            return {
                title: "Güç kaynağı eksik",
                tone: "warning",
                stepLabel: "Bölüm 3",
                message:
                    "Masada anahtar ve ampul var ama devreyi başlatacak pil yok. Önce pili bulup masadaki güç yuvasına yerleştir.",
            }
        }

        if (lessonComplete || powered) {
            return {
                title: "Devre tamir edildi",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Muhteşem! Eksik güç kaynağını ekledin, anahtar üzerinden yolu tamamladın ve ampulü yaktın. Bu kez arıza eksik parçaydı.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Yolu takip et",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu sıradaki parlayan porta tak. Enerji pil, anahtar, ampul ve pil eksi ucu arasında dolaşmalı.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Devrenin çalışması için sadece ampul ve anahtar yetmez. Enerjiyi başlatan pil de devrede olmalı.",
            }
        }

        return {
            title: "Pil geldi, şimdi bağla",
            tone: "hint",
            stepLabel: "Bölüm 3",
            message:
                "Şimdi kabloyu seç. Pilin artı ucunu anahtara, anahtarı ampule, ampulü de pilin eksi ucuna bağlayarak arızayı onar.",
        }
    }

    if (levelConfig?.id === "switch-island-lesson-1") {
        if (lessonComplete || switchToggleCycleComplete) {
            return {
                title: "Anahtarı tanıdın",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Harika! Anahtar ON olunca yol kapanır ve elektrik geçebilir; OFF olunca yol kesilir. Şimdi bunu gerçek devrede deneyelim.",
            }
        }

        if (switchMode === "on") {
            return {
                title: "Yol açık",
                tone: "hint",
                stepLabel: "ON",
                message:
                    "Güzel! Anahtar ON durumunda yol açık görünüyor. Şimdi bir kez OFF yapıp yolun kesildiğini gözlemle.",
            }
        }

        return {
            title: "Anahtarı dene",
            tone: "idle",
            stepLabel: "Bölüm 1",
            message:
                "Anahtara tıkla ve ON/OFF durumlarını gözlemle. Bugün anahtarın elektrik yolunu nasıl kontrol ettiğini öğreniyoruz.",
        }
    }

    if (levelConfig?.id === "switch-island-lesson-2") {
        const hasBatteryToSwitch = hasWireBetween(
            wires,
            "battery:plus",
            "switch-1:in",
        )
        const hasSwitchToBulb = hasWireBetween(
            wires,
            "switch-1:out",
            "bulb:a",
        )
        const hasBulbToBattery = hasWireBetween(
            wires,
            "bulb:b",
            "battery:minus",
        )

        if (lessonComplete || powered) {
            return {
                title: "Anahtarlı devre çalıştı",
                tone: "success",
                stepLabel: "Bölüm 2",
                message:
                    "Süper! Bağlantılar doğru ve anahtar ON. Elektrik anahtardan geçebildi, ampule ulaştı ve pile geri döndü.",
            }
        }

        if (isCircuitWired && switchMode === "off") {
            return {
                title: "Anahtar yolu kapatıyor",
                tone: "warning",
                stepLabel: "OFF",
                message:
                    "Bağlantılar doğru görünüyor. Ama anahtar OFF olduğu için elektrik geçemiyor. Anahtarı ON yapmayı dene.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            if (pendingPortId === "battery:plus") {
                return {
                    title: "Anahtara götür",
                    tone: "hint",
                    stepLabel: "1. Kablo",
                    message:
                        "Güzel başlangıç. Bu kablonun diğer ucunu anahtarın giriş portuna tak. Enerji önce anahtara uğramalı.",
                }
            }

            if (pendingPortId === "switch-1:out") {
                return {
                    title: "Ampule götür",
                    tone: "hint",
                    stepLabel: "2. Kablo",
                    message:
                        "Şimdi anahtarın çıkışından ampule git. Böylece anahtar elektrik yolunun ortasında kalacak.",
                }
            }

            if (pendingPortId === "bulb:b") {
                return {
                    title: "Dönüş yolunu bağla",
                    tone: "hint",
                    stepLabel: "3. Kablo",
                    message:
                        "Son adım dönüş yolu. Ampulün diğer ucunu pilin eksi ucuna bağla.",
                }
            }

            return {
                title: "Devre yolunu tamamla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu sıradaki uygun porta tak. Enerji pilden çıkıp anahtardan ve ampulden geçmeli.",
            }
        }

        if (selectedTool === "cable") {
            if (!hasBatteryToSwitch) {
                return {
                    title: "Önce anahtara bağla",
                    tone: "hint",
                    stepLabel: "1. Kablo",
                    message:
                        "İlk kablo pilin artı ucundan anahtarın girişine gitmeli. Ampule direkt gitme; bu adada anahtar yolun ortasında.",
                }
            }

            if (!hasSwitchToBulb) {
                return {
                    title: "Anahtardan ampule",
                    tone: "hint",
                    stepLabel: "2. Kablo",
                    message:
                        "Harika. Şimdi anahtarın çıkış portunu ampulün girişine bağla.",
                }
            }

            if (!hasBulbToBattery) {
                return {
                    title: "Dönüş yolunu kur",
                    tone: "hint",
                    stepLabel: "3. Kablo",
                    message:
                        "Son kablo ampulden pilin eksi ucuna dönmeli. Yol tamamlanınca anahtarı ON yapacağız.",
                }
            }

            return {
                title: "Anahtarlı yolu kur",
                tone: "hint",
                stepLabel: "Bölüm 2",
                message:
                    "Kabloyu seç. Hedefimiz: pil artı ucu, anahtar, ampul ve pil eksi ucu arasında tam bir yol kurmak.",
            }
        }

        return {
            title: "Kabloyu seç",
            tone: "idle",
            stepLabel: "Bölüm 2",
            message:
                "Bu masada parçalar düz sırada değil; yolu takip edeceğiz. Kabloyu seç ve önce pilin artı ucunu anahtarın girişine bağla.",
        }
    }

    if (levelConfig?.id === "switch-island-lesson-3") {
        if (!placedParts.battery) {
            return {
                title: "Önce pili koy",
                tone: "idle",
                stepLabel: "Bölüm 3",
                message:
                    "Bu kez devreyi sen kuracaksın. Önce pili seç ve parlayan pil yuvasına yerleştir.",
            }
        }

        if (!placedParts.switch) {
            return {
                title: "Anahtarı ekle",
                tone: "idle",
                stepLabel: "Bölüm 3",
                message:
                    "Güzel. Şimdi anahtarı seç ve masanın ortasındaki kontrol noktasına yerleştir.",
            }
        }

        if (!placedParts.bulb) {
            return {
                title: "Ampulü yerleştir",
                tone: "idle",
                stepLabel: "Bölüm 3",
                message:
                    "Son parça ampul. Ampulü üst sağdaki yuvaya koy, sonra kablolarla yolu kuracağız.",
            }
        }

        if (lessonComplete || powered) {
            return {
                title: "Control Gate açıldı",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Başardın! Anahtar sadece ampulü değil, enerji yolunu da kontrol edebiliyor. ON olunca yol açıldı ve kontrol kapısı çalıştı.",
            }
        }

        return {
            title: "Kapıyı devreyle aç",
            tone: switchMode === "off" ? "warning" : "hint",
            stepLabel: "Bölüm 3",
            message:
                "Şimdi kabloyu seç. Pil artı ucundan anahtara, anahtardan ampule ve ampulden pil eksi ucuna dönüş yolunu kur.",
        }
    }

    if (levelConfig?.id === "series-island-lesson-1") {
        if (lessonComplete) {
            return {
                title: "İkinci ampul zincirde",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Harika! Elektrik artık önce birinci ampulden, sonra ikinci ampulden geçerek pile dönüyor. İkinci ampulü ayrı bir yola değil, aynı zincire ekledin.",
            }
        }

        const returnShortcutExists = hasWireBetween(wires, "bulb:b", "battery:minus")

        if (returnShortcutExists && wireRemovalCount === 0) {
            return {
                title: "Önce eski dönüşü çıkar",
                tone: "warning",
                stepLabel: "Bölüm 1",
                message:
                    "İlk ampul şu an tek başına pile dönüyor. İkinci ampulü zincire eklemek için önce bu dönüş kablosunu çıkaralım.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Sıradaki halkayı seç",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Seri devrede her parça zincirin bir halkası gibi davranır. Kablonun diğer ucunu sıradaki parlayan porta tak.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Seri devrede ampuller ayrı yollara bağlanmaz. İkinci ampul, birinci ampulün çıkışından sonra gelmeli.",
            }
        }

        return {
            title: "İkinci ampulü ekle",
            tone: "hint",
            stepLabel: "Bölüm 1",
            message:
                "Kabloyu seç. Birinci ampulün çıkışını ikinci ampulün girişine, sonra ikinci ampulü pilin eksi ucuna bağla.",
        }
    }

    if (levelConfig?.id === "series-island-lesson-2") {
        const middleWireExists = hasWireBetween(wires, "bulb:b", "bulb-2:a")

        if (lessonComplete && wireRemovalCount > 0) {
            return {
                title: "Kopukluğu onardın",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Süper! Zinciri tekrar tamamladın. Elektrik yeniden tüm seri yolu dolaşıyor.",
            }
        }

        if (!middleWireExists && wireRemovalCount > 0 && selectedTool === "cable" && pendingPortId) {
            return {
                title: "Kopukluğu kapat",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu diğer ampulün parlayan portuna tak ve seri zinciri yeniden tamamla.",
            }
        }

        if (!middleWireExists && wireRemovalCount > 0) {
            return {
                title: "Bütün zincir durdu",
                tone: "warning",
                stepLabel: "Gözlem",
                message:
                    "Gördün mü? Ortadaki yol kopunca elektrik iki ampule de ulaşamadı. Seri devrede bir kopukluk tüm devreyi durdurur.",
            }
        }

        return {
            title: "Ortadaki kabloyu çıkar",
            tone: "success",
            stepLabel: "Bölüm 2",
            message:
                "Bu devrede ampuller aynı yol üzerinde bağlı. Şimdi iki ampul arasındaki parlayan kabloya tıkla ve zincir kopunca ne olduğunu görelim.",
        }
    }

    if (levelConfig?.id === "series-island-lesson-3") {
        if (lessonComplete || powered) {
            return {
                title: "Seri ışık zinciri hazır",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Muhteşem! Seri devreyi kurdun. Elektrik tek bir zincir gibi iki ampulden geçip pile döndü.",
            }
        }

        const hasFirstWire = hasWireBetween(wires, "battery:plus", "bulb:a")
        const hasMiddleWire = hasWireBetween(wires, "bulb:b", "bulb-2:a")

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Sıradaki portu seç",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu sıradaki parlayan porta tak. Seri devrede yol tek çizgi gibi ilerler.",
            }
        }

        if (!hasFirstWire) {
            return {
                title: "İlk halkayı kur",
                tone: "hint",
                stepLabel: "1. Adım",
                message:
                    "Önce pilin artı ucunu birinci ampule bağla. Enerji zincire buradan girecek.",
            }
        }

        if (!hasMiddleWire) {
            return {
                title: "İkinci halkayı kur",
                tone: "hint",
                stepLabel: "2. Adım",
                message:
                    "Şimdi birinci ampulün çıkışını ikinci ampule bağla. Seri devrede parçalar arka arkaya gelir.",
            }
        }

        return {
            title: "Dönüş yolunu kapat",
            tone: "hint",
            stepLabel: "3. Adım",
            message:
                "Son olarak ikinci ampulden pilin eksi ucuna dön. Böylece seri ışık zinciri tamamlanacak.",
        }
    }

    if (levelConfig?.id === "parallel-island-lesson-1") {
        if (lessonComplete || powered) {
            return {
                title: "İki ayrı ışık yolu",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Harika! Artık iki ampul de aynı pilden enerji alıyor ama kendi yollarından çalışıyor. Bu paralel devrenin kalbi.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Ayrı kolu tamamla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Kablonun diğer ucunu ikinci ampulün kendi yolunu tamamlayacak parlayan porta tak.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Küçük ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "İkinci ampul birinci ampulün devamına bağlanmayacak. O da pilin artı ucundan başlayıp eksi ucuna dönen ayrı bir yol kurmalı.",
            }
        }

        return {
            title: "İkinci ışık yolunu ekle",
            tone: "hint",
            stepLabel: "Bölüm 1",
            message:
                "İlk ampul zaten yanıyor. Kabloyu seç ve ikinci ampul için pilin artı ucundan pilin eksi ucuna dönen ayrı bir kol kur.",
        }
    }

    if (levelConfig?.id === "parallel-island-lesson-2") {
        const secondReturnExists = hasWireBetween(wires, "bulb-2:b", "battery:minus")

        if (lessonComplete && wireRemovalCount > 0) {
            return {
                title: "Paralel kol onarıldı",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Süper! İkinci kolu yeniden tamamladın. Paralel devrede her ampul kendi yoluna sahip olduğu için bir kol bozulsa bile diğer kol çalışabilir.",
            }
        }

        if (!secondReturnExists && wireRemovalCount > 0 && selectedTool === "cable" && pendingPortId) {
            return {
                title: "İkinci kolu tamamla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Şimdi kablonun diğer ucunu pilin eksi ucuna bağla. İkinci ampulün dönüş yolu tekrar tamamlanacak.",
            }
        }

        if (!secondReturnExists && wireRemovalCount > 0) {
            return {
                title: "Bir kol koptu",
                tone: "warning",
                stepLabel: "Gözlem",
                message:
                    "Gördün mü? İkinci ampulün yolu koptu. Birinci ampulün kendi yolu hâlâ tamam, paralel devre fikri tam olarak bu.",
            }
        }

        return {
            title: "İkinci kolu test et",
            tone: "success",
            stepLabel: "Bölüm 2",
            message:
                "Bu devrede iki ayrı ışık yolu var. Şimdi ikinci ampulün dönüş kablosuna tıkla ve bir kol kopunca ne olduğunu gözlemle.",
        }
    }

    if (levelConfig?.id === "parallel-island-lesson-3") {
        if (lessonComplete || powered) {
            return {
                title: "Paralel sistem hazır",
                tone: "success",
                stepLabel: "Final",
                message:
                    "Muhteşem! İki ampulü paralel bağladın. Elektrik iki farklı yoldan akabiliyor.",
            }
        }

        const hasBranchOnePositive = hasWireBetween(wires, "battery:plus", "bulb:a")
        const hasBranchOneReturn = hasWireBetween(wires, "bulb:b", "battery:minus")
        const hasBranchTwoPositive = hasWireBetween(wires, "battery:plus", "bulb-2:a")

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Ayrı yolu takip et",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Güzel. Kablonun diğer ucunu aynı ampulün kendi yolunu tamamlayacak parlayan porta tak.",
            }
        }

        if (!hasBranchOnePositive) {
            return {
                title: "Birinci yolu başlat",
                tone: "hint",
                stepLabel: "1. Adım",
                message:
                    "Önce birinci ampulün kendi yolunu başlat: pilin artı ucunu birinci ampule bağla.",
            }
        }

        if (!hasBranchOneReturn) {
            return {
                title: "Birinci yolu kapat",
                tone: "hint",
                stepLabel: "2. Adım",
                message:
                    "Şimdi birinci ampulden pilin eksi ucuna dön. Birinci ışık yolu tamamlanacak.",
            }
        }

        if (!hasBranchTwoPositive) {
            return {
                title: "İkinci yolu başlat",
                tone: "hint",
                stepLabel: "3. Adım",
                message:
                    "Şimdi ikinci ampul için ayrı bir yol kur. O da pilin artı ucundan başlamalı.",
            }
        }

        return {
            title: "İkinci yolu kapat",
            tone: "hint",
            stepLabel: "4. Adım",
            message:
                "Son olarak ikinci ampulden pilin eksi ucuna dön. Böylece iki ayrı paralel yol tamamlanacak.",
        }
    }

    if (levelConfig?.id === "free-lab-sandbox") {
        if (lessonComplete || powered) {
            const successMessages: Record<FreeLabCircuitType, string> = {
                simple:
                    "Temiz bir kapalı devre kurdun. Elektrik yolu tamamlandı.",
                switch:
                    "Anahtarlı devre kurdun! Elektrik yolunu anahtarla kontrol ettin.",
                series:
                    "Seri devre kurdun! Elektrik tek bir zincir gibi iki ampulden geçti.",
                parallel:
                    "Paralel devre kurdun! İki ampul kendi ayrı yollarından enerji aldı.",
            }

            return {
                title: "Devre Ustası",
                tone: "success",
                stepLabel: "Serbest Masa",
                message:
                    `${freeLabCircuitType ? successMessages[freeLabCircuitType] : "Çalışan bir devre kurdun."} Harika iş çıkardın. Artık devreleri kurabiliyor, test edebiliyor ve hatalarını anlayabiliyorsun.`,
            }
        }

        if (!placedParts.battery) {
            return {
                title: "Masa artık sende",
                tone: "idle",
                stepLabel: "Serbest Masa",
                message:
                    "Final masası senin. Önce devreye enerji verecek pili istediğin boş hücreye yerleştir.",
            }
        }

        if (!placedParts.bulb && !placedParts.bulb2) {
            return {
                title: "Bir ışık seç",
                tone: "hint",
                stepLabel: "Parça",
                message:
                    "Şimdi en az bir ampul yerleştir. İstersen ikinci ampulü de ekleyip seri ya da paralel devre deneyebilirsin.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Yolu tamamla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Kablonun diğer ucunu seç. Bir ampulün yanması için yol pilin artısından başlayıp ampulden geçerek pilin eksisine dönmeli.",
            }
        }

        if (selectedTool === "cable") {
            return {
                title: "Kendi bağlantını kur",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Serbest moddasın. Pilin artı ucundan başlayıp ampul ve istersen anahtardan geçen kapalı bir yol kur.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Serbest masa ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Çalışan her devrede ortak fikir aynı: elektrik pilin artısından çıkar, ışık veren parçadan geçer ve pilin eksisine döner.",
            }
        }

        return {
            title: "Kendi devreni tasarla",
            tone: "idle",
            stepLabel: "Serbest Masa",
            message:
                "Parçaları istediğin yere koyabilirsin. Basit, anahtarlı, seri veya paralel bir devre kurmayı dene.",
        }
    }

    if (levelConfig?.id === "free-lab-lesson-1") {
        if (lessonComplete || powered) {
            return {
                title: "İlk serbest ışığın yandı",
                tone: "success",
                stepLabel: "Bölüm 1",
                message:
                    "Harika! İlk serbest devreni kurdun ve ışığı yaktın. Pilin artısından çıkıp ampulden geçerek pilin eksisine dönen kapalı yolu tamamladın.",
            }
        }

        if (!placedParts.battery) {
            return {
                title: "Masa artık sende",
                tone: "idle",
                stepLabel: "Serbest Masa",
                message:
                    "Artık masayı sen yönetiyorsun. İlk görev: kendi ışığını yak! Önce pili masaya yerleştir.",
            }
        }

        if (!placedParts.bulb) {
            return {
                title: "Ampulü ekle",
                tone: "hint",
                stepLabel: "Bölüm 1",
                message:
                    "Güzel. Şimdi ampulü yerleştir; sonra pilin artısından ampule, ampulden pilin eksisine döneceğiz.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Kapalı yolu tamamla",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Kablonun diğer ucunu parlayan porta tak. Ampulün yanması için yol pile geri dönmeli.",
            }
        }

        return {
            title: "Kendi ışığını yak",
            tone: "hint",
            stepLabel: "Bölüm 1",
            message:
                "Kabloyu seç. Ampulün yanması için pilin artısından çıkıp ampulden geçerek pilin eksisine dönmelisin.",
        }
    }

    if (levelConfig?.id === "free-lab-lesson-2") {
        if (lessonComplete || powered) {
            return {
                title: "Anahtarlı devre hazır",
                tone: "success",
                stepLabel: "Bölüm 2",
                message:
                    "Süper! Artık ışığı anahtarla kontrol edebiliyorsun. Anahtar ON olunca yol açıldı ve ampul yandı.",
            }
        }

        if (!placedParts.battery || !placedParts.switch || !placedParts.bulb) {
            return {
                title: "Kontrol parçalarını yerleştir",
                tone: "idle",
                stepLabel: "Bölüm 2",
                message:
                    "Şimdi devrene bir kontrol noktası ekleyelim. Pil, anahtar ve ampulü masaya yerleştir.",
            }
        }

        if (isCircuitWired && switchMode === "off") {
            return {
                title: "Anahtarı dene",
                tone: "warning",
                stepLabel: "Kontrol",
                message:
                    "Bağlantılar doğru görünüyor. Ama anahtar OFF olduğu için yol kapalı. Anahtarı ON yaparsan ışığı sen yönetirsin.",
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Anahtarlı yolu kur",
                tone: "hint",
                stepLabel: "Kablo",
                message:
                    "Elektrik önce anahtardan geçmeli. Kablonun diğer ucunu sıradaki parlayan porta tak.",
            }
        }

        return {
            title: "Anahtarlı devre tasarla",
            tone: "hint",
            stepLabel: "Bölüm 2",
            message:
                "Elektrik önce anahtardan geçmeli. Anahtar ON olunca yol açılır, OFF olunca ampul söner.",
        }
    }

    if (levelConfig?.id === "free-lab-lesson-3") {
        if (lessonComplete || powered) {
            const successMessages: Record<FreeLabCircuitType, string> = {
                simple:
                    "Temiz bir kapalı devre kurdun. Elektrik yolu tamamlandı.",
                switch:
                    "Anahtarlı devre kurdun! Elektrik yolunu anahtarla kontrol ettin.",
                series:
                    "Seri devre kurdun! Elektrik tek bir zincir gibi iki ampulden geçti.",
                parallel:
                    "Paralel devre kurdun! İki ampul kendi ayrı yollarından enerji aldı.",
            }

            return {
                title: "Devre Ustası",
                tone: "success",
                stepLabel: "Final",
                message:
                    `${freeLabCircuitType ? successMessages[freeLabCircuitType] : "Çalışan bir devre kurdun."} Harika iş çıkardın. Artık devreleri kurabiliyor, test edebiliyor ve hatalarını anlayabiliyorsun.`,
            }
        }

        if (selectedTool === "cable" && pendingPortId) {
            return {
                title: "Kendi yolunu tamamla",
                tone: "hint",
                stepLabel: "Final",
                message:
                    "Kablonun diğer ucunu seçtiğin devre türüne göre parlayan porta tak. Yol pilin eksisine dönebildiğinde devre çalışır.",
            }
        }

        if (selectedTool === "hint") {
            return {
                title: "Final ipucu",
                tone: "hint",
                stepLabel: "İpucu",
                message:
                    "Önce bir elektrik yolu kur. Pilin artısından başla, parçaların içinden geç ve pilin eksisine dön.",
            }
        }

        return {
            title: "Final masası senin",
            tone: "idle",
            stepLabel: "Final",
            message:
                "Final masası senin! İstersen tek ampul yak, istersen iki ampulü seri ya da paralel bağla.",
        }
    }

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
