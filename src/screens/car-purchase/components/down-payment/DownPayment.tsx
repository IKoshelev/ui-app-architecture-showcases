import React from 'react';
import { useDownPayment } from './useDownPayment';
import { observer } from 'mobx-react';
import { NumericInput2 } from '../../../../generic-components/numeric-input/NumericInput2';

export const DownPayment: React.FC = observer(() => {

    const {
        isDisabled,
        handleClick,
        isValid,
        value,
        message,
        handleChange,
        handleBlur
    } = useDownPayment();

    return (
        <>
            <NumericInput2
                inputAttributes={{ className: 'car-purchase-downpayment' }}
                messageAttributes={{ className: 'car-purchase-downpayment-messages' }}
                isValid={isValid}
                displayedValue={value}
                handleChange={handleChange}
                handleBlur={handleBlur}
                message={message}
            />
            <button
                className='button-set-minimum-possible-downpayment'
                disabled={isDisabled}
                onClick={handleClick}
            >
                Set minimum possible
            </button>
        </>
    )
})