import { useState, useEffect } from "react";
import { carEnsuranceClient, EnsurancePlan } from "../../../../api/CarEnsurance.Client";
import { dealsStore } from "../../../../stores/Deals.Store";

export const useInsurancePlanSelector = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [availablePlans, setAvailablePlans] = useState<EnsurancePlan[]>([]);

    const reloadAvailablePlans = async () => {
        setIsLoading(true);
        try {
            const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
            setAvailablePlans(result);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        reloadAvailablePlans();
    }, [])

    return {
        isLoading,
        availablePlans,
        selectedPlans: availablePlans.filter(a =>
            dealsStore.selectedEnsurancePlanTypes.find(x => a.type === x)),
        isDealFinilized: false,
        setSelectedPlans: dealsStore.setSelectedEnsurancePlanTypes,
        reloadAvailablePlans
    }
}