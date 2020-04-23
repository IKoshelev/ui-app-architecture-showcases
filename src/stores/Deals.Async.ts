import { dealsStore } from "./Deals.Store";
import { carInvenotryClient } from "../api/CarInventory.Client";
import { carEnsuranceClient, EnsurancePlan, EnsurancePlanType } from "../api/CarEnsurance.Client";
import { financingClient } from "../api/Financing.Client";

export const fetchAvailableCarModels = async () => {
    dealsStore.setIsLoading(true);
    try {
        const result = await carInvenotryClient.getAvaliableCarModels();
        dealsStore.setAvailableCarModels(result);
    } finally {
        dealsStore.setIsLoading(false);
    }
}

export const fetchAvailableInsurancePlans = async () => {
    dealsStore.setIsLoading(true);
    try {
        const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
        dealsStore.setAvailableInsurancePlans(result);
    } finally {
        dealsStore.setIsLoading(false);
    }
}

export const fetchMinimumDownPayment = async () => {
    dealsStore.setIsLoading(true);
    try {
        const minimumDownpayment = await financingClient.getMinimumPossibleDownpayment(
            dealsStore.carModel!,
            <EnsurancePlanType[]> dealsStore.selectedEnsurancePlanTypes
        );
        dealsStore.setDownPayment(minimumDownpayment);
    } finally {
        dealsStore.setIsLoading(false);
    }
}