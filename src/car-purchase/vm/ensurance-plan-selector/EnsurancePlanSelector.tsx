import { observer } from "mobx-react";
import React, { ChangeEvent } from "react";
import { EnsurancePlansSelectorVM } from "./EnsurancePlansSelector.VM";



export const EnsurancePlanSelector: React.FunctionComponent<{
    vm: EnsurancePlansSelectorVM
}> = observer(({ vm }) => {

    if (vm.isLoading) {
        return <div className='ensurance-plan-selector-loading'>Loading</div>
    }

    return <>
        <select
            className='ensurance-plan-selector-select'
            multiple={true}
            value={vm.selectedPlanTypes}
            onChange={handleSelect}
            disabled={vm.isDealFinilized}
        >
            {
                vm.availablePlans.map(x => (<option
                    key={x.type}
                    value={x.type}
                >
                    {x.description}
                </option>))
            }
        </select>
        <button
            className='ensurance-plan-selector-refresh-btn'
            onClick={vm.reloadAvailablePlans}
            disabled={vm.isDealFinilized}
        >
            Refresh avilable plans
        </button>
    </>

    function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        vm.setSelectedPlans(value);
    }
});