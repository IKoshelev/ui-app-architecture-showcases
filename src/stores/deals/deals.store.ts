import { createBlankDeal, Deal } from './Deal/Deal.pure';
import { carInventoryClient } from '../../api/CarInventory.Client';
import { carInsuranceClient } from '../../api/CarInsurance.Client';
import { createBlankDealForeignCurrency } from './DealForeignCurrency/DealForeignCurrency.pure';
import { currencyExchangeClient } from '../../api/CurrencyExchange.Client';
import { SubStore } from '../../util/subStore';

const defaultState = {
  nextDealId: 1,
  deals: [] as Deal[],
  activeDealId: undefined as number | undefined,
  newDealIsLoading: false
};

export type DealsState = typeof defaultState;

export function pushNewDeal(state: DealsState, deal: Deal, setActive = true) {
  state.deals.push(deal);
  if (setActive) {
    state.activeDealId = deal.businessParams.dealId;
  }

  deal.businessParams.carModelSelected.committedValue = deal.carModelsAvailable[0];
}

export function removeDeal(state: DealsState, dealId: number) {

  if (dealId === state.activeDealId) {
    const index = state.deals.findIndex(x => x.businessParams.dealId === dealId);
    const newActiveDealId = state.deals[index - 1]?.businessParams.dealId
      ?? state.deals[index + 1]?.businessParams.dealId;
    console.log(newActiveDealId);
    state.activeDealId = newActiveDealId;
  }

  state.deals = state.deals.filter(x => x.businessParams.dealId !== dealId);

  return state;
}

export async function loadNewDeal(
  dealsStore: SubStore<DealsState>) {

  const [getApprovals, setApprovals] = dealsStore;
  
  setApprovals(x => x.newDealIsLoading = true);

  const newDeal = createBlankDeal();

  newDeal.businessParams.dealId = getApprovals().nextDealId;

  setApprovals(x => x.nextDealId += 1);

  await Promise.all([
    carInventoryClient.getAvailableCarModels().then(x => newDeal.carModelsAvailable = x),
    carInsuranceClient.getAvailableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x)
  ]);

  setApprovals(x => {
    pushNewDeal(x, newDeal);
    x.newDealIsLoading = false;
  });
}

export async function loadNewDealForeignCurrency(
  dealsStore: SubStore<DealsState>) {

  const [getApprovals, setApprovals] = dealsStore;

  setApprovals(x => x.newDealIsLoading = true);

  const newDeal = createBlankDealForeignCurrency();

  newDeal.businessParams.dealId = getApprovals().nextDealId;

  setApprovals(x => x.nextDealId += 1);

  await Promise.all([
    carInventoryClient.getAvailableCarModels().then(x => newDeal.carModelsAvailable = x),
    carInsuranceClient.getAvailableInsurancePlans().then(x => newDeal.insurancePlansAvailable = x),
    currencyExchangeClient.getCurrencies().then(x => newDeal.currenciesAvailable = x),
    currencyExchangeClient.getExchangeRate(newDeal.businessParams.downpaymentCurrency.committedValue).then(x => newDeal.exchangeRate = x)
  ]);

  setApprovals(x => {
    pushNewDeal(x, newDeal);
    x.newDealIsLoading = false;
  });
}
