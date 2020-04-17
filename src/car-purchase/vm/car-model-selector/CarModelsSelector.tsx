import { observer } from "mobx-react";
import { CarModelsSelectorVM } from "./CarModelsSelector.VM";
import React from "react";


export const CarModelsSelector: React.FunctionComponent<{
    vm: CarModelsSelectorVM
}> = observer(({ vm }) => {

    if (vm.isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }
    return <>
        <select
            className='car-model-selector-select'
            value={vm.selectedModel?.id ?? 0}
            onChange={(e) => vm.selectModel(e.target.value)}
            disabled={vm.isDealFinilized}
        >
            <option value={'0'}>
                Please select model
            </option>

            {
                vm.availableModels.map(x => (<option
                    key={x.id}
                    value={x.id}
                >
                    {x.description}
                </option>))
            }
        </select>
        <button
            className='car-model-selector-refresh-btn'
            onClick={vm.reloadAvailableModels}
            disabled={vm.isDealFinilized}
        >
            Refresh avilable models
        </button>
    </>
});