import { createSelector } from "reselect";
import { InsurancePlan } from "../../../api/CarInsurance.Client";
import { CarModel } from "../../../api/CarInventory.Client";
import { financingClient, GetApprovalResult } from "../../../api/Financing.Client";
import { getBlankNumericInputState } from "../../../generic-components/NumericInput";
import { RootState } from "../../store";
import type { ApprovalsState } from "../../approval.store";
import { isLoadingAny } from "../../../util/isLoadingAny";
import { createStructuralEqualSelector, memoizeSelectorCreatorIndeffinitely } from "../../../util/selectors";
import { multimethod } from "multimethod-type-tag-hierarchy";
import isEqual from "lodash.isequal";

export const DealTag: `Deal${string}` = 'Deal';

export const createBlankDeal = () => ({
    type: DealTag,

    businessParams: {
        dealId: 0,
        isDealFinalized: false,
        downpayment: 0,
        insurancePlansSelected: [] as InsurancePlan[],
        carModelSelected: undefined as CarModel | undefined,
    },

    isClosed: false,
    isLoadingItemized: {},
    downplaymentInputState: getBlankNumericInputState({ integer: true, positive: true }),
    insurancePlansAvailable: [] as InsurancePlan[],
    carModelsAvailable: [] as CarModel[],
    messages: [] as string[],
});

export type Deal = ReturnType<typeof createBlankDeal>
    & {
        isLoadingItemized: { [K in
            //todo generic way to flatten keys or better pattern to select keys that need to be in itemized loading registry
            (keyof ReturnType<typeof createBlankDeal> | keyof ReturnType<typeof createBlankDeal>['businessParams'])]?
            : boolean }
    };

export type DealBusinessParams = Deal['businessParams'];

export const getCachedSelectorDealDerrivations = memoizeSelectorCreatorIndeffinitely((dealId: number) => {

    // these 3 selectors facilitate functional approach without unnecessary reacalculations
    const currentApprovalSelector = createSelector(getCurrentApproval, x => x);
    const getDealByIdSelector = createSelector(getDealById, x => x);
    const getGeneralValidationSelector = createSelector(getGeneralValidation, x => x);

    const selector = createSelector(
        
            (state: RootState) => getDealByIdSelector(state, dealId)!,

            (state: RootState) => currentApprovalSelector(state, dealId),

            (state: RootState) => state.approvals.isLoading[dealId],

            createStructuralEqualSelector((state: RootState) => getDealProgressState(
                getDealByIdSelector(state, dealId)!, 
                currentApprovalSelector(state, dealId), 
                state.clock.currentDate
                ), x => x),
        
            (state: RootState) => canBeFinalized(            
                getDealByIdSelector(state, dealId)!, 
                currentApprovalSelector(state, dealId), 
                state.clock.currentDate
                ),
          
            (deal, approval, isCurrentApprovalLoading, dealProgressState, canBeFinalized) => (
                //(console.log(`recalc ${dealId}`,[deal, approval, isCurrentApprovalLoading, dealProgressState, canBeFinalized])), 
                {
                deal,
                approval, 
                isCurrentApprovalLoading,
                canRequestMinimumDownpayment: canRequestMinimumDownpayment(deal.businessParams),
                finalPrice: getFinalPrice(deal),
                generalValidation: getGeneralValidationSelector(deal),
                dealProgressState,
                headerAdditionalDescription: getHeaderAdditionalDescription(deal),
                canBeFinalized,
                isLoadingAny: isLoadingAny(deal.isLoadingItemized),
                canRequestApproval: deal.businessParams.carModelSelected
                                    && deal.businessParams.isDealFinalized === false
                                    && deal.downplaymentInputState.isValid
                                    && getGeneralValidationSelector(deal).downpaymentExceedsPrice === false
            }));
    
        return selector;
    });

function getDealProgressState(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {

    if (deal.businessParams.isDealFinalized) {
        return 'deal-finalized' as const;
    }

    if (!approval || approval.isApproved === false) {
        return 'no-approval' as const;
    }

    const expiration = approval.expiration;
    if (!expiration) {
        return 'approval-perpetual' as const;
    }

    if (expiration <= currentDate) {
        return 'approval-expired' as const;
    }

    return { approvalExpiresAt: expiration } as const;
}

export type DealProgressState = ReturnType<typeof getDealProgressState>;

function canRequestMinimumDownpayment(deal: DealBusinessParams) {
    return deal.carModelSelected
        && deal.isDealFinalized === false;
}

export const getFinalPrice = multimethod('type', DealTag, (deal: Deal) => {

    const basePriceUSD = deal.businessParams.carModelSelected?.basePriceUSD;

    if (!basePriceUSD ) {
        return 0;
    }

    const priceIncrease = deal
        .businessParams.insurancePlansSelected
        .map(x => basePriceUSD * x.rate)
        .reduce((prev, cur) => prev + cur, 0);

    // in real world, remember to use specialized lib for financial calculations
    // https://stackoverflow.com/a/588014/882936
    return basePriceUSD + priceIncrease;
});

function getGeneralValidation(deal: Deal) {

    const downpaymentExceedsPrice = !!(deal.businessParams.carModelSelected
        && deal.businessParams.downpayment > getFinalPrice(deal));

    const validation = {
        downpaymentExceedsPrice
    }

    return validation;
}

export function validateDealBusinessParams(params: Deal['businessParams'])
    : asserts params is Deal['businessParams'] & { carModelSelected: CarModel } {

    if (!params.carModelSelected) {
        throw new Error("Car model not selected.");
    }
}

function canBeFinalized(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {
    return deal.businessParams.isDealFinalized === false
        && approval?.isApproved
        && (!approval.expiration || approval.expiration >= currentDate);
}

function getDealById(state: RootState, dealId: number) {
    return state.deals.deals.find(x => x.businessParams.dealId === dealId);
}

function getCurrentApproval(state: RootState, dealId: number) {

    const deal = getDealById(state, dealId);

    if (!deal) {
        return undefined;
    }

    return getLatestMatchingApproval(
        state.approvals,
        deal
    );
}

function getLatestMatchingApproval(
    state: ApprovalsState,
    deal: Deal): GetApprovalResult | undefined {

    const currentDealRequest = prepareRequstApprovalCall(deal).request;

    return state.approvals[deal.businessParams.dealId]
        ?.filter(({ request }) => {
            //relies on insurance plans always being in same order;
            //in the real world request should probably also include method name
            return  isEqual(request, currentDealRequest);
        })
        .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
    [0]?.result;
}

export const getHeaderAdditionalDescription = multimethod('type', DealTag, (deal: Deal) => {
    return '';
});

export const getMinimumPossibleDownpayment = multimethod('type', DealTag, (deal: Deal) => {
    return financingClient.getMinimumPossibleDownpayment(
      deal.businessParams.carModelSelected!,
      deal.businessParams.insurancePlansSelected.map(x => x.type)
    );
  });

export const prepareRequstApprovalCall = multimethod('type', DealTag, (deal: Deal) => {

    validateDealBusinessParams(deal.businessParams);

    const request =  [
        deal.businessParams.carModelSelected!,
        deal.businessParams.insurancePlansSelected.map(x => x.type),
        deal.businessParams.downpayment
    ] as const;
    
    return {
        request: request as any,
        makeCall: () => financingClient.getApproval(...request)
    }
});