import React, { memo } from 'react';
import { useActions } from './useActions';
import { observer } from 'mobx-react';
import { dealsStore } from '../../../../stores/Deals.Store';

const render = () => true;

export const Actions = observer((() => {
    console.log('Actions');
    const hook = useActions();

    return (
        <>
            <button
                className='button-close-active-deal'
                onClick={hook.handleCloseDealClick}
                >
                Close this deal
            </button>
            {/* <button
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
            </button> */}
        </>
    )
}))

