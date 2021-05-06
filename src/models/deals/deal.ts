import moment from "moment";
import { createSelector } from "reselect";
import { carInsuranceClient, InsurancePlan } from "../../api/CarInsurance.Client";
import { carInvenotryClient, CarModel } from "../../api/CarInventory.Client";
import type { financingClient, GetApprovalResult } from "../../api/Financing.Client";
import { getBlankNumericInputState } from "../../generic-components/numeric-input";
import { RootState } from "../../store";
import type { ApprovalsState } from "../approval.store";
import { isLoadingAny } from "../../util/isLoadingAny";
import { createStructuralEqualSelector } from "../../util/selectors";


export const createBlankDeal = () => ({

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
            //todo generi way to flatten keys
            (keyof ReturnType<typeof createBlankDeal> | keyof ReturnType<typeof createBlankDeal>['businessParams'])]?
            : boolean }
    };

export type DealBusinessParams = Deal['businessParams'];

//todo abstract pattern here
const cachedDealDerrivationSelectors = new Map<number, ReturnType<typeof getSelectorDealDerrivations>>(); 
export function getCachedSelectorDealDerrivations(dealId: number){
    const cached = cachedDealDerrivationSelectors.get(dealId);
    if(cached) {
        return cached;
    }
    const selector = getSelectorDealDerrivations(dealId);
    cachedDealDerrivationSelectors.set(dealId, selector);
    return selector;
}

function getSelectorDealDerrivations(dealId: number) {

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
          
            (deal, approval, isCurrentApprovalLoading, dealProgressState, canBeFinalized) => ((console.log(`recalc ${dealId}`,[
                deal, approval, isCurrentApprovalLoading, dealProgressState, canBeFinalized
            ])), {
                deal,
                approval, 
                isCurrentApprovalLoading,
                canRequestMinimumDownpayment: canRequestMinimumDownpayment(deal.businessParams),
                finalPrice: getFinalPrice(deal.businessParams),
                generalValidation: getGeneralValidationSelector(deal),
                dealProgressState,
                canBeFinalized,
                isLoadingAny: isLoadingAny(deal.isLoadingItemized),
                canRequestApproval: deal.businessParams.carModelSelected
                                    && deal.businessParams.isDealFinalized === false
                                    && deal.downplaymentInputState.isValid
                                    && getGeneralValidationSelector(deal).downpaymentExceedsPrice === false
            }));
    
        return selector;
    }

let dealIdCount = 1;

export async function loadNewDeal() {

    const deal = createBlankDeal();

    deal.businessParams.dealId = dealIdCount++;

    await Promise.all([
        carInvenotryClient.getAvaliableCarModels().then(x => deal.carModelsAvailable = x),
        carInsuranceClient.getAvaliableInsurancePlans().then(x => deal.insurancePlansAvailable = x)
    ]);

    return deal;
}


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


function getFinalPrice(deal: DealBusinessParams) {

    const basePrice = deal.carModelSelected?.basePrice;

    if (!basePrice) {
        throw new Error(`Can't calculate price.`);
    }

    const priceIncrease = deal
        .insurancePlansSelected
        .map(x => basePrice * x.rate)
        .reduce((prev, cur) => prev + cur, 0);

    return basePrice + priceIncrease;
}


function getGeneralValidation(deal: Deal) {

    const downpaymentExceedsPrice = !!(deal.businessParams.carModelSelected
        && deal.businessParams.downpayment > getFinalPrice(deal.businessParams));

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

export function getApprovalRequestArgs(businessParams: Deal['businessParams']): Parameters<typeof financingClient.getApproval> {

    validateDealBusinessParams(businessParams);

    return [
        businessParams.carModelSelected,
        businessParams.insurancePlansSelected.map(x => x.type),
        businessParams.downpayment
    ];
}

function canBeFinalized(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {
    return deal.businessParams.isDealFinalized === false
        && approval?.isApproved
        && (!approval.expiration || approval.expiration >= currentDate);
}

export function getDealById(state: RootState, dealId: number) {
    return state.deals.deals.find(x => x.businessParams.dealId === dealId);
}

export function getCurrentApproval(state: RootState, dealId: number) {

    const deal = getDealById(state, dealId);

    if (!deal) {
        return undefined;
    }

    return getLatestMatchingApproval(
        state.approvals,
        deal
    );
}

export function getLatestMatchingApproval(
    state: ApprovalsState,
    deal: Deal): GetApprovalResult | undefined {

    const args = getApprovalRequestArgs(deal.businessParams);

    return state.approvals[deal.businessParams.dealId]
        ?.filter(({ request }) => {
            //relies on insurance plans always being in same order
            return JSON.stringify(request) === JSON.stringify(args);
        })
        .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
    [0]?.result;
}