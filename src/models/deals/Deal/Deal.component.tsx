import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericInput } from "../../../generic-components/NumericInput.component";
import type { Dispatch, RootState } from "../../store";
import { CarModelsSelector } from "./CarModelSelector.component";
import { DealProgressState, getCachedSelectorDealDerrivations } from "./Deal";
import './Deal.component.css';
import { InsurancePlanSelector } from "./InsurancePlanSelector.component";
import { diffSeconds } from "../../../util/diffSeconds";

export const DealCmp = (props: {
    dealId: number
}) => (<div className='car-purchase-deal'>
    <DealCmpBare {...props} />
</div>);

export const DealCmpBare = (props: {
    dealId: number
}) => {

    const dealState = useSelector((state: RootState) => getCachedSelectorDealDerrivations(props.dealId)(state));

    const messages = [
        ...dealState.deal.messages,
        ...(dealState.generalValidation.downpaymentExceedsPrice ? [`Downpayment can't exceed total price.`] : []),
        ...(dealState.approval?.isApproved === false ? [dealState.approval.message] : [])
    ];

    const dispatch = useDispatch<Dispatch>();

    return <>
        <div className='car-purchase-model-selector-label'>
            Please select model
    </div>
        <CarModelsSelector dealId={props.dealId} />
        <div className='car-purchase-insurance-selector-label'>
            Please select insurance options
    </div>
        <InsurancePlanSelector dealId={props.dealId} />
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
    </div>
        <NumericInput
            inputAttributes={{ className: 'car-purchase-downpayment' }}
            messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
            modelState={dealState.deal.businessParams.downpayment}
            inputState={dealState.deal.downplaymentInputState}
            disabled={dealState.deal.isLoadingItemized.downpayment
                || dealState.deal.businessParams.isDealFinalized}
            onChange={(inputVal) => dispatch.deals.updateDownpaymentInputValue(props.dealId, inputVal)}
            onBlur={() => dispatch.deals.tryCommitDownpaymentInputValue(props.dealId)}
        />
        <button
            className='button-set-minimum-possible-downpayment'
            disabled={dealState.isLoadingAny
                || !dealState.canRequestMinimumDownpayment}
            onClick={() => dispatch.deals.setMinimumPossibleDownpayment(props.dealId)}
        >
            Set minimum possible
        </button>
        <div className='car-purchase-final-price-label'>
            Final price
    </div>
        <div className='car-final-price'>
            {dealState.finalPrice}
        </div>
        {
            dealState.dealProgressState !== 'no-approval' &&
            <DealDescription dealId={props.dealId}/>
        }
        <button
            className='button-request-approval'
            disabled={dealState.isLoadingAny
                || dealState.isCurrentApprovalLoading
                || !dealState.canRequestApproval}
            onClick={() => dispatch.deals.requestApproval(props.dealId)}
        >
            Request approval
        </button>
        <button
            className='button-close-active-deal'
            onClick={() => dispatch.deals.removeDeal(props.dealId)}
        >
            Close this deal
    </button>
        <button
            className='button-finalzie-deal'
            disabled={dealState.deal.isLoadingItemized.isDealFinalized
                        || !dealState.canBeFinalized}
            onClick={() => dispatch.deals.finalizeDeal(props.dealId)}
        >
            Finalize deal
    </button>
        {  
            (messages.length > 0) &&
            <div className='car-purchase-messages'>
                {messages.map(x => (<div key={x}>{x}</div>))}
            </div>
        }
    </>;
};

function DealDescription(props: {dealId: number}){

    const text =  useSelector((state: RootState) => getDealStateDescription(
        getCachedSelectorDealDerrivations(props.dealId)(state).dealProgressState,
        state.clock.currentDate
    ));

    return <div className='car-purchase-deal-state'>
        {text}
    </div>;

    function getDealStateDescription(state: DealProgressState, currentDate: Date) {
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