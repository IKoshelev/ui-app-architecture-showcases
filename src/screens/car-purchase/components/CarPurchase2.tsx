import { observer } from "mobx-react";
import React from 'react';
import { CarModelsSelector2 } from "./car-model-selector/CarModelsSelector2";

export const CarPurchase2: React.FunctionComponent = observer(() => {
    return <>
        <div className='car-purchase-model-selector-label'>
            Please select model
        </div>
        <CarModelsSelector2 />
    </>
})