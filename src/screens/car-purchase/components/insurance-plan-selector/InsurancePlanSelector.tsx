import React from "react";
import { SelectMultiple2 } from "../../../../generic-components/select-multiple/SelectMultiple2";
import { useInsurancePlanSelector } from "./useInsurancePlanSelector";
import { EnsurancePlan } from "../../../../api/CarEnsurance.Client";

export const InsurancePlanSelector = () => {

    const hook = useInsurancePlanSelector();

    if (hook.isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple2
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
            availableItems={hook.availableItems}
            selectedItems={hook.selectedItems}
            disabled={hook.isDisabled}
            getKeyValue={(item: EnsurancePlan) => item.type.toString()}
            getDescription={(item: EnsurancePlan) => item.description}
            handleSelect={(items: EnsurancePlan[]) => hook.handleSelect(items)}
        />
        <button
            className='ensurance-plan-selector-refresh-btn'
            onClick={hook.handleClick}
            disabled={hook.isDisabled}
        >
            Refresh available plans
        </button>
    </>
};