import { useInsurancePlans } from "../../../../contexts/InsurancePlans/InsurancePlans.Context";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { InsurancePlan } from "../../../../api/CarInsurance.Client";
import { calculateFinalPrice } from "../../../../contexts/Deal/Deal.Sync";

export const useInsurancePlanSelector = () => {
    const plans = useInsurancePlans();
    const deal = useDeal();

    return {
        isLoading: plans.isLoading,
        availableItems: plans.insurancePlans,
        selectedItems: deal.selectedInsurancePlans,
        isDisabled: deal.isFinalized,
        handleSelect(items: InsurancePlan[]) {
            deal.setSelectedInsurancePlans(items)
            deal.setApprovalStatus({ isApproved: false })
            const finalPrice = calculateFinalPrice(deal.carModel, items);

            if (!finalPrice) {
                deal.setIsValid(true);
            } else if (deal.carModel && deal.downpayment > finalPrice) {
                deal.setIsValid(false);
            } else {
                deal.setIsValid(true);
            }
        },
        handleClick: plans.reloadAvailableInsurancePlans
    }
}