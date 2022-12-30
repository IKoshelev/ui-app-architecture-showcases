import { createStore, produce } from "solid-js/store";

const defaultState = {
    currentDate: new Date(),
    tickIntervalHandle: undefined as (number | undefined)
};

export type ClockState = typeof defaultState;

function createClockStore() {
    const [storeState, setStoreState] = createStore(defaultState);

    return {
        state: storeState,
        commands: {
            start() {
        
                if (storeState.tickIntervalHandle !== undefined) {
                    try {
                        clearInterval(storeState.tickIntervalHandle);
                    } catch (ex) {
        
                    }
                }
        
                // in real project setInterval would be behind a mockable abstraction
                const tickIntervalHandle = setInterval(() => {
                    setStoreState(
                        produce((newState) => {
                            newState.currentDate = new Date();;
                        })
                      );
                }, 1000) as unknown as number;
        
                setStoreState(
                    produce((newState) => {
                        newState.tickIntervalHandle = tickIntervalHandle;
                        newState.currentDate = new Date()
                    })
                  );
            },     
            stop() {
                
                if (storeState.tickIntervalHandle === undefined) {
                    return 'already stopped';
                }
        
                clearInterval(storeState.tickIntervalHandle);
                setStoreState(
                    produce((newState) => {
                        newState.tickIntervalHandle = undefined;
                    })
                  );
        
                return 'clock stopped';
            }
        }
    }
}

export type ClockStore = ReturnType<typeof createClockStore>;

export const clockStore = createClockStore();