import { useState, useEffect } from "react";
import { carEnsuranceClient, EnsurancePlan } from "../../../../api/CarEnsurance.Client";
import { dealsStore } from "../../../../stores/Deals.Store";
import { fetchAvailableInsurancePlans } from "../../../../stores/Deals.Async";

export const useInsurancePlanSelector = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const reloadAvailablePlans = async () => {
        setIsLoading(true);
        await fetchAvailableInsurancePlans();
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(false);
        if (dealsStore.availableInsurancePlans.length === 0) {
            reloadAvailablePlans();
        };
    }, [dealsStore.activeDealId])

    return {
        isLoading,
        availablePlans: dealsStore.availableInsurancePlans,
        selectedPlans: dealsStore.availableInsurancePlans.filter(a =>
            dealsStore.selectedEnsurancePlanTypes.some(x => a.type === x)),
        isDealFinilized: false,
        setSelectedPlans: dealsStore.setSelectedEnsurancePlanTypes,
        reloadAvailablePlans
    }
}