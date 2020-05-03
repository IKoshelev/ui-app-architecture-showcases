import { observer } from "mobx-react";
import React from "react";
import { InsurancePlansSelectorVM } from "./InsurancePlansSelector.VM";
import { SelectMultiple } from "../../../../generic-components/select-multiple/SelectMultiple";

export const InsurancePlanSelector: React.FunctionComponent<{
    vm: InsurancePlansSelectorVM
}> = observer(({ vm }) => {

    if (vm.isLoading) {
        return <div className='insurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple
            selectAttributes={{ className: 'insurance-plan-selector-select' }}
            vm={{
                availableItems: vm.availablePlans,
                selectedItems: vm.selectedPlans,
                disabled: vm.isDealFinilized,
                getKeyValue: (item) => item.type.toString(),
                getDescription: (item) => item.description,
                handleSelect: (items) => vm.setSelectedPlans(items),
            }}

        />
        <button
            className='insurance-plan-selector-refresh-btn'
            onClick={vm.reloadAvailablePlans}
            disabled={vm.isDealFinilized}
        >
            Refresh available plans
        </button>
    </>
});