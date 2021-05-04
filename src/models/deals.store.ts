import { createModel } from '@rematch/core'
import { loadNewDeal, Deal } from './deals/deal';
import type { RootModel } from '.'
import moment from 'moment';
import { NumericInputState } from '../generic-components/numeric-input';
import { carInvenotryClient } from '../api/CarInventory.Client';
import { carInsuranceClient } from '../api/CarInsurance.Client';
import { financingClient } from '../api/Financing.Client';

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
    },

    setInDeal(state, dealId: number, diff: Partial<Deal>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal, diff);
      return state;
    },

    setIsLoadingItemized(state, dealId: number, diff: Partial<Deal['isLoadingItemized']>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal.isLoadingItemized, diff);
      return state;
    },

    setInBusinessParams(state, dealId: number, diff: Partial<Deal['businessParams']>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal.businessParams, diff);

      return state;
    }

  },
  effects: (dispatch) => ({

    async loadNewDeal(_, rootState) {
      dispatch.deals.set({newDealIsLoading: true});

      dispatch.deals.pushNewDeal(await loadNewDeal());

      dispatch.deals.set({newDealIsLoading: false});
    },

    async reloadAvailableCarModels(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, {carModelsAvailable: true});

      const carModels = await carInvenotryClient.getAvaliableCarModels();

      dispatch.deals.setInDeal(dealId, {carModelsAvailable: carModels});

      dispatch.deals.setIsLoadingItemized(dealId, {carModelsAvailable: false});
    },

    async reloadAvailableInsurancePlans(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, {insurancePlansAvailable: true});

      const insurancePlans = await carInsuranceClient.getAvaliableInsurancePlans();

      dispatch.deals.setInDeal(dealId, {insurancePlansAvailable: insurancePlans});

      dispatch.deals.setIsLoadingItemized(dealId, {insurancePlansAvailable: false});
    },

    async setMinimumPossibleDownpayment(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, {downpayment: true});

      const { businessParams } = rootState.deals.deals.find(x => x.businessParams.dealId === dealId)!;
      
      if(!businessParams.carModelSelected) {
        throw new Error("Can't get minimum payments if no car model selected.");
      }
      
      const minPayment = await financingClient.getMinimumPossibleDownpayment(
        businessParams.carModelSelected,
        businessParams.insurancePlansSelected.map(x => x.type)
      );

      dispatch.deals.setInBusinessParams(dealId, {downpayment: minPayment});

      dispatch.deals.setIsLoadingItemized(dealId, {downpayment: false});
    },

    async requestApproval(dealId: number, rootState) {

    }

  })
});

export function getActiveDeal(state: DealsState) {
  return state.deals.find(x => x.businessParams.dealId === state.activeDealId);
}