import React from "react";
import { SelectDropdown } from "../../../../generic-components/select-dropdown/SelectDropdown";
import { useCarModelsSelector2 } from "./useCarModelsSelector2";
import { observer } from "mobx-react";

export const CarModelsSelector2: React.FunctionComponent = observer(() => {

    const {
        isLoading,
        isDealFinalized,
        reloadAvailableModels,
        availableModels,
        selectedModel,
        setSelectedModel
    } = useCarModelsSelector2();

    if (isLoading) {
        return <div className='car-model-selector-loading'>Loading</div>
    }
    return <>
        <SelectDropdown
            selectAttributes={{ className: 'car-model-selector-select' }}
            emptyPlaceholder='Please select model'
            vm={{
                availableItems: availableModels,
                selectedItem: selectedModel,
                disabled: isDealFinalized,
                getKeyValue: (item) => item.id.toString(),
                getDescription: (item) => item.description,
                handleSelect: (item) => setSelectedModel(item),
            }}

        />
        <button
            className='car-model-selector-refresh-btn'
            onClick={reloadAvailableModels}
            disabled={isDealFinalized}
        >
            Refresh available models
        </button>
    </>
});