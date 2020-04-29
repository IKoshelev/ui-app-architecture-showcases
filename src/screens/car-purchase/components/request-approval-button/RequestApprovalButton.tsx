import React from 'react';
import { useRequestApprovalButton } from "./useRequestApprovalButton";

export const RequestApprovalButton = () => {

    const hook = useRequestApprovalButton();

    return (
        <button
            className='button-request-approval'
            disabled={hook.isRequestApprovalButtonDisabled}
            onClick={hook.handleRequestApprovalClick}
        >
            Request approval
        </button>
    )

}