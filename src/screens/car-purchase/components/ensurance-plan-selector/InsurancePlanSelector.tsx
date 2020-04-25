import { observer } from "mobx-react";
import React from "react";
import { SelectMultiple2 } from "../../../../generic-components/select-multiple/SelectMultiple2";
import { useInsurancePlanSelector } from "./useInsurancePlanSelector";
import { EnsurancePlanType, EnsurancePlan } from "../../../../api/CarEnsurance.Client";

export const InsurancePlanSelector = observer(() => {

    const hook = useInsurancePlanSelector();

    if (hook.isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple2
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
            availableItems={hook.availablePlans}
            selectedItems={hook.selectedPlans}
            disabled={hook.isDealFinilized}
            getKeyValue={(item: EnsurancePlan) => item.type.toString()}
            getDescription={(item: EnsurancePlan) => item.description}
            handleSelect={(items: EnsurancePlan[]) => hook.setSelectedPlans(items)}
        />
        <button
            className='ensurance-plan-selector-refresh-btn'
            onClick={hook.reloadAvailablePlans}
            disabled={hook.isDealFinilized}
        >
            Refresh available plans
        </button>
    </>
});