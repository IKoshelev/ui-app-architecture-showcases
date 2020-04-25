import React from "react";
import { SelectDropdown2 } from "../../../../generic-components/select-dropdown/SelectDropdown2";
import { useCarModelsSelector2 } from "./useCarModelsSelector2";
import { observer } from "mobx-react";
import { CarModel } from "../../../../api/CarInventory.Client";

export const CarModelsSelector2: React.FunctionComponent = observer(() => {

    const hook = useCarModelsSelector2();

    if (hook.isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }
    
    return <>
        <SelectDropdown2
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
});