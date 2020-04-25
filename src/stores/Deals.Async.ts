import { dealsStore } from "./Deals.Store";
import { carInvenotryClient } from "../api/CarInventory.Client";
import { carEnsuranceClient, EnsurancePlan, EnsurancePlanType } from "../api/CarEnsurance.Client";
import { financingClient } from "../api/Financing.Client";
import { defaultDealStatus } from "./Deals.Sync";

export const fetchAvailableCarModels = async (): Promise<void> => {
    dealsStore.setIsLoading(true);
    try {
        const result = await carInvenotryClient.getAvaliableCarModels();
        dealsStore.setAvailableCarModels(result);
    } finally {
        dealsStore.setIsLoading(false);
    }
}

export const fetchAvailableInsurancePlans = async (): Promise<void> => {
    dealsStore.setIsLoading(true);
    try {
        const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
        dealsStore.setAvailableInsurancePlans(result);
    } finally {
        dealsStore.setIsLoading(false);
    }
}

export const fetchMinimumDownPayment = async (): Promise<void> => {
    dealsStore.setIsLoading(true);
    try {
        const minimumDownpayment = await financingClient.getMinimumPossibleDownpayment(
            dealsStore.carModel!,
            <EnsurancePlanType[]> dealsStore.selectedInsurancePlans.map(plan => plan.type)
        );
        dealsStore.setDownPayment(minimumDownpayment);
    } finally {
        dealsStore.setIsLoading(false);
    }
}

export const fetchApproval = async (): Promise<void> => {
    dealsStore.setIsLoading(true);
    try {
        const result = await financingClient.getApproval(
                dealsStore.carModel!,
                <EnsurancePlanType[]> dealsStore.selectedInsurancePlans.map(plan => plan.type),
                <number>dealsStore.downpayment
            );

        // @Ivan Can you please fix this typescript error
        // const nextMessage = result.message ?? '';

        const nextStatus = {
            ...defaultDealStatus,
            expirationTimer: result.isApproved ? 15 : 0,
            isApproved: result.isApproved,
            messages: ['approval has been requested']
        };
        
        dealsStore.setStatus(nextStatus);

        setInterval(() => {
            if (dealsStore.status?.expirationTimer && dealsStore.status.expirationTimer > 0) {
                const timeLeft = dealsStore.status.expirationTimer - 1;
                dealsStore.setStatus({
                    ...nextStatus,
                    expirationTimer: timeLeft
                });
            }
        }, 1000)
        
    } finally {
        dealsStore.setIsLoading(false);
    }
}

