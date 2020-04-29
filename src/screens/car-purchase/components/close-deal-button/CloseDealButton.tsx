import React from 'react';
import { useCloseDealButton } from "./useCloseDealButton"

export const CloseDealButton = () => {

    const hook = useCloseDealButton();

    return (
        <button
            className='button-close-active-deal'
            onClick={hook.handleCloseDealClick}
            >
            Close this deal
        </button>
    )

}