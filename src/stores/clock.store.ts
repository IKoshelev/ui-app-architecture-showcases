import { SubStore } from "../util/subStore";

export function getDefaultClockStoreRoot() {
    return {
        currentDate: new Date(),
        tickIntervalHandle: undefined as (number | undefined)
    }
}

export type ClockStoreRoot = ReturnType<typeof getDefaultClockStoreRoot>;

export function start(
    clockStore: SubStore<ClockStoreRoot>
) {

    const [getClock, setClock] = clockStore;

    if (getClock().tickIntervalHandle !== undefined) {
        try {
            clearInterval(getClock().tickIntervalHandle);
        } catch (ex) {

        }
    }

    // in real project setInterval would be behind a mockable abstraction
    const tickIntervalHandle = setInterval(() => {
        setClock((newState) => {
            newState.currentDate = new Date();;
        });
    }, 1000) as unknown as number;

    setClock((newState) => {
        newState.tickIntervalHandle = tickIntervalHandle;
        newState.currentDate = new Date()
    });
};

export function stop(
    clockStore: SubStore<ClockStoreRoot>
) {

    const [getClock, setClock] = clockStore;

    if (getClock().tickIntervalHandle === undefined) {
        return 'already stopped';
    }

    clearInterval(getClock().tickIntervalHandle);
    setClock((newState) => {
        newState.tickIntervalHandle = undefined;
    });

    return 'clock stopped';
}