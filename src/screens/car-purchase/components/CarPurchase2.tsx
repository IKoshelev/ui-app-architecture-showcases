import { observer } from "mobx-react";
import React, { useMemo, memo } from 'react';
import { CarModelsSelector2 } from "./car-model-selector/CarModelsSelector2";
import { InsurancePlanSelector } from "./ensurance-plan-selector/InsurancePlanSelector";
import { DownPayment } from "./down-payment/DownPayment";
import { calculateFinalPrice } from "../../../stores/Deals.Sync";
import { Actions } from "./actions/Actions";
import { DealState } from "./deal-state/DealState";
import { Messages } from "./messages/Messages";

export const CarPurchase2 = memo(() => {
    console.log('CarPurchase2');
    return (
    <>  
        <div className='car-purchase-model-selector-label'>
            Please select model
        </div>
        <CarModelsSelector2 />
        <div className='car-purchase-ensurance-selector-label'>
            Please select insurance options
        </div>
        <InsurancePlanSelector />
        <div className='car-purchase-downpayment-label'>
            Please select downpayment
        </div>
        <DownPayment />
        <div className='car-purchase-final-price-label'>
            Final price
        </div>
        <div className='car-final-price'>
            {calculateFinalPrice()}
        </div>
        <DealState />
        <Actions />
        <Messages />
    </>
)
});