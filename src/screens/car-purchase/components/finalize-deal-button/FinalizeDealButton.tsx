import React from 'react';
import { useFinalizeDealButton } from "./useFinalizeDealButton";

export const FinalizeDealButton = () => {

    const hook = useFinalizeDealButton();

    return (
        <button
            className='button-finalzie-deal'
            disabled={hook.isFinalizeDealButtonDisabled}
            onClick={hook.handleFinalizeDealClick}
        >
            Finalize deal
        </button>
    )

}