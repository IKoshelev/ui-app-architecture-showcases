import { useState, useEffect } from "react";
import { dealsStore } from "../../../../stores/Deals.Store";
import { fetchAvailableCarModels } from "../../../../stores/Deals.Async";
import { CarModel } from "../../../../api/CarInventory.Client";

export const useCarModelsSelector2 = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const reloadAvailableModels = async () => {
        setIsLoading(true);
        await fetchAvailableCarModels();
        setIsLoading(false);
    }

    useEffect(() => {
        if (dealsStore.availableCarModels.length === 0) {
            reloadAvailableModels();
        };
    }, [dealsStore.activeDealId])

    return {
        isLoading,
        isDealFinalized: false,
        availableModels: dealsStore.availableCarModels,
        selectedModel: dealsStore.carModel,
        setSelectedModel: dealsStore.setCarModel,
        reloadAvailableModels
    }
}