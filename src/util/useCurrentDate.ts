import { useState, useEffect } from "react";

export let currentResolution = 1000;
let tickerHandle = setInterval(tick, currentResolution);

export function setCurrentResolution(newResolutionMs: number) {
    clearInterval(tickerHandle);
    currentResolution = newResolutionMs;
    tickerHandle = setInterval(tick, currentResolution);
}

export let lastCurrentDate = new Date();
const activeListeners = new Map<number, (newDate: Date) => void>();
function tick() {
    lastCurrentDate = new Date();
    activeListeners.forEach(listener => listener(lastCurrentDate));
}

let idCounter = 1;
export function useCurrentDate(shouldUpdateDateState: (newDate: Date) => boolean = () => true) {

    const [id] = useState<number>(() => idCounter++);
    const [date, setDate] = useState<Date>(lastCurrentDate);

    useEffect(() => {
        setDate(lastCurrentDate);
        activeListeners.set(id, (currentDate: Date) => {
            const shouldTick = shouldUpdateDateState(currentDate);
            if (shouldTick) {
                setDate(currentDate);
            }
        });

        return () => void activeListeners.delete(id);
    }, [shouldUpdateDateState]);

    return date;
}