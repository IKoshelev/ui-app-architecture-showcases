import { useState, useEffect } from "react";
import { dealsStore } from "../../../../stores/Deals.Store";
import { CarModel, carInvenotryClient } from "../../../../api/CarInventory.Client";

export const useCarModelsSelector2 = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [availableModels, setAvailableModels] = useState<CarModel[]>([]);

    const reloadAvailableModels = async () => {
        setIsLoading(true);
        try {
            const result = await carInvenotryClient.getAvaliableCarModels();
            setAvailableModels(result);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        reloadAvailableModels();
    }, [])

    return {
        isLoading,
        isDealFinalized: false,
        availableModels,
        selectedModel: dealsStore.carModel,
        setSelectedModel: dealsStore.setCarModel,
        reloadAvailableModels
    }
}