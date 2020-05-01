import { useState, useEffect } from "react";


const tikcerHandle = setInterval(tick, 1000);
const activeTickers: { [id: number]: (date: Date) => void } = {};
function tick() {
    const date = new Date();
    for (const k of Object.getOwnPropertyNames(activeTickers)) {
        activeTickers[k as any](date);
    }
}

let idCounter = 1;
export function useCurrentDate1secondResolution() {

    const [id] = useState<number>(() => idCounter++);
    const [date, setDate] = useState<Date>(() => new Date());

    useEffect(() => {
        activeTickers[id] = setDate;
        return () => void delete activeTickers[id];
    }, []);

    return date;
}