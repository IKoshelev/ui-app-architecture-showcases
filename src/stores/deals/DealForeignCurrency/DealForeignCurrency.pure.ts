import { createBlankDeal, Deal, getFinalPrice, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, prepareRequestApprovalCall, validateDealBusinessParams } from "../Deal/Deal.pure";
import merge from 'lodash.merge';
import { Currency } from "../../../api/CurrencyExchange.Client";
import { financingClient } from "../../../api/Financing.Client";
import { getUserInputState } from "../../../generic-components/input-models/UserInput.pure";
import { ExpandDeep } from "ts-mapping-types";

export const DealForeignCurrencyTag: `Deal;DealForeignCurrency${string}` = 'Deal;DealForeignCurrency';

export const createBlankDealForeignCurrency = () => {

    const base = createBlankDeal();

    const extension = {
        type: DealForeignCurrencyTag,
        currenciesAvailable: [] as Currency[],
        exchangeRate: 1,
        businessParams: {
            foreignCurrencyHandlingCoefficient: 1.02,
            downpaymentCurrency: getUserInputState<Currency>(Currency.EUR), 
        }
    };

    return merge(base, extension) as ExpandDeep<Omit<typeof base, 'type'> & typeof extension>;
};

export type DealForeignCurrency = ReturnType<typeof createBlankDealForeignCurrency>;

export type DealForeignCurrencyBusinessParams = DealForeignCurrency['businessParams'];

export const isDealForeignCurrency = (deal: Deal): deal is DealForeignCurrency => deal.type === DealForeignCurrencyTag;

export function validateIsDealForeignCurrency(deal: Deal): asserts deal is DealForeignCurrency {
    if (isDealForeignCurrency(deal) === false) {
        throw new Error(`Deal with is ${deal.businessParams.dealId} was found, but has type: ${deal.type} instead of expected ${DealForeignCurrencyTag}`);
    }
}

getHeaderAdditionalDescription.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {
    return `${deal.businessParams.downpaymentCurrency} `;
});

getFinalPrice.override(DealForeignCurrencyTag, function (deal: DealForeignCurrency) {
    const basePriceUSD = this.base(deal);
    const finalPrice = basePriceUSD
        * deal.businessParams.foreignCurrencyHandlingCoefficient
        * deal.exchangeRate;

    return Math.round(finalPrice);
});

getMinimumPossibleDownpayment.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {
    return financingClient.getMinimumPossibleDownpaymentInForeignCurrency(
        deal.businessParams.carModelSelected.committedValue!,
        deal.businessParams.insurancePlansSelected.committedValue.map(x => x.type),
        deal.businessParams.downpaymentCurrency.committedValue
    );
});

prepareRequestApprovalCall.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {

    validateDealBusinessParams(deal.businessParams);

    const request = [
        deal.businessParams.carModelSelected.committedValue!,
        deal.businessParams.insurancePlansSelected.committedValue.map(x => x.type),
        deal.businessParams.downpayment.committedValue,
        deal.businessParams.downpaymentCurrency.committedValue
    ] as const;

    return {
        request: request as any,
        makeCall: () => financingClient.getApprovalWithForeignCurrency(...request)
    }
});