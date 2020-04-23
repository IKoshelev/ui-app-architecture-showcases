import { observer } from "mobx-react";
import React from "react";
import { SelectMultiple } from "../../../../generic-components/select-multiple/SelectMultiple";
import { useInsurancePlanSelector } from "./useInsurancePlanSelector";
import { EnsurancePlanType } from "../../../../api/CarEnsurance.Client";

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
        <SelectMultiple
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
            vm={{
                availableItems: availablePlans,
                selectedItems: selectedPlans || [],
                disabled: isDealFinilized,
                getKeyValue: (item) => item.type.toString(),
                getDescription: (item) => item.description,
                handleSelect: (items) => {
                    const types: EnsurancePlanType[] = items.map(item => item.type);
                    setSelectedPlans(types)
                },
            }}

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