import { createBlankDeal, Deal, computeDealDerrivations, getFinalPrice, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, prepareRequstApprovalCall, validateDealBusinessParams } from "../Deal/Deal";
import merge from 'lodash.merge';
import { Currency } from "../../../api/CurrencyExchange.Client";
import type { DealsState } from "../deals.store";
import type { ApprovalsState } from "../../approval.store";
import type { ClockState } from "../../clock.store";
import { assertNarrowPropType } from "../../../util/assert";
import { financingClient } from "../../../api/Financing.Client";

export const DealForeignCurrencyTag: `Deal;DealForeignCurrency${string}` = 'Deal;DealForeignCurrency';

export const createBlankDealForeignCurrency = () => {

    const base = createBlankDeal();

    return merge(base, {
        type: DealForeignCurrencyTag,
        currenciesAvailable: [] as Currency[],
        exchangeRate: 1,
        businessParams: {
            foreignCuurencyHandlingCoeficient: 1.02,
            downpaymentCurrency: Currency.EUR
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

export const isDealForeignCurrency = (deal: Deal): deal is DealForeignCurrency => deal.type === DealForeignCurrencyTag;

export function validateIsDealForeignCurrency(deal: Deal): asserts deal is DealForeignCurrency {
    if (isDealForeignCurrency(deal) === false) {
        throw new Error(`Deal with is ${deal.businessParams.dealId} was found, but has type: ${deal.type} instead of expected ${DealForeignCurrencyTag}`);
    }
}

export function getDealForeignCurrencyById(dealsState: DealsState, dealId: number) {
    const deal = dealsState.deals.find(x => x.businessParams.dealId === dealId)!;
    validateIsDealForeignCurrency(deal);
    return deal;
}

export function computeDealForeignCurrencyDerrivations(
    dealsState: DealsState,
    approvalsState: ApprovalsState,
    clockState: ClockState,
    dealId: number) {

    const baseDerrivationsSelector = computeDealDerrivations(
        dealsState,
        approvalsState,
        clockState,
        dealId);

    assertNarrowPropType(baseDerrivationsSelector, 'deal', isDealForeignCurrency);

    //additional derrivations for DealForeignCurrency will be here when needed

    return baseDerrivationsSelector;
};

getHeaderAdditionalDescription.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {
    return `${deal.businessParams.downpaymentCurrency} `;
});

getFinalPrice.override(DealForeignCurrencyTag, function (deal: DealForeignCurrency) {
    const basePriceUSD = this.base(deal);
    const finalPrice = basePriceUSD
        * deal.businessParams.foreignCuurencyHandlingCoeficient
        * deal.exchangeRate;

    return Math.round(finalPrice);
});

getMinimumPossibleDownpayment.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {
    return financingClient.getMinimumPossibleDownpaymentInForeignCurrency(
        deal.businessParams.carModelSelected!,
        deal.businessParams.insurancePlansSelected.map(x => x.type),
        deal.businessParams.downpaymentCurrency
    );
});

prepareRequstApprovalCall.override(DealForeignCurrencyTag, (deal: DealForeignCurrency) => {

    validateDealBusinessParams(deal.businessParams);

    const request = [
        deal.businessParams.carModelSelected!,
        deal.businessParams.insurancePlansSelected.map(x => x.type),
        deal.businessParams.downpayment,
        deal.businessParams.downpaymentCurrency
    ] as const;

    return {
        request: request as any,
        makeCall: () => financingClient.getApprovalWithForeignCurrency(...request)
    }
});