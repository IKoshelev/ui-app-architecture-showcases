import { createModel } from '@rematch/core'
import type { RootModel } from '.'

export const clock = createModel<RootModel>()({
	state: {
		currentDate: new Date(),
        tickIntervalHandle: undefined as (number | undefined)
	},
    reducers: {
        setTimerHandle(state, tickIntervalHandle: number | undefined){
            state.tickIntervalHandle = tickIntervalHandle;
            return state;
        },
        setDate(state, newDate: Date){
            state.currentDate = newDate;
            return state;
        }
    },
	effects: (dispatch) => ({
		start (_, rootState) {
			if (rootState.clock.tickIntervalHandle !== undefined) {
                throw new Error("Clock already running");
            }

             // in real project setInterval would be behind a mockable abstraction
            const tickIntervalHandle = setInterval(() => {
                dispatch.clock.setDate(new Date());
            }, 1000) as unknown as number;
            
            dispatch.clock.setTimerHandle(tickIntervalHandle);
            dispatch.clock.setDate(new Date());
		},
        stop (_, rootState) {
	        if (rootState.clock.tickIntervalHandle === undefined) {
                return 'already stopped';
            }

            clearInterval(rootState.clock.tickIntervalHandle);
            dispatch.clock.setTimerHandle(undefined);

            return 'clock stopped';
        }
	}),
})
