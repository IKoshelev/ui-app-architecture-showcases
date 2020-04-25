import React from 'react';
import { useFinalPrice } from "./useFinalPrice";

export const FinalPrice = () => {
    const hook = useFinalPrice();

    return (
        <div className='car-final-price'>
            {hook.finalPrice}
        </div>
    )
}