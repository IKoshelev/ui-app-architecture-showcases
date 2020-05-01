import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useCarModels } from "../../../../contexts/CarModels/CarModels.Context";
import { CarModel } from "../../../../api/CarInventory.Client";
import { calculateisValidAndApproval } from "../../../../contexts/Deal/Deal.Sync";

export const useCarModelsSelector = () => {
    const deal = useDeal();
    const carModels = useCarModels();

    return {
        isLoading: carModels.isLoading,
        isDisabled: deal.isFinalized,
        availableItems: carModels.carModels,
        selectedItem: deal.carModel,
        handleSelect(item: CarModel) {
            deal.setCarModel(item)

            calculateisValidAndApproval(deal, {
                carModel: item
            });
        },
        handleClick: carModels.reloadAvailableModels
    }
}