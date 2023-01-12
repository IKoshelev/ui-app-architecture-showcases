import { createBlankDeal, Deal } from './deals/Deal/Deal';
import { carInventoryClient } from '../api/CarInventory.Client';
import { carInsuranceClient } from '../api/CarInsurance.Client';
import { createBlankDealForeignCurrency, DealForeignCurrency, DealForeignCurrencyTag } from './deals/DealForeignCurrency/DealForeignCurrency';
import { currencyExchangeClient } from '../api/CurrencyExchange.Client';
import { getDeeperSubStore, SubStore } from '../util/subStore';

export function getDefaultDealsStoreRoot(){
  return {
    nextDealId: 1,
    deals: [] as Deal[],
    activeDealId: undefined as number | undefined,
    newDealIsLoading: false
  };
}

export type DealsStoreRoot = ReturnType<typeof getDefaultDealsStoreRoot>;

export function dealSubstoreById(
  store: SubStore<DealsStoreRoot>,
  dealId: number){
  return getDeeperSubStore(store, 
    x => x.deals.find(x => x.businessParams.dealId === dealId)!)
}

export function getActiveDealSubstore(store: SubStore<DealsStoreRoot>){
  return getDeeperSubStore(store, s => 
    s.deals.find(x => x.businessParams.dealId === s.activeDealId)!);
}

export function pushNewDeal(state: DealsStoreRoot, deal: Deal, setActive = true) {
  state.deals.push(deal);
  if (setActive) {
    state.activeDealId = deal.businessParams.dealId;
  }

  // deal.businessParams.carModelSelected.committedValue = deal.carModelsAvailable[0];
}

export function removeDeal(state: DealsStoreRoot, dealId: number) {

  const index = state.deals.findIndex(x => x.businessParams.dealId === dealId);

  if (dealId === state.activeDealId) {
    const newActiveDealId = state.deals[index - 1]?.businessParams.dealId
      ?? state.deals[index + 1]?.businessParams.dealId;
    console.log(newActiveDealId);
    state.activeDealId = newActiveDealId;
  }

  if(index !== -1){
    state.deals.splice(index, 1);
  }
}

export async function loadNewDeal(
  dealsStore: SubStore<DealsStoreRoot>) {

  const [approvals, setApprovals] = dealsStore;
  
  setApprovals(x => x.newDealIsLoading = true);

  const newDeal = createBlankDeal();

  newDeal.businessParams.dealId =approvals.nextDealId;

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
  dealsStore: SubStore<DealsStoreRoot>) {

  const [approvals, setApprovals] = dealsStore;

  setApprovals(x => x.newDealIsLoading = true);

  const newDeal = createBlankDealForeignCurrency();

  newDeal.businessParams.dealId =approvals.nextDealId;

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

export function isDealForeignCurrencyStore(
  store: SubStore<Deal>
): store is SubStore<DealForeignCurrency> {
  return store[0].type.startsWith(DealForeignCurrencyTag);
}
