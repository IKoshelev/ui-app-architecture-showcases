import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NumericInput } from "../../generic-components/NumericInput.component";
import type { Dispatch, RootState } from "../../store";
import { CarModelsSelector } from "./CarModelSelector.component";
import { canSetMinimumDownpayment, DealProgressState, getDealProgresssState, getFinalPrice } from "./deal";
import './Deal.component.css';
import { InsurancePlanSelector } from "./InsurancePlanSelector.component";
import { isLoadingAny } from "../../util/isLoadingAny";

export const DealCmp: React.FunctionComponent<{
    dealId: number
}> = (props) => (<div className='car-purchase-deal'>
    <DealCmpBare {...props} />
</div>);

const DealCmpBare: React.FunctionComponent<{
    dealId: number
}> = (props) => {

    const dispatch = useDispatch<Dispatch>();

    const dealState = useSelector((state: RootState) => 
    state.deals.deals.find(x => x.businessParams.dealId === props.dealId))!;
    
    const dealProgresssState = useSelector((state: RootState) => {
        const deal = state.deals.deals.find(x => x.businessParams.dealId === props.dealId)!;
        const currentDate = state.clock.currentDate;
        return getDealProgresssState(deal, currentDate);
    });

    const isLoading = isLoadingAny(dealState.isLoadingItemized);

    return <>
        <div className='car-purchase-model-selector-label'>
            Please select model
    </div>
        <CarModelsSelector dealId={dealState.businessParams.dealId} />
        <div className='car-purchase-insurance-selector-label'>
            Please select insurance options
    </div>
        <InsurancePlanSelector dealId={dealState.businessParams.dealId} />
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
    </div>
        <NumericInput
            inputAttributes={{ className: 'car-purchase-downpayment' }}
            messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
            modelState={dealState.businessParams.downpayment}
            inputState={dealState.downplaymentInputState}
            disabled={dealState.isLoadingItemized.downpayment 
                        || dealState.businessParams.isDealFinalized}
            onChange={(newModelState, newInputState) => {
                dispatch.deals.updateDownpayment(
                    dealState.businessParams.dealId,
                    [newModelState ?? 0, newInputState]);
            }}
        />
        <button
            className='button-set-minimum-possible-downpayment'
            disabled={isLoadingAny(dealState.isLoadingItemized) 
                        || !canSetMinimumDownpayment(dealState.businessParams)}
            onClick={() => dispatch.deals.setMinimumPossibleDownpayment(dealState.businessParams.dealId)}
        >
            Set minimum possible
        </button> 
        <div className='car-purchase-final-price-label'>
            Final price
    </div>
        <div className='car-final-price'>
            {getFinalPrice(dealState.businessParams)}
        </div>
        {
            dealProgresssState !== 'no-approval' &&
            <div className='car-purchase-deal-state'>
                {getDealStateDescription(dealProgresssState)}
            </div>
        }
        <button
            className='button-request-approval'
            disabled={isLoading}
            onClick={() => dispatch.deals.requestApproval(dealState.businessParams.dealId)}
        >
            Request approval
        </button> 
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