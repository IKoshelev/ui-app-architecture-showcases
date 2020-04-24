import { observer } from "mobx-react";
import React from "react";
import { SelectMultiple2 } from "../../../../generic-components/select-multiple/SelectMultiple2";
import { useInsurancePlanSelector } from "./useInsurancePlanSelector";
import { EnsurancePlanType, EnsurancePlan } from "../../../../api/CarEnsurance.Client";

export const InsurancePlanSelector = observer(() => {

    const {
        isLoading,
        availablePlans,
        selectedPlans,
        isDealFinilized,
        reloadAvailablePlans,
        setSelectedPlans
    } = useInsurancePlanSelector();

    if (isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple2
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
            availableItems={availablePlans}
            selectedItems={selectedPlans}
            disabled={isDealFinilized}
            getKeyValue={(item: EnsurancePlan) => item.type.toString()}
            getDescription={(item: EnsurancePlan) => item.description}
            handleSelect={(items: EnsurancePlan[]) => setSelectedPlans(items)}
        />
        <button
            className='ensurance-plan-selector-refresh-btn'
            onClick={reloadAvailablePlans}
            disabled={isDealFinilized}
        >
            Refresh available plans
        </button>
    </>
});