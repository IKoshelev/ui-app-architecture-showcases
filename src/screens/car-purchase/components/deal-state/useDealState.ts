import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useState, useEffect } from "react";

export const useDealState = () => {
    const [message, setMessage] = useState<string>('message');
    const deal = useDeal();

    // for me this is view logic, but the conditions could easily be extracted into a pure function in Deal.Sync.ts if you think this is business logic
    const getDealStateDescription = (): void => {
        const {
            isApproved,
            expiration,
            hasExpiration
        } = deal.approvalStatus;

        if (deal.isFinalized) {
            setMessage('Congratulations! Deal is finalized.');
        }
        if (isApproved && hasExpiration && !!expiration) {
            setMessage(`Approval granted. Expires in ${expiration} seconds.`);
            return;
        }
        if (isApproved && hasExpiration && expiration === 0) {
            setMessage('Approval expired.');
            return;
        }
        if (isApproved && !hasExpiration) {
            setMessage('Approval granted.');
            return;
        }
        setMessage('');
        return;
    }

    useEffect(() => {
        getDealStateDescription();
    }, [
        deal.approvalStatus,
        deal.isFinalized
    ])

    return {
        message: message,
        showMessage: true
    }
}