import { createModel } from '@rematch/core'
import { Deal, getApprovalRequestArgs, validateDealBusinessParams, getCachedSelectorDealDerrivations, createBlankDeal } from './Deal/Deal';
import type { RootModel } from '../RootModel'
import { setCurrentUnsavedValue, tryCommitValue } from '../../generic-components/NumericInput';
import { carInvenotryClient } from '../../api/CarInventory.Client';
import { carInsuranceClient } from '../../api/CarInsurance.Client';
import { financingClient } from '../../api/Financing.Client';
import { createBlankDealForeignCurrency } from './DealForeignCurrency/DealForeignCurrency';
import { currencyExchangeClient } from '../../api/CurrencyExchange.Client';

//this is needed to be able to type generic `set` reducer
const defaultState = {
  nextDealId: 1,
  deals: [] as Deal[],
  activeDealId: undefined as number | undefined,
  newDealIsLoading: false
};

export type DealsState = typeof defaultState;

export const deals = createModel<RootModel>()({
  state: defaultState,
  reducers: {

    set(state: DealsState, diff: Partial<DealsState>) {
      Object.assign(state, diff);
      return state;
    },

    pushNewDeal(state, deal: Deal, setActive = true) {
      state.deals.push(deal);
      if (setActive) {
        state.activeDealId = deal.businessParams.dealId;
      }

      deal.businessParams.carModelSelected = deal.carModelsAvailable[0];

      return state;
    },

    removeDeal(state, dealId: number) {

      if (dealId === state.activeDealId) {
        const index = state.deals.findIndex(x => x.businessParams.dealId === dealId);
        const newActiveDealId = state.deals[index - 1]?.businessParams.dealId
          ?? state.deals[index + 1]?.businessParams.dealId;
        console.log(newActiveDealId);
        state.activeDealId = newActiveDealId;
      }

      state.deals = state.deals.filter(x => x.businessParams.dealId !== dealId);

      return state;
    },

    updateDownpaymentInputValue(state, dealId: number, newValue: string) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      deal.downplaymentInputState = setCurrentUnsavedValue(deal.downplaymentInputState, newValue);
      return state;
    },

    tryCommitDownpaymentInputValue(state, dealId: number) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      let res = tryCommitValue(deal.downplaymentInputState, deal.businessParams.downpayment);
      deal.downplaymentInputState = res.newInputState;
      deal.businessParams.downpayment = res.newModelState ?? 0;
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
      dispatch.deals.set({ newDealIsLoading: true });

      const newDeal = createBlankDeal();

      newDeal.businessParams.dealId = rootState.deals.nextDealId;

      dispatch.deals.set({nextDealId: rootState.deals.nextDealId + 1});
  
      await Promise.all([
          carInvenotryClient.getAvaliableCarModels().then(x => newDeal.carModelsAvailable = x),
          carInsuranceClient.getAvaliableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x)
      ]);

      dispatch.deals.pushNewDeal(newDeal);

      dispatch.deals.set({ newDealIsLoading: false });
    },

    async loadNewDealForeignCurrency(_, rootState) {
      dispatch.deals.set({ newDealIsLoading: true });

      const newDeal = createBlankDealForeignCurrency();

      newDeal.businessParams.dealId = rootState.deals.nextDealId;

      dispatch.deals.set({nextDealId: rootState.deals.nextDealId + 1});
  
      await Promise.all([
          carInvenotryClient.getAvaliableCarModels().then(x => newDeal.carModelsAvailable = x),
          carInsuranceClient.getAvaliableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x),
          currencyExchangeClient.getCurrencies().then(x => newDeal.currencyiesAvailable = x)
      ]);

      dispatch.deals.pushNewDeal(newDeal);

      dispatch.deals.set({ newDealIsLoading: false });
    },

    async reloadAvailableCarModels(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, { carModelsAvailable: true });

      const carModels = await carInvenotryClient.getAvaliableCarModels();

      dispatch.deals.setInDeal(dealId, { carModelsAvailable: carModels });

      dispatch.deals.setIsLoadingItemized(dealId, { carModelsAvailable: false });
    },

    async reloadAvailableInsurancePlans(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, { insurancePlansAvailable: true });

      const insurancePlans = await carInsuranceClient.getAvaliableInsurancePlans();

      dispatch.deals.setInDeal(dealId, { insurancePlansAvailable: insurancePlans });

      dispatch.deals.setIsLoadingItemized(dealId, { insurancePlansAvailable: false });
    },

    async setMinimumPossibleDownpayment(dealId: number, rootState) {
      dispatch.deals.setIsLoadingItemized(dealId, { downpayment: true });

      const { downplaymentInputState, businessParams } = rootState.deals.deals.find(x => x.businessParams.dealId === dealId)!;

      validateDealBusinessParams(businessParams);

      const minPayment = await financingClient.getMinimumPossibleDownpayment(
        businessParams.carModelSelected,
        businessParams.insurancePlansSelected.map(x => x.type)
      );

      dispatch.deals.setInBusinessParams(dealId, { downpayment: minPayment });

      const clearedDownpaymentInput = setCurrentUnsavedValue(downplaymentInputState, undefined, true);
      dispatch.deals.setInDeal(dealId, {downplaymentInputState: clearedDownpaymentInput})

      dispatch.deals.setIsLoadingItemized(dealId, { downpayment: false });
    },

    async requestApproval(dealId: number, rootState) {

      const { businessParams } = rootState.deals.deals.find(x => x.businessParams.dealId === dealId)!;

      validateDealBusinessParams(businessParams);

      await dispatch.approvals.requestApproval({
        dealId: businessParams.dealId,
        args: getApprovalRequestArgs(businessParams)
      });
    },

    async finalizeDeal(dealId: number, rootState) {

      const approval = getCachedSelectorDealDerrivations(dealId)(rootState).approval;

      if (approval?.isApproved !== true) {
        throw new Error("Attempt to finalize deal without approval.");
      }

      dispatch.deals.setIsLoadingItemized(dealId, { isDealFinalized: true });

      const res = await financingClient.finalizeFinancing(approval.approvalToken);

      dispatch.deals.setInBusinessParams(dealId, { isDealFinalized: res });

      dispatch.deals.setIsLoadingItemized(dealId, { isDealFinalized: false });
    }

  })
});