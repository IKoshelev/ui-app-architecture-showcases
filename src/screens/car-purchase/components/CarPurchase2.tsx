import { observer } from "mobx-react";
import React from 'react';
import { CarModelsSelector2 } from "./car-model-selector/CarModelsSelector2";
import { InsurancePlanSelector } from "./ensurance-plan-selector/InsurancePlanSelector";
import { DownPayment } from "./down-payment/DownPayment";

export const CarPurchase2: React.FunctionComponent = observer(() => {
    return <>
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
    </>
})