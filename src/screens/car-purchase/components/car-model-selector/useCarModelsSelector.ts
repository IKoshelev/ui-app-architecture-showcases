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

            // this is VERY bad
            // why does CarModelsSelector suddenly depend on 
            // finalPrice and donwpayament?
            // And why is it suddenly setting model validity?
            // This logics should be gathered into a single file (Deal.Sync.ts?) and imported from there
            const finalPrice = calculateFinalPrice(item, deal.selectedInsurancePlans);

            if (!finalPrice) {
                deal.setIsValid(true);
            } else if (item && deal.downpayment > finalPrice) {
                deal.setIsValid(false);
            } else {
                deal.setIsValid(true);
            }
            deal.setApprovalStatus({ isApproved: false })
        },
        handleClick: carModels.reloadAvailableModels
    }
}