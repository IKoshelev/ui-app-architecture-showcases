import { createBlankDeal } from "../Deal/Deal";
import merge from 'lodash.merge';
import { Currency } from "../../../api/CurrencyExchange.Client";

export const DealForeignCurrency: `Deal;DealForeignCurrency${string}` = 'Deal;DealForeignCurrency';

export const createBlankDealForeignCurrency = () => {

    const base =  createBlankDeal();

    return merge(base, {
        type: DealForeignCurrency,
        currencyiesAvailable: [] as Currency[],
        exchangeRate: 1,
        foreignCuurencyHandlingCoeficient: 1.02,
        businessParams: {
            downpaymentCurrency: Currency.USD
        }
    })
};

export type DealForeignCurrency = ReturnType<typeof createBlankDealForeignCurrency>
    & {
        isLoadingItemized: { [K in
            //todo generic way to flatten keys or better pattern to select keys that need to be in itemized loading registry
            (keyof ReturnType<typeof createBlankDealForeignCurrency> | keyof ReturnType<typeof createBlankDealForeignCurrency>['businessParams'])]?
            : boolean }
    };

export type DealForeignCurrencyBusinessParams = DealForeignCurrency['businessParams'];