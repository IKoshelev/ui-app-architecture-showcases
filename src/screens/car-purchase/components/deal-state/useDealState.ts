import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useState, useEffect } from "react";
import { FinancingApproved, FinancingNotApproved } from "../../../../api/Financing.Client";

export const useDealState = () => {
    const [message, setMessage] = useState<string>('message');
    const deal = useDeal();

    // Work in progress, the current implementation is wrong imo and needs to be fixed before progressing
    const getDealStateDescription = (): void => {
        if (deal.isFinalized) {
            setMessage('Congratulations! Deal is finalized.');
        }
        if (deal.isApproved && !!deal.expirationTimer) {
            setMessage('Approval expired.');
            return;
        }
        if (deal.isApproved && !!deal.expirationTimer) {
            setMessage(`Approval granted. Expires in ${deal.expirationTimer} seconds.`);
        }
        if (deal.isApproved) {
            setMessage('Approval granted.');
            return;
        }
        setMessage('');
        return;
    }

    useEffect(() => {
        getDealStateDescription();
    })

    return {
        message: message,
        showMessage: true
    }
}