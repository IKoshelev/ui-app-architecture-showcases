import { observer } from "mobx-react";
import React from "react";
import { CarPurchaseVM } from "./CarPurchase.VM";
import { CarModelsSelector } from "./car-model-selector/CarModelsSelector";
import { EnsurancePlanSelector } from "./ensurance-plan-selector/EnsurancePlanSelector";
import './CarPurchase.css';

const IsolatedRenderer: React.FunctionComponent<{
    render: () => JSX.Element
}> = observer(({ render }) => {
    console.log('Rendering isolated cmp');
    return render();
});

export const CarPurchase: React.FunctionComponent<{
    vm: CarPurchaseVM
}> = observer(({ vm }) => {
    console.log('Rendering CarPurchase');
    return <>
        <div className='car-purchase-main-logo'>
            Welcome to Crazy Ivan Motors
        </div>
        <div className='car-purchase-model-selector-label'>
            Please select model
        </div>
        <CarModelsSelector vm={vm.carModelSelectorVM} />
        <div className='car-purchase-ensurance-selector-label'>
            Please select insurance options
        </div>
        <EnsurancePlanSelector vm={vm.ensurancePlanSelectorVM} />
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
        </div>
        <input
            className='car-purchase-downpayment'
            type='number'
            value={vm.downpayment}
            disabled={vm.isDealFinilized}
            onChange={(e) => vm.setDownpayment(e.target.value)}
        />
        <div className='car-purchase-final-price-label'>
            Final price
        </div>
        <div className='car-final-price'>
            {vm.finalPrice}
        </div>
        <IsolatedRenderer render={() => (<>
            {
                vm.dealState &&
                <div className='car-purchase-deal-state'>
                    {vm.dealState}
                </div>
            }
        </>)} />
        {
            vm.canRequestApproval &&
            <button
                className='button-request-approval'
                disabled={vm.isLoading || vm.isDealFinilized}
                onClick={vm.getApproval}
            >
                Request approval
            </button>
        }
        {
            vm.canFinalizeDeal &&
            <button
                className='button-finalzie-deal'
                disabled={vm.isLoading || vm.isDealFinilized}
                onClick={vm.finalzieDeal}
            >
                Finalize deal
            </button>
        }
        {
            vm.messages.length > 0 &&
            <div className='car-purchase-messages'>
                {vm.messages.map(x => (<div key={x}>{x}</div>))}
            </div>
        }
    </>
});