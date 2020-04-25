import { CarModel } from "../api/CarInventory.Client";
import { EnsurancePlan } from "../api/CarEnsurance.Client";

export type DealStatus = {
    isApproved: boolean,
    isFinalized: boolean,
    expirationTimer: number,
    finalizedToken: string,
    messages: string[]
}

export type Deal = {
    id: number,
    carModel: CarModel | undefined,
    availableCarModels: CarModel[],
    selectedInsurancePlans: EnsurancePlan[],
    availableInsurancePlans: EnsurancePlan[],
    downpayment: number | undefined,
    financingFinilizedToken: number | undefined,
    isLoading: boolean,
    status: DealStatus
}