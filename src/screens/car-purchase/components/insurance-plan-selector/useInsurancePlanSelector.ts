import { useInsurancePlans } from "../../../../contexts/InsurancePlans/InsurancePlans.Context";
import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { EnsurancePlan } from "../../../../api/CarEnsurance.Client";

export const useInsurancePlanSelector = () => {
    const plans = useInsurancePlans();
    const deal = useDeal();

    return {
        isLoading: plans.isLoading,
        availableItems: plans.insurancePlans,
        selectedItems: deal.selectedInsurancePlans,
        isDisabled: deal.isFinalized,
        handleSelect(items: EnsurancePlan[]) {
            deal.setSelectedInsurancePlans(items)
        },
        handleClick: plans.reloadAvailableInsurancePlans
    }
}