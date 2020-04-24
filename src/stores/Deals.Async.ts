import { dealsStore } from "./Deals.Store";
import { carInvenotryClient } from "../api/CarInventory.Client";
import { carEnsuranceClient, EnsurancePlan, EnsurancePlanType } from "../api/CarEnsurance.Client";
import { financingClient } from "../api/Financing.Client";
import { trackIsRunningGeneric } from "../util/util";

const trackLoadingInDealsStore = trackIsRunningGeneric(dealsStore.setIsLoading)

export const fetchAvailableCarModels = trackLoadingInDealsStore(async () => {
    const result = await carInvenotryClient.getAvaliableCarModels();
    dealsStore.setAvailableCarModels(result);
});

export const fetchAvailableInsurancePlans = trackLoadingInDealsStore(async () => {
    const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
    dealsStore.setAvailableInsurancePlans(result);
});

export const fetchMinimumDownPayment = trackLoadingInDealsStore(async () => {
    const minimumDownpayment = await financingClient.getMinimumPossibleDownpayment(
        dealsStore.carModel!,
        <EnsurancePlanType[]>dealsStore.selectedInsurancePlans.map(plan => plan.type)
    );
    dealsStore.setDownPayment(minimumDownpayment);
});