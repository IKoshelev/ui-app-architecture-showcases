import { Currency, currencyExchangeClient } from "../../../api/CurrencyExchange.Client";
import { SubStore } from "../../../util/subStore";
import { DealForeignCurrency, validateIsDealForeignCurrency } from "./DealForeignCurrency.pure";
import { disable } from "../../../util/validAndDisabled";
import { ApprovalsState } from "../../approval.store";
import { ClockState } from "../../clock.store";
import { getDealVM } from "../Deal/Deal.vm";

export function getDealForeignCurrencyVM(
    dealStore: SubStore<DealForeignCurrency>,
    approvalStore: SubStore<ApprovalsState>,
    clockStore: SubStore<ClockState>){

    const [getDeal, setDeal] = dealStore;

    validateIsDealForeignCurrency(getDeal());

    const baseVM = getDealVM(dealStore, approvalStore, clockStore) 

    // only type-change is needed
    return baseVM as Omit<typeof baseVM, 'state'> & {
        state: typeof getDeal
    };
}

export async function setCurrencyAndReloadExchangeRate(
    dealStore: SubStore<DealForeignCurrency>,
    currency: Currency) {

    const [getDeal, setDeal] = dealStore;
  
    setDeal(x => {
        x.businessParams.downpaymentCurrency.committedValue = currency;
    });

    disable(setDeal, 'loading:excahange-rate', async () => {
        const exchangeRate = await currencyExchangeClient.getExchangeRate(currency);

        setDeal(x => {
            x.exchangeRate = exchangeRate;
        });
    });
}