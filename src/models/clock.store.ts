import { createModel } from '@rematch/core'
import type { RootModel } from './RootModel'

const defaultState = {
    currentDate: new Date(),
    tickIntervalHandle: undefined as (number | undefined)
};

type ClockState = typeof defaultState;

export const clock = createModel<RootModel>()({
	state: defaultState,
    reducers: {
        set(state: ClockState, diff: Partial<ClockState>) {
            Object.assign(state, diff);
            return state;
          },
    },
	effects: (dispatch) => ({
		start (_, rootState) {
			if (rootState.clock.tickIntervalHandle !== undefined) {
                try {
                    clearInterval(rootState.clock.tickIntervalHandle);
                } catch(ex) {

                }
            }

             // in real project setInterval would be behind a mockable abstraction
            const tickIntervalHandle = setInterval(() => {
                dispatch.clock.set({ currentDate: new Date()});
            }, 1000) as unknown as number;
            
            dispatch.clock.set({tickIntervalHandle: tickIntervalHandle});
            dispatch.clock.set({ currentDate: new Date()});
		},
        stop (_, rootState) {
	        if (rootState.clock.tickIntervalHandle === undefined) {
                return 'already stopped';
            }

            clearInterval(rootState.clock.tickIntervalHandle);
            dispatch.clock.set({tickIntervalHandle: undefined});

            return 'clock stopped';
        }
	}),
})
