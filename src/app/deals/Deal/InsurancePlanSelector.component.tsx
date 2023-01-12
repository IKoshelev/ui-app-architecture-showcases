import { Show } from "solid-js";
import { SelectMultiple } from "../../../generic-components/SelectMultiple.component";

import { DealVM } from "./Deal.vm";

export const InsurancePlanSelector = (props:{
    vm: DealVM
}) => {

    return <>
        <Show
            when={!props.vm.state.activeFlows["loading:insurance-plans"]}
            fallback={<div class='insurance-plan-selector-select'>Loading</div>}
        >
            <SelectMultiple
                selectAttributes={{ class: 'insurance-plan-selector-select' }}
                availableItems={props.vm.state.insurancePlansAvailable}
                vm={props.vm.subVMS.insurancePlansSelected}
                disabled={props.vm.derivedState.isLoading()}
                getItemId={(item) => item.type.toString()}
                getItemDescription={(item) => item.description}
                getModelId={(model) => model.type.toString()}
            />
        </Show>
        <button
            class='insurance-plan-selector-refresh-btn'
            onClick={() => props.vm.reloadAvailableInsurancePlans()}
            disabled={props.vm.derivedState.isLoading() || props.vm.state.businessParams.isDealFinalized}
        >
            Refresh available plans
        </button>
    </>
}