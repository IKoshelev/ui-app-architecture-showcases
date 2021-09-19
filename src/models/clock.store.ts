import { writable, get } from "svelte/store";
import { makeApplyDiff } from "../util/genericReducers";

const defaultState = {
    currentDate: new Date(),
    tickIntervalHandle: undefined as (number | undefined)
};

export type ClockState = typeof defaultState;

function createStore() {
    const { subscribe, set, update } = writable(defaultState);

    return {
        subscribe,

        applyDiff: makeApplyDiff(update)

    }
}

export type ClockStore = ReturnType<typeof createStore>;

export const clockEffects = {

    start(clockStore: ClockStore) {

        const state = get(clockStore);

        if (state.tickIntervalHandle !== undefined) {
            try {
                clearInterval(state.tickIntervalHandle);
            } catch (ex) {

            }
        }

        // in real project setInterval would be behind a mockable abstraction
        const tickIntervalHandle = setInterval(() => {
            clockStore.applyDiff({ currentDate: new Date() });
        }, 1000) as unknown as number;

        clockStore.applyDiff({
            tickIntervalHandle: tickIntervalHandle,
            currentDate: new Date()
        });
    },

    stop(clockStore: ClockStore) {

        const state = get(clockStore);

        if (state.tickIntervalHandle === undefined) {
            return 'already stopped';
        }

        clearInterval(state.tickIntervalHandle);
        clockStore.applyDiff({ tickIntervalHandle: undefined });

        return 'clock stopped';
    }
}

export const clockStore = createStore();