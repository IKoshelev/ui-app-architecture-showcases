import React from "react";
import { SelectMultiple } from "../../../../generic-components/select-multiple/SelectMultiple";
import { useInsurancePlanSelector } from "./useInsurancePlanSelector";
import {  InsurancePlan } from "../../../../api/CarInsurance.Client";

export const InsurancePlanSelector = () => {

    const hook = useInsurancePlanSelector();

    if (hook.isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
            availableItems={hook.availableItems}
            selectedItems={hook.selectedItems}
            disabled={hook.isDisabled}
            getKeyValue={(item:  InsurancePlan) => item.type.toString()}
            getDescription={(item:  InsurancePlan) => item.description}
            handleSelect={(items:  InsurancePlan[]) => hook.handleSelect(items)}
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