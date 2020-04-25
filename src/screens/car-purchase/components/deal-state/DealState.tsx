import React from 'react';
import { useDealState } from './useDealState';

export const DealState = () => {
    const hook = useDealState();

    if (!hook.showMessage) {
        return null;
    }

    return (
        <div className='car-purchase-deal-state'>
            {hook.message}
        </div>
    )
}