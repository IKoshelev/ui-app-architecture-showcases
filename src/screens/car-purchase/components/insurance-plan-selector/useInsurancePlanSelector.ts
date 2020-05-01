import { useInsurancePlans } from "../../../../contexts/InsurancePlans/InsurancePlans.Context";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { InsurancePlan } from "../../../../api/CarInsurance.Client";
import { calculateisValidAndApproval } from "../../../../contexts/Deal/Deal.Sync";

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

            calculateisValidAndApproval(deal, {
                selectedInsurancePlans: items
            });
        },
        handleClick: plans.reloadAvailableInsurancePlans
    }
}