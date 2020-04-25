import React from 'react';
import { useDownPayment } from './useDownPayment';
import { observer } from 'mobx-react';
import { NumericInput2 } from '../../../../generic-components/numeric-input/NumericInput2';

export const DownPayment: React.FC = observer(() => {

    const hook = useDownPayment();

    return (
        <>
            <NumericInput2
                inputAttributes={{ className: 'car-purchase-downpayment' }}
                messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
                isValid={hook.isValid}
                displayedValue={hook.value}
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
})