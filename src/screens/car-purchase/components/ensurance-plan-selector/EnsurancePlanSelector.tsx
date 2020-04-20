import { observer } from "mobx-react";
import React from "react";
import { EnsurancePlansSelectorVM } from "./EnsurancePlansSelector.VM";
import { SelectMultiple } from "../../../../generic-components/select-multiple/SelectMultiple";

export const EnsurancePlanSelector: React.FunctionComponent<{
    vm: EnsurancePlansSelectorVM
}> = observer(({ vm }) => {

    if (vm.isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <SelectMultiple
            selectAttributes={{ className: 'ensurance-plan-selector-select' }}
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
            className='ensurance-plan-selector-refresh-btn'
            onClick={vm.reloadAvailablePlans}
            disabled={vm.isDealFinilized}
        >
            Refresh avilable plans
        </button>
    </>
});