import React from "react";
import { Deal, DealProgressState } from "./deal";
// import { CarModelsSelector } from "./car-model-selector/CarModelsSelector";
// import { InsurancePlanSelector } from "./insurance-plan-selector/InsurancePlanSelector";
// import { NumericInput } from "../../../generic-components/numeric-input/NumericInput";
import './Deal.component.css';

export const DealCmp: React.FunctionComponent<{
    dealId: number
}> = (props) => (<div className='car-purchase-deal'>
    <DealCmpBare {...props} />
</div>);

const DealCmpBare: React.FunctionComponent<{
    dealId: number
}> = (props) => {

    return <>
        <div className='car-purchase-model-selector-label'>
            Please select model
    </div>
        {/* <CarModelsSelector vm={vm.carModelSelectorVM} /> */}
        <div className='car-purchase-insurance-selector-label'>
            Please select insurance options
    </div>
        {/* <InsurancePlanSelector vm={vm.insurancePlanSelectorVM} /> */}
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
    </div>
        {/* <NumericInput
            inputAttributes={{ className: 'car-purchase-downpayment' }}
            messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
            vm={vm.downpaymentInputVm}
        /> */}
        {/* <button
            className='button-set-minimum-possible-downpayment'
            disabled={!vm.canSetMinimumPossibleDownpayment}
            onClick={vm.setMinimumPossibleDownpayment}
        >
            Set minimum possible
    </button> */}
        <div className='car-purchase-final-price-label'>
            Final price
    </div>
        {/* <div className='car-final-price'>
            {vm.finalPrice}
        </div> */}
{/* 
        {
            vm.dealState !== 'no-approval' &&
            <div className='car-purchase-deal-state'>
                {getDealStateDescription(vm.dealState)}
            </div>
        } */}
        {/* <button
            className='button-request-approval'
            disabled={!vm.canRequestApproval}
            onClick={vm.getApproval}
        >
            Request approval
    </button> */}
        {/* <button
            className='button-close-active-deal'
            onClick={vm.close}
        >
            Close this deal
    </button> */}
        {/* <button
            className='button-finalzie-deal'
            disabled={!vm.canFinalizeDeal}
            onClick={vm.finalzieDeal}
        >
            Finalize deal
    </button> */}
        {/* {
            vm.messages.length > 0 &&
            <div className='car-purchase-messages'>
                {vm.messages.map(x => (<div key={x}>{x}</div>))}
            </div>
        } */}
    </>;

    function getDealStateDescription(state: DealProgressState) {
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
        return `Approval granted. Expires in ${state.approvalExpiresInSeconds} seconds.`;
    }
};