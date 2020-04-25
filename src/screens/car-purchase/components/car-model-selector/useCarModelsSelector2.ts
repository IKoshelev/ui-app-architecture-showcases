import { dealsStore } from "../../../../stores/Deals.Store";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useCarModels } from "../../../../contexts/CarModels/CarModels.Context";
import { CarModel } from "../../../../api/CarInventory.Client";

export const useCarModelsSelector2 = () => {
    const deal = useDeal();
    const carModels = useCarModels();

    return {
        isLoading: carModels.isLoading,
        isDisabled: deal.isFinalized,
        availableItems: carModels.carModels,
        selectedItem: deal.carModel,
        handleSelect(item: CarModel) {
            deal.setCarModel(item)
        },
        handleClick: carModels.reloadAvailableModels
    }
}