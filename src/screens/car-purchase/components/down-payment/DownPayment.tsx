import React, { memo } from 'react';
import { useDownPayment } from './useDownPayment';
import { NumericInput2 } from '../../../../generic-components/numeric-input/NumericInput2';

export const DownPayment: React.FC = () => {

    const hook = useDownPayment();

    return (
        <>
            <NumericInput2
                inputAttributes={{ className: 'car-purchase-downpayment' }}
                messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
                isValid={hook.isValid}
                isDisabled={hook.isDisabled}
                displayedValue={hook.displayedValue}
                handleChange={hook.handleChange}
                handleBlur={hook.handleBlur}
                message={hook.message}
            />
            <button
                className='button-set-minimum-possible-downpayment'
                disabled={hook.isDisabled}
                onClick={hook.handleClick}
            >
                Set minimum possible
            </button>
        </>
    )
}