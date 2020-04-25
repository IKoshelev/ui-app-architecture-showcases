import React from "react";
import { SelectDropdown2 } from "../../../../generic-components/select-dropdown/SelectDropdown2";
import { useCarModelsSelector2 } from "./useCarModelsSelector2";
import { observer } from "mobx-react";

export const CarModelsSelector2: React.FunctionComponent = observer(() => {

    const hook = useCarModelsSelector2();

    if (hook.isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }
    
    return <>
        <SelectDropdown2
            selectAttributes={{ className: 'car-model-selector-select' }}
            emptyPlaceholder='Please select model'
            availableItems={hook.availableModels}
            selectedItem={hook.selectedModel}
            disabled={hook.isDealFinalized}
            getKeyValue={(item) => item?.id.toString()}
            getDescription={(item) => item?.description}
            handleSelect={(item) => hook.setSelectedModel(item)}
        />
        <button
            className='car-model-selector-refresh-btn'
            onClick={hook.reloadAvailableModels}
            disabled={hook.isDealFinalized}
        >
            Refresh available models
        </button>
    </>
});