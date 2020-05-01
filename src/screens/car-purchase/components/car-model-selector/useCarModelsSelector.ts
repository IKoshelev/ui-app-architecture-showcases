import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useCarModels } from "../../../../contexts/CarModels/CarModels.Context";
import { CarModel } from "../../../../api/CarInventory.Client";
import { calculateFinalPrice } from "../../../../contexts/Deal/Deal.Sync";

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
            const finalPrice = calculateFinalPrice(item, deal.selectedInsurancePlans);

            const isValid = !finalPrice || !(item && deal.downpayment > finalPrice);
            deal.setIsValid(isValid);
            deal.setApprovalStatus({ isApproved: false });
        },
        handleClick: carModels.reloadAvailableModels
    }
}