import { Currency, currencyExchangeClient } from "../../../api/CurrencyExchange.Client";
import { SubStore } from "../../../util/subStore";
import { DealForeignCurrency } from "./DealForeignCurrency.pure";
import { disable } from "../../../util/validAndDisabled";

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