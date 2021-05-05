import moment from "moment";
import { carInsuranceClient, InsurancePlan } from "../../api/CarInsurance.Client";
import { carInvenotryClient, CarModel } from "../../api/CarInventory.Client";
import type { financingClient, GetApprovalResult } from "../../api/Financing.Client";
import { getBlankNumericInputState } from "../../generic-components/numeric-input";

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
            (keyof ReturnType<typeof createBlankDeal> | keyof ReturnType<typeof createBlankDeal>['businessParams'])]?
            : boolean }
    };

export type DealBusinessParams = Deal['businessParams'];

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

export function getDealProgresssState(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {

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

    var duration = moment.duration(moment(expiration).diff(currentDate));
    var seconds = Math.round(duration.asSeconds());

    if (seconds <= 0) {
        return 'approval-expired' as const;
    }

    return { approvalExpiresInSeconds: seconds } as const;
}

export type DealProgressState = ReturnType<typeof getDealProgresssState>;

export function canSetMinimumDownpayment(deal: DealBusinessParams) {
    return deal.carModelSelected
        && deal.isDealFinalized === false;
}

export function getFinalPrice(deal: DealBusinessParams) {

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

export function getGeneralValidation(deal: Deal) {

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

export function canBeFinalized(deal: Deal, approval: GetApprovalResult | undefined, currentDate: Date) {
    return deal.businessParams.isDealFinalized === false
        && approval?.isApproved
        && (!approval.expiration || approval.expiration >= currentDate);
}
