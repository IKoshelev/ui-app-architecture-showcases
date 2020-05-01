import { InsurancePlan } from "../../api/CarInsurance.Client";
import { CarModel } from "../../api/CarInventory.Client";
import { ApprovalStatus } from "./Deal.Types";
import { IDealContext } from "./Deal.Context";
import { PartialState } from "../../util/typing";

export const calculateFinalPrice = (carModel: CarModel | undefined, insurancePlans: InsurancePlan[]): number | null => {
    if (!carModel) {
        return null;
    }
    const priceIncrease: number = insurancePlans.map(plan => carModel.basePrice * plan.rate)
        .reduce((prev, cur) => prev + cur, 0) ?? 0;

    return carModel.basePrice + priceIncrease;
}

// does this belong here or in DealContext file? 
export function calculateisValidAndApproval(
    currentDealState: IDealContext,
    newDealState: PartialState<IDealContext> = {}
) {

    const finalState: IDealContext = { ...currentDealState, ...newDealState };

    const finalPrice = calculateFinalPrice(finalState.carModel, finalState.selectedInsurancePlans);

    const isValid = !finalPrice || !(finalState.carModel && finalState.downpayment > finalPrice);
    finalState.setIsValid(isValid);
    finalState.setApprovalStatus({ isApproved: false });
}

export const canRequestApproval = (
    isLoading: boolean,
    carModel: CarModel | undefined,
    isFinalized: boolean,
    approvalStatus: ApprovalStatus,
    isValid: boolean
): boolean => {
    const hasCarModel = !!carModel;

    return !isLoading
        && hasCarModel
        && !isFinalized
        && (!approvalStatus.isApproved || (!!approvalStatus.expiration && approvalStatus.expiration <= new Date()))
        && isValid;
};

export const canFinalizeDeal = (
    isLoading: boolean,
    isFinalized: boolean,
    isApproved: boolean,
    isExpired?: boolean
) => {
    return !isLoading && isApproved && !isFinalized && !isExpired;
}

export const getDealStatus = (
    isFinalized: boolean,
    isApproved: boolean,
    expiration?: Date,
    isExpired?: boolean,
) => {
    if (isFinalized) {
        return 'deal-finalized';
    }
    if (isApproved && !!expiration && !isExpired) {
        return 'approval-with-expiry-date';
    }
    if (isApproved && isExpired) {
        return 'approval-expired';
    }
    if (isApproved && !expiration) {
        return 'approval-perpetual';
    }
    return 'no-approval';
}