import type { InsurancePlan } from "../../../api/CarInsurance.Client";
import type { CarModel } from "../../../api/CarInventory.Client";
import { financingClient, GetApprovalResult } from "../../../api/Financing.Client";
import { multimethod } from "multimethod-type-tag-hierarchy";
import { getUserInputState } from "../../../generic-components/input-models/UserInput.pure";
import { DisplayMessage, isValid } from "../../../util/validation-flows-messages";

export const DealTag: `Deal${string}` = 'Deal';

export const createBlankDeal = () => ({
    type: DealTag,

    businessParams: {
        dealId: 0,
        isDealFinalized: false,
        downpayment: getUserInputState<number, any>(0),
        insurancePlansSelected:  getUserInputState<InsurancePlan[], any>([]),
        carModelSelected:  getUserInputState<CarModel | undefined, any>(undefined),
    },
    isClosed: false,
    activeFlows: {} as Record<
        `loading:exchange-rate`
        | `loading:car-models`
        | `loading:insurance-plans`
        | `loading:downpayment`
        | `loading:approval`
        | `loading:finalizing`, true>,
    insurancePlansAvailable: [] as InsurancePlan[],
    carModelsAvailable: [] as CarModel[],
    messages: [] as DisplayMessage[],
});

export type Deal = ReturnType<typeof createBlankDeal>;

export type DealBusinessParams = Deal['businessParams'];

export function getDealProgressState(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {

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

export function canRequestMinimumDownpayment(deal: DealBusinessParams) {
    return deal.carModelSelected
        && deal.isDealFinalized === false;
}

export const getFinalPrice = multimethod('type', DealTag, (deal: Deal) => {

    const basePriceUSD = deal.businessParams.carModelSelected.committedValue?.basePriceUSD;

    if (!basePriceUSD ) {
        return 0;
    }

    const priceIncrease = deal
        .businessParams.insurancePlansSelected.committedValue
        .map(x => basePriceUSD * x.rate)
        .reduce((prev, cur) => prev + cur, 0);

    // in real world, remember to use specialized lib for financial calculations
    // https://stackoverflow.com/a/588014/882936
    return basePriceUSD + priceIncrease;
});

export function getGeneralValidation(deal: Deal) {

    const finalPrice = getFinalPrice(deal);

    const downpaymentExceedsPrice = !!(deal.businessParams.carModelSelected.committedValue
        && deal.businessParams.downpayment.committedValue > finalPrice);

    const validation = {
        downpaymentExceedsPrice
    }

    return validation;
}

export function areDealBusinessParamsValid(params: DealBusinessParams)
    : params is DealBusinessParams & { carModelSelected: CarModel } {

   return !!params.carModelSelected.committedValue;
}

export function canBeFinalized(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {
    return deal.businessParams.isDealFinalized === false
        && approval?.isApproved
        && (!approval.expiration || approval.expiration >= currentDate);
}

export function canRequestApproval(deal: Deal) {
    return deal.businessParams.carModelSelected.committedValue
        && deal.businessParams.isDealFinalized === false
        && isValid(deal.businessParams.downpayment)
        && getGeneralValidation(deal).downpaymentExceedsPrice === false
}

export const getHeaderAdditionalDescription = multimethod('type', DealTag, (deal: Deal) => {
    return '';
});

export const getMinimumPossibleDownpayment = multimethod('type', DealTag, (deal: Deal) => {
    return financingClient.getMinimumPossibleDownpayment(
      deal.businessParams.carModelSelected.committedValue!,
      deal.businessParams.insurancePlansSelected.committedValue.map(x => x.type)
    );
  });

export const prepareRequestApprovalCall = multimethod('type', DealTag, (deal: Deal) => {

    if(!areDealBusinessParamsValid(deal.businessParams)){
        return undefined;
    }

    const request =  [
        deal.businessParams.carModelSelected.committedValue!,
        deal.businessParams.insurancePlansSelected.committedValue.map(x => x.type),
        deal.businessParams.downpayment.committedValue
    ] as const;
    
    return {
        request: request as any,
        makeCall: () => financingClient.getApproval(...request)
    }
});

