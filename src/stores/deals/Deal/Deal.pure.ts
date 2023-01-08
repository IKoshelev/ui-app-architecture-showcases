import { InsurancePlan } from "../../../api/CarInsurance.Client";
import { CarModel } from "../../../api/CarInventory.Client";
import { financingClient, GetApprovalResult } from "../../../api/Financing.Client";
import { multimethod } from "multimethod-type-tag-hierarchy";
import { getUserInputState } from "../../../generic-components/input-models/UserInput.pure";

export const DealTag: `Deal${string}` = 'Deal';

export const createBlankDeal = () => ({
    type: DealTag,

    businessParams: {
        dealId: 0,
        isDealFinalized: false,
        downpayment: getUserInputState<number, string>(0),
        insurancePlansSelected:  getUserInputState<InsurancePlan[], InsurancePlan[]>([]),
        carModelSelected:  getUserInputState<CarModel | undefined, CarModel>(undefined),
    },
    isClosed: false,
    reasonsToDisable: {} as Record<`loading:${string}`, true>,
    insurancePlansAvailable: [] as InsurancePlan[],
    carModelsAvailable: [] as CarModel[],
    messages: [] as string[],
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

    const downpaymentExceedsPrice = !!(deal.businessParams.carModelSelected
        && deal.businessParams.downpayment.committedValue > getFinalPrice(deal));

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

export function canBeFinalized(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {
    return deal.businessParams.isDealFinalized === false
        && approval?.isApproved
        && (!approval.expiration || approval.expiration >= currentDate);
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

    validateDealBusinessParams(deal.businessParams);

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