import { createModel } from '@rematch/core'
import { loadNewDeal, Deal } from './deals/deal';
import type { RootModel } from '.'
import moment from 'moment';
import { NumericInputState } from '../generic-components/numeric-input';

//this is needed to be able to type generic `set` reducer
const defaultState = {
  deals: [] as Deal[],
  activeDealId: undefined as number | undefined,
  newDealIsLoading: false
};

type DealsState = typeof defaultState;

export const deals = createModel<RootModel>()({
  state: defaultState,
  reducers: {

    set(state: DealsState, diff: Partial<DealsState>) {
      Object.assign(state, diff);
      return state;
    },

    pushNewDeal(state, deal: Deal, setActive = true) {
      state.deals.push(deal);
      if(setActive) {
        state.activeDealId = deal.businessParams.dealId;
      }

      //todo remove
      deal.approval = {
        isApproved: true,
        expiration: moment(new Date()).add(3, 'seconds').toDate(),
        approvalToken: ''
      }
      deal.businessParams.carModelSelected = deal.carModelsAvailable[0];

      return state;
    },

    removeDeal(state, dealId: number) {
      state.deals = state.deals.filter(x => x.businessParams.dealId != dealId);
      return state;
    },

    updateDownpayment(state, dealId: number, [newModelState, newIpnutState]: [number, NumericInputState]) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      deal.businessParams.downpayment = newModelState;
      deal.downplaymentInputState = newIpnutState;
      return state;
    }

  },
  effects: (dispatch) => ({

    async loadNewDeal(_, rootState) {
      dispatch.deals.set({newDealIsLoading: true});

      dispatch.deals.pushNewDeal(await loadNewDeal());

      dispatch.deals.set({newDealIsLoading: false});
    }

  })
});

export function getActiveDeal(state: DealsState) {
  return state.deals.find(x => x.businessParams.dealId === state.activeDealId);
}