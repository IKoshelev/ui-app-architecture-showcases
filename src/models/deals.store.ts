import { createModel } from '@rematch/core'
import { loadNewDeal, Deal } from './deals/deal';
import type { RootModel } from '.'

export const deals = createModel<RootModel>()({
  state: {
    deals: [] as Deal[],
    activeDeal: undefined as Deal | undefined,
    newDealIsLoading: false
  },
  reducers: {

    pushNewDeal(state, deal: Deal) {
      state.deals.push(deal);
      return state;
    },

    setLoading(state, newState: boolean) {
      state.newDealIsLoading = newState;
      return state;
    },

  },
  effects: (dispatch) => ({

    async loadNewDeal(_, rootState) {
      dispatch.deals.setLoading(true);

      dispatch.deals.pushNewDeal(await loadNewDeal());

      dispatch.deals.setLoading(false);
    }

  })
});