import { observer } from "mobx-react";
import { CarModelsSelectorVM } from "./CarModelsSelector.VM";
import React from "react";
import { SelectDropdown } from "../../../../generic-components/select-dropdown/SelectDropdown";

export const CarModelsSelector: React.FunctionComponent<{
    vm: CarModelsSelectorVM
}> = observer(({ vm }) => {

    if (vm.isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }
    return <>
        <SelectDropdown
            selectAttributes={{ className: 'car-model-selector-select' }}
            emptyPlaceholder='Please select model'
            vm={{
                availableItems: vm.availableModels,
                selectedItem: vm.selectedModel,
                disabled: vm.isDealFinilized,
                getKeyValue: (item) => item.id.toString(),
                getDescription: (item) => item.description,
                handleSelect: (item) => vm.setSelectedModel(item),
            }}

        />
        <button
            className='car-model-selector-refresh-btn'
            onClick={vm.reloadAvailableModels}
            disabled={vm.isDealFinilized}
        >
            Refresh avilable models
        </button>
    </>
});