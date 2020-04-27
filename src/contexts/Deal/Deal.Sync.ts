import { EnsurancePlan } from "../../api/CarEnsurance.Client";
import { CarModel } from "../../api/CarInventory.Client";
import { ApprovalStatus } from "./Deal.Types";

export const calculateFinalPrice = (carModel: CarModel | undefined, insurancePlans: EnsurancePlan[]): number | null => {
    if (!carModel) {
        return null;
    }
    const priceIncrease: number = insurancePlans.map(plan => carModel.basePrice * plan.rate)
        .reduce((prev, cur) => prev + cur, 0) ?? 0;

    return carModel.basePrice + priceIncrease;
}

export const canRequestApproval = (
    isLoading: boolean, 
    carModel: CarModel | undefined, 
    isFinalized: boolean, 
    approvalStatus: ApprovalStatus,
    isValid: boolean
    ): boolean  => {
    const hasCarModel = !!carModel;    
    
    return !isLoading
            && hasCarModel
            && !isFinalized
            && !approvalStatus.isApproved
            && isValid;
};
