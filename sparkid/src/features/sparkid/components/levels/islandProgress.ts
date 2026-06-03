"use client"

import { useCallback, useSyncExternalStore } from "react"

function getProgressStorageKey(islandSlug: string) {
    return `sparkid:island-progress:${islandSlug}`
}

function getRewardClaimedStorageKey(islandSlug: string) {
    return `sparkid:island-reward-claimed:${islandSlug}`
}

function dispatchIslandProgressChange(
    islandSlug: string,
    completedLessonNumber: number,
    rewardClaimed: boolean,
) {
    window.dispatchEvent(
        new CustomEvent("sparkid:island-progress-change", {
            detail: {
                islandSlug,
                completedLessonNumber,
                rewardClaimed,
            },
        }),
    )
}

export function readCompletedLessonNumber(islandSlug: string) {
    if (typeof window === "undefined") return 0

    const storedValue = window.localStorage.getItem(
        getProgressStorageKey(islandSlug),
    )
    const completedLessonNumber = Number(storedValue)

    return Number.isFinite(completedLessonNumber)
        ? Math.max(completedLessonNumber, 0)
        : 0
}

export function readRewardClaimed(islandSlug: string) {
    if (typeof window === "undefined") return false

    return window.localStorage.getItem(
        getRewardClaimedStorageKey(islandSlug),
    ) === "true"
}

export function writeCompletedLessonNumber(
    islandSlug: string,
    lessonNumber: number,
) {
    if (typeof window === "undefined") return

    const currentLessonNumber = readCompletedLessonNumber(islandSlug)
    const nextLessonNumber = Math.max(currentLessonNumber, lessonNumber)

    window.localStorage.setItem(
        getProgressStorageKey(islandSlug),
        String(nextLessonNumber),
    )

    dispatchIslandProgressChange(
        islandSlug,
        nextLessonNumber,
        readRewardClaimed(islandSlug),
    )
}

export function writeRewardClaimed(islandSlug: string, claimed = true) {
    if (typeof window === "undefined") return

    if (claimed) {
        window.localStorage.setItem(getRewardClaimedStorageKey(islandSlug), "true")
    } else {
        window.localStorage.removeItem(getRewardClaimedStorageKey(islandSlug))
    }

    dispatchIslandProgressChange(
        islandSlug,
        readCompletedLessonNumber(islandSlug),
        claimed,
    )
}

export function resetIslandProgress(islandSlug: string) {
    if (typeof window === "undefined") return

    window.localStorage.removeItem(getProgressStorageKey(islandSlug))
    window.localStorage.removeItem(getRewardClaimedStorageKey(islandSlug))
    dispatchIslandProgressChange(islandSlug, 0, false)
}

export function isIslandLessonUnlocked(
    completedLessonNumber: number,
    lessonNumber: number,
) {
    return lessonNumber <= completedLessonNumber + 1
}

export function useIslandProgress(islandSlug: string) {
    const subscribe = useCallback((onStoreChange: () => void) => {
        window.addEventListener("storage", onStoreChange)
        window.addEventListener("sparkid:island-progress-change", onStoreChange)

        return () => {
            window.removeEventListener("storage", onStoreChange)
            window.removeEventListener(
                "sparkid:island-progress-change",
                onStoreChange,
            )
        }
    }, [])

    const getSnapshot = useCallback(() => {
        return readCompletedLessonNumber(islandSlug)
    }, [islandSlug])

    const completedLessonNumber = useSyncExternalStore(
        subscribe,
        getSnapshot,
        () => 0,
    )
    const getRewardSnapshot = useCallback(() => {
        return readRewardClaimed(islandSlug)
    }, [islandSlug])
    const rewardClaimed = useSyncExternalStore(
        subscribe,
        getRewardSnapshot,
        () => false,
    )

    const markLessonComplete = useCallback(
        (lessonNumber: number) => {
            writeCompletedLessonNumber(islandSlug, lessonNumber)
        },
        [islandSlug],
    )

    const markRewardClaimed = useCallback(() => {
        writeRewardClaimed(islandSlug, true)
    }, [islandSlug])

    const reset = useCallback(() => {
        resetIslandProgress(islandSlug)
    }, [islandSlug])

    const isLessonUnlocked = useCallback(
        (lessonNumber: number) => {
            return isIslandLessonUnlocked(
                completedLessonNumber,
                lessonNumber,
            )
        },
        [completedLessonNumber],
    )

    return {
        completedLessonNumber,
        rewardClaimed,
        isLessonUnlocked,
        markLessonComplete,
        markRewardClaimed,
        reset,
    }
}
