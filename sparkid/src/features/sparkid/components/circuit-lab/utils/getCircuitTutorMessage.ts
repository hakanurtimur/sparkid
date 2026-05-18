import type { CircuitFeedbackState } from "../types"

export type SparkyEmotion = "happy" | "thinking" | "warning" | "success"

export type CircuitTutorFeedback = {
    message: string
    emotion: SparkyEmotion
}

const tutorFeedback: Record<CircuitFeedbackState, CircuitTutorFeedback> = {
    empty: {
        message: "Kabloyu bir bağlantı noktasına takarak başlayalım.",
        emotion: "thinking",
    },
    partial: {
        message:
            "Enerji yolu henüz tamamlanmadı. Pil, anahtar ve ampul arasında kapalı bir yol kurmalısın.",
        emotion: "warning",
    },
    ready: {
        message: "Devre hazır görünüyor. Şimdi anahtarı açmayı dene.",
        emotion: "happy",
    },
    powered: {
        message: "Harika! Devre tamamlandı, enerji ampule ulaştı.",
        emotion: "success",
    },
}

export function getCircuitTutorMessage(
    feedbackState: CircuitFeedbackState
): CircuitTutorFeedback {
    return tutorFeedback[feedbackState]
}
