import { Currency, currencyExchangeClient } from "../../../api/CurrencyExchange.Client";
import { SubStore } from "../../../util/subStore";
import { DealForeignCurrency, validateIsDealForeignCurrency } from "./DealForeignCurrency.pure";
import { runFlow } from "../../../util/validation-flows-messages";
import { ApprovalsStoreRoot } from "../../approval.store";
import { ClockStoreRoot } from "../../clock.store";
import { getDealVM } from "../Deal/Deal.vm";
import { DealsStoreRoot } from "../../deals.store";
import { getUserInputVM } from "../../../generic-components/input-models/UserInput.vm";
import { getDeeperSubStore } from "../../../util/subStore";
import merge from "lodash.merge";

export function getDealForeignCurrencyVM<T extends DealForeignCurrency>(
    dealStore: SubStore<T>,
    dealsStore: SubStore<DealsStoreRoot>,
    approvalStore: SubStore<ApprovalsStoreRoot>,
    clockStore: SubStore<ClockStoreRoot>){

    const [getDeal, setDeal] = dealStore;

    validateIsDealForeignCurrency(getDeal());

    const baseVM = getDealVM(dealStore, dealsStore, approvalStore, clockStore);

    const extension = {
        subVMS: {
            downpaymentCurrency: getUserInputVM(
                getDeeperSubStore(dealStore, x => x.businessParams.downpaymentCurrency),
                (m) => m.toString(),
                (v) => ({ status: "parsed", parsed: v}),
                (s) => setCurrencyAndReloadExchangeRate(dealStore, s.committedValue)),
        }
    }

    return merge(baseVM, extension);
}

export async function setCurrencyAndReloadExchangeRate(
    dealStore: SubStore<DealForeignCurrency>,
    currency: Currency) {

    const [getDeal, setDeal] = dealStore;
  
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

export type DealForeignCurrencyVM = ReturnType<typeof getDealForeignCurrencyVM>;