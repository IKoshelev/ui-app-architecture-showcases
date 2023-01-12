import { CarModelsSelector } from "./CarModelSelector.component";
import { DealProgressState } from "./Deal";
import './Deal.component.scss';
import { InsurancePlanSelector } from "./InsurancePlanSelector.component";
import { diffSeconds } from "../../../util/diffSeconds";
import { DealVM } from "./Deal.vm";
import { createMemo, For, Show } from "solid-js";
import { addError } from "../../../util/validation-flows-messages";
import { Input } from "../../../generic-components/Input.component";

export const DealComponent = (props: {
    vm: DealVM
}) => (<div class='car-purchase-deal'>
    <DealComponentBare {...props} />
</div>);

export const DealComponentBare = (props: {
    vm: DealVM
}) => {

    const messages = createMemo(() => {
        const messages = [...props.vm.state.messages];

        if (props.vm.derivedState.generalValidation().downpaymentExceedsPrice) {
            addError(
                messages,
                "validation:downpayment",
                `Downpayment can't exceed total price.`)
        }
        const approval = props.vm.derivedState.currentApproval();
        if (approval?.isApproved === false) {
            addError(
                messages,
                "validation:approval",
                approval.message
            )
        }

        return messages;
    });


    return <>
        <div class='car-purchase-model-selector-label'>
            Please select model
        </div>
        <CarModelsSelector vm={props.vm} />
        <div class='car-purchase-insurance-selector-label'>
            Please select insurance options
        </div>
        <InsurancePlanSelector vm={props.vm} />
        <div class='car-purchase-downpayment-label'>
            Please select downpayment
        </div>
        <Input
            inputAttributes={{ class: 'car-purchase-downpayment' }}
            messageAttributes={{ class: 'car-purchase-downpayment-messages' }}
            vm={props.vm.subVMS.downpayment}
            disabled={props.vm.state.activeFlows["loading:downpayment"]
                || props.vm.state.businessParams.isDealFinalized}
        />
        <button
            class='button-set-minimum-possible-downpayment'
            disabled={props.vm.derivedState.isLoading()
                || !props.vm.derivedState.canRequestMinimumDownpayment()}
            onClick={() => props.vm.setMinimumPossibleDownpayment()}
        >
            Set minimum possible
        </button>
        <div class='car-purchase-final-price-label'>
            Final price
        </div>
        <div class='car-final-price'>
            {props.vm.derivedState.finalPrice()}
        </div>
        <Show
            when={props.vm.derivedState.dealProgressState() !== 'no-approval'}
        >
            <DealDescription vm={props.vm} />
        </Show>
        <button
            class='button-request-approval'
            disabled={props.vm.derivedState.isLoading()
                || props.vm.derivedState.isCurrentApprovalLoading()
                || !props.vm.derivedState.canRequestApproval()}
            onClick={() => props.vm.requestApproval()}
        >
            Request approval
        </button>
        <button
            class='button-close-active-deal'
            onClick={() => props.vm.removeThisDeal()}
        >
            Close this deal
        </button>
        <button
            class='button-finalize-deal'
            disabled={props.vm.state.activeFlows["loading:finalizing"]
                || !props.vm.derivedState.canBeFinalized()}
            onClick={() => props.vm.finalizeDeal()}
        >
            Finalize deal
        </button>
        <Show
            when={messages().length > 0}
        ><div class='car-purchase-messages'>
                <For
                    each={messages()}
                >{(message) => <div>{message.type}: {message.message}</div>}
                </For>
            </div>
        </Show>
    </>;
};

function DealDescription(props: {
    vm: DealVM
}) {

    const text = createMemo(() => dealStateDescription(
        props.vm.derivedState.dealProgressState(),
        props.vm.derivedState.currentDate()
    ));

    return <div class='car-purchase-deal-state'>
        {text}
    </div>;

    function dealStateDescription(state: DealProgressState, currentDate: Date) {
        if (state === 'deal-finalized') {
            return 'Congratulations! Deal is finalized.';
        }
        if (state === 'no-approval') {
            return '';
        }
        if (state === 'approval-perpetual') {
            return 'Approval granted.';
        }
        if (state === 'approval-expired') {
            return 'Approval expired.';
        }
        return `Approval granted. Expires in ${diffSeconds(state.approvalExpiresAt, currentDate)} seconds.`;
    }
}