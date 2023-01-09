import { Show } from "solid-js";
import { SelectDropdown } from "../../../generic-components/SelectDropdown.component";
import { DealVM } from "./Deal.vm";

export const CarModelsSelector = (props: {
    vm: DealVM
}) => {

    return <>
        <Show
            when={!props.vm.state.activeFlows["loading:car-models"]}
            fallback={<div class='car-model-selector-select'>Loading</div>}
        >
            <SelectDropdown
                selectAttributes={{ class: 'car-model-selector-select' }}
                emptyPlaceholder='Please select model'
                hasEmptyOption={true}
                availableItems={props.vm.state.carModelsAvailable}
                vm={props.vm.subVMS.carModelSelected}
                getItemId={(item) => item?.id.toString() ?? ""}
                getItemDescription={(item) => item?.description ?? ""}
                getModelId={(item) => item?.id.toString() ?? ""}
                disabled={props.vm.derivedState.isLoading()
                    || props.vm.state.businessParams.isDealFinalized}
            />
        </Show>

        <button
            class='car-model-selector-refresh-btn'
            onClick={() => props.vm.reloadAvailableCarModels()}
            disabled={props.vm.derivedState.isLoading() || props.vm.state.businessParams.isDealFinalized}
        >
            Refresh available models
        </button>
    </>
};