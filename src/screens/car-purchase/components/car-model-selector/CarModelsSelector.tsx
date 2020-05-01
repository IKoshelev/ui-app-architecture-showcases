import React from "react";
import { SelectDropdown } from "../../../../generic-components/select-dropdown/SelectDropdown";
import { useCarModelsSelector } from "./useCarModelsSelector";
import { CarModel } from "../../../../api/CarInventory.Client";

export const CarModelsSelector: React.FunctionComponent = () => {

    const hook = useCarModelsSelector();
    if (hook.isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }

    return <>
        <SelectDropdown
            selectAttributes={{ className: 'car-model-selector-select' }}
            emptyPlaceholder='Please select model'
            availableItems={hook.availableItems}
            selectedItem={hook.selectedItem}
            disabled={hook.isDisabled}
            getKeyValue={(item: CarModel) => item?.id.toString()}
            getDescription={(item: CarModel) => item?.description}
            handleSelect={(item: CarModel) => hook.handleSelect(item)}
        />

        <button
            className='car-model-selector-refresh-btn'
            onClick={hook.handleClick}
            disabled={hook.isDisabled}
        >
            Refresh available models
        </button>
    </>
};