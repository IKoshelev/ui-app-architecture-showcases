import { Currency, currencyExchangeClient } from "../../../api/CurrencyExchange.Client";
import { SubStore } from "../../../util/subStore";
import { DealForeignCurrency, validateIsDealForeignCurrency } from "./DealForeignCurrency";
import { runFlow } from "../../../util/validation-flows-messages";
import { ApprovalsStoreRoot } from "../../approval.store";
import { ClockStoreRoot } from "../../clock.store";
import { dealVM } from "../Deal/Deal.vm";
import { DealsStoreRoot } from "../../deals.store";
import { getUserInputVM } from "../../../generic-components/input-models/UserInput.vm";
import { getDeeperSubStore } from "../../../util/subStore";
import merge from "lodash.merge";

export function dealForeignCurrencyVM<T extends DealForeignCurrency>(
    dealStore: SubStore<T>,
    dealsStore: SubStore<DealsStoreRoot>,
    approvalStore: SubStore<ApprovalsStoreRoot>,
    clockStore: SubStore<ClockStoreRoot>){

    const [deal, setDeal] = dealStore;

    validateIsDealForeignCurrency(deal);

    const baseVM = dealVM(dealStore, dealsStore, approvalStore, clockStore);

    const extension = {
        subVMS: {
            downpaymentCurrency: getUserInputVM(
                getDeeperSubStore(dealStore, x => x.businessParams.downpaymentCurrency),
                (v) => ({ status: "parsed", parsed: v}),
                (m) => m.toString(),
                (s) => setCurrencyAndReloadExchangeRate(dealStore, s.committedValue)),
        }
    }

    return merge(baseVM, extension);
}

export async function setCurrencyAndReloadExchangeRate(
    dealStore: SubStore<DealForeignCurrency>,
    currency: Currency) {

    const [deal, setDeal] = dealStore;
  
    setDeal(x => {
        x.businessParams.downpaymentCurrency.committedValue = currency;
    });

    runFlow(setDeal, 'loading:exchange-rate', async () => {
        const exchangeRate = await currencyExchangeClient.getExchangeRate(currency);

        setDeal(x => {
            x.exchangeRate = exchangeRate;
        });
    });
}

export type DealForeignCurrencyVM = ReturnType<typeof dealForeignCurrencyVM>;