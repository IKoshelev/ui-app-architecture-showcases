import { 
  Deal, 
  validateDealBusinessParams, 
  computeDealDerrivations, 
  createBlankDeal, 
  DealTag, 
  getMinimumPossibleDownpayment 
} from './Deal/Deal';
import type { ClockStore } from "../clock.store";
import { ApprovalsStore, ApprovalsEffects } from '../approval.store';
import { setCurrentUnsavedValue, tryCommitValue } from '../../generic-components/NumericInput';
import { carInvenotryClient } from '../../api/CarInventory.Client';
import { carInsuranceClient } from '../../api/CarInsurance.Client';
import { financingClient } from '../../api/Financing.Client';
import { 
  createBlankDealForeignCurrency, 
  DealForeignCurrency, 
  DealForeignCurrencyTag, 
  getDealForeignCurrencyById, 
  isDealForeignCurrency 
} from './DealForeignCurrency/DealForeignCurrency';
import { Currency, currencyExchangeClient } from '../../api/CurrencyExchange.Client';
import { assert, DiffWithGuard, guard } from '../../util/assert';
import { merge } from 'lodash';
import { writable, get } from "svelte/store";
import { bindToStore, makeApplyDiff } from '../../util/genericReducers';


//this is needed to be able to type generic `set` reducer
const defaultState = {
  nextDealId: 1,
  deals: [] as Deal[],
  activeDealId: undefined as number | undefined,
  newDealIsLoading: false
};

export type DealsState = typeof defaultState;

export const dealsReducers = {
    //much more generazlied form of set
    mergeWithGuard(state: DealsState, dealId: number, payload: DiffWithGuard<Deal>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      assert(payload.guard(deal));
      merge(deal, payload.diff);
    },

    pushNewDeal(state: DealsState, deal: Deal, setActive = true) {
      state.deals.push(deal);
      if (setActive) {
        state.activeDealId = deal.businessParams.dealId;
      }

      deal.businessParams.carModelSelected = deal.carModelsAvailable[0];

    },

    removeDeal(state: DealsState, dealId: number) {

      if (dealId === state.activeDealId) {
        const index = state.deals.findIndex(x => x.businessParams.dealId === dealId);
        const newActiveDealId = state.deals[index - 1]?.businessParams.dealId
          ?? state.deals[index + 1]?.businessParams.dealId;
        console.log(newActiveDealId);
        state.activeDealId = newActiveDealId;
      }

      state.deals = state.deals.filter(x => x.businessParams.dealId !== dealId);
    },

    updateDownpaymentInputValue(state: DealsState, dealId: number, newValue: string) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      deal.downplaymentInputState = setCurrentUnsavedValue(deal.downplaymentInputState, newValue);
    },

    tryCommitDownpaymentInputValue(state: DealsState, dealId: number) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      let res = tryCommitValue(deal.downplaymentInputState, deal.businessParams.downpayment);
      deal.downplaymentInputState = res.newInputState;
      deal.businessParams.downpayment = res.newModelState ?? 0;
    },

    setInDeal(state: DealsState, dealId: number, diff: Partial<Deal>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal, diff);
    },

    setIsLoadingItemized(state: DealsState, dealId: number, diff: Partial<Deal['isLoadingItemized']>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal.isLoadingItemized, diff);
    },

    setInBusinessParams(state: DealsState, dealId: number, diff: Partial<Deal['businessParams']>) {
      const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;
      Object.assign(deal.businessParams, diff);
    },
}

function createStore() {
  const store = writable(defaultState);

  return {
    subscribe: store.subscribe,
    applyDiff: makeApplyDiff(store.update),

    ...bindToStore(store, dealsReducers)
  }
}

export type DealsStore = ReturnType<typeof createStore>;

export const dealsEffects = {

  async loadNewDeal(dealsStore: DealsStore) {
    dealsStore.applyDiff({ newDealIsLoading: true });

    const newDeal = createBlankDeal();

    const state = get(dealsStore);
    newDeal.businessParams.dealId = state.nextDealId;

    dealsStore.applyDiff({ nextDealId: state.nextDealId + 1 });

    await Promise.all([
      carInvenotryClient.getAvaliableCarModels().then(x => newDeal.carModelsAvailable = x),
      carInsuranceClient.getAvaliableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x)
    ]);

    dealsStore.pushNewDeal(newDeal);

    dealsStore.applyDiff({ newDealIsLoading: false });
  },

  async loadNewDealForeignCurrency(dealsStore: DealsStore) {
    dealsStore.applyDiff({ newDealIsLoading: true });

    const newDeal = createBlankDealForeignCurrency();

    const state = get(dealsStore);
    newDeal.businessParams.dealId = state.nextDealId;

    dealsStore.applyDiff({ nextDealId: state.nextDealId + 1 });

    await Promise.all([
      carInvenotryClient.getAvaliableCarModels().then(x => newDeal.carModelsAvailable = x),
      carInsuranceClient.getAvaliableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x),
      currencyExchangeClient.getCurrencies().then(x => newDeal.currenciesAvailable = x),
      currencyExchangeClient.getExchangeRate(newDeal.businessParams.downpaymentCurrency).then(x => newDeal.exchangeRate = x)
    ]);

    dealsStore.pushNewDeal(newDeal);

    dealsStore.applyDiff({ newDealIsLoading: false });
  },

  async reloadAvailableCarModels(dealsStore: DealsStore, dealId: number) {
    dealsStore.setIsLoadingItemized(dealId, { carModelsAvailable: true });

    const carModels = await carInvenotryClient.getAvaliableCarModels();

    dealsStore.setInDeal(dealId, { carModelsAvailable: carModels });

    dealsStore.setIsLoadingItemized(dealId, { carModelsAvailable: false });
  },

  async reloadAvailableInsurancePlans(dealsStore: DealsStore, dealId: number) {
    dealsStore.setIsLoadingItemized(dealId, { insurancePlansAvailable: true });

    const insurancePlans = await carInsuranceClient.getAvaliableInsurancePlans();

    dealsStore.setInDeal(dealId, { insurancePlansAvailable: insurancePlans });

    dealsStore.setIsLoadingItemized(dealId, { insurancePlansAvailable: false });
  },

  async setMinimumPossibleDownpayment(dealsStore: DealsStore, dealId: number) {
    dealsStore.setIsLoadingItemized(dealId, { downpayment: true });

    const state = get(dealsStore);
    const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;

    validateDealBusinessParams(deal.businessParams);

    const minPayment = await getMinimumPossibleDownpayment(deal);

    dealsStore.setInBusinessParams(dealId, { downpayment: minPayment });

    const clearedDownpaymentInput = setCurrentUnsavedValue(deal.downplaymentInputState, undefined, true);
    dealsStore.setInDeal(dealId, { downplaymentInputState: clearedDownpaymentInput })

    dealsStore.setIsLoadingItemized(dealId, { downpayment: false });
  },

  async requestApproval(
    dealsStore: DealsStore, 
    approvalsStore: ApprovalsStore,
    approvalsEffects: ApprovalsEffects,
    dealId: number) {

    const state = get(dealsStore);
    const deal = state.deals.find(x => x.businessParams.dealId === dealId)!;

    validateDealBusinessParams(deal.businessParams);

    await approvalsEffects.requestApproval(approvalsStore, deal);
  },

  async finalizeDeal(
    dealsStore: DealsStore, 
    approvalsState: ApprovalsStore,
    clockState: ClockStore,
    dealId: number) {

    const approval = computeDealDerrivations(
                        get(dealsStore),
                        get(approvalsState),
                        get(clockState),
                        dealId)
                          .approval;

    if (approval?.isApproved !== true) {
      throw new Error("Attempt to finalize deal without approval.");
    }

    dealsStore.setIsLoadingItemized(dealId, { isDealFinalized: true });

    const res = await financingClient.finalizeFinancing(approval.approvalToken);

    dealsStore.setInBusinessParams(dealId, { isDealFinalized: res });

    dealsStore.setIsLoadingItemized(dealId, { isDealFinalized: false });
  },

  async setCurrncyAndReloadExchangeRate(dealsStore: DealsStore, [dealId, currency]: [dealId: number, curreny: Currency]) {

    //for deal type validation
    getDealForeignCurrencyById(get(dealsStore), dealId);

    dealsStore.mergeWithGuard(dealId, guard(isDealForeignCurrency, {
      businessParams: {
        downpaymentCurrency: currency
      },
      isLoadingItemized: {
        exchangeRate: true
      }
    }));

    const exchangeRate = await currencyExchangeClient.getExchangeRate(currency);

    dealsStore.mergeWithGuard(dealId, guard(isDealForeignCurrency, {
      exchangeRate: exchangeRate,
      isLoadingItemized: {
        exchangeRate: false
      }
    }));
  }
}

export const dealsStore = createStore();