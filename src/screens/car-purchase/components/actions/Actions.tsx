import React, { memo } from 'react';
import { useActions } from './useActions';

export const Actions = () => {

    const hook = useActions();

    return (
        <>
            <button
                className='button-close-active-deal'
                onClick={hook.handleCloseDealClick}
                >
                Close this deal
            </button>
            <button
                className='button-request-approval'
                disabled={hook.isRequestApprovalButtonDisabled}
                onClick={hook.handleRequestApprovalClick}
            >
                Request approval
            </button>
            <button
                className='button-finalzie-deal'
                disabled={hook.isFinalizeDealButtonDisabled}
                onClick={hook.handleFinalizeDealClick}
            >
                Finalize deal
            </button>
        </>
    )
};

