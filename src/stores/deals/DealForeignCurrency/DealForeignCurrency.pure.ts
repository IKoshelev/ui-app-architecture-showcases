import { createBlankDeal, Deal, getFinalPrice, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, prepareRequestApprovalCall, validateDealBusinessParams } from "../Deal/Deal.pure";
import merge from 'lodash.merge';
import { Currency } from "../../../api/CurrencyExchange.Client";
import { assertNarrowPropType } from "../../../util/assert";
import { financingClient } from "../../../api/Financing.Client";
import { getUserInputState } from "../../../generic-components/input-models/UserInput.pure";

export const DealForeignCurrencyTag: `Deal;DealForeignCurrency${string}` = 'Deal;DealForeignCurrency';

export const createBlankDealForeignCurrency = () => {

    const base = createBlankDeal();

    return merge(base, {
        type: DealForeignCurrencyTag,
        currenciesAvailable: [] as Currency[],
        exchangeRate: 1,
        businessParams: {
            foreignCurrencyHandlingCoefficient: 1.02,
            downpaymentCurrency: getUserInputState<Currency, string>(Currency.EUR), 
        }
    })
};

export type DealForeignCurrency = ReturnType<typeof createBlankDealForeignCurrency>;

export type DealForeignCurrencyBusinessParams = DealForeignCurrency['businessParams'];

export const isDealForeignCurrency = (deal: Deal): deal is DealForeignCurrency => deal.type === DealForeignCurrencyTag;

export function validateIsDealForeignCurrency(deal: Deal): asserts deal is DealForeignCurrency {
    if (isDealForeignCurrency(deal) === false) {
        throw new Error(`Deal with is ${deal.businessParams.dealId} was found, but has type: ${deal.type} instead of expected ${DealForeignCurrencyTag}`);
    }
}

// export const getCachedSelectorDealForeignCurrencyDerrivations = memoizeSelectorCreatorIndeffinitely((dealId: number) => {

//     const baseDerrivationsSelector = getCachedSelectorDealDerrivations(dealId);

//     const selector = createSelector(

//         (state: RootState) => {
//             const baseDerrivations = baseDerrivationsSelector(state);
//             //typing change turned our to be the only difference
//             assertNarrowPropType(baseDerrivations, 'deal', isDealForeignCurrency);
//             return baseDerrivations;
//         },

//         (base) => (
//             //(console.log(`recalc ${dealId}`,[base])), 
//             {
//                 ...base,
//             }));

//     return selector;
// });

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