import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useState, useEffect } from "react";
import { getDealStatus } from "../../../../contexts/Deal/Deal.Sync";
import { hasDateExpired, timeRemainingBetween } from "../../../../util/date";
import { useCurrentDate1secondResolution } from "../../../../util/useCurrentDate1seccondResolution";

export const useDealState = () => {
    const [message, setMessage] = useState<string>('message');
    const currentDateHook = useCurrentDate1secondResolution();
    const deal = useDeal();

    const setMessageFromDealStatus = (): void => {
        const status = getDealStatus(
            deal.isFinalized,
            deal.approvalStatus.isApproved,
            deal.approvalStatus.expiration,
            deal.approvalStatus.isExpired,
        )

        if (status === 'deal-finalized') {
            setMessage('Congratulations! Deal is finalized.');
            return;
        }
        if (status === 'approval-with-expiry-date') {
            setMessage(`Approval granted. Expires in ${timeRemaining} seconds.`);
            return;
        }
        if (status === 'approval-expired') {
            setMessage('Approval expired.');
            return;
        }
        if (status === 'approval-perpetual') {
            setMessage('Approval granted.');
            return;
        }
        setMessage('');
        return;
    }

    const expiration = deal.approvalStatus.expiration;
    const timeRemaining = expiration ? timeRemainingBetween(expiration, currentDateHook) : undefined;

    useEffect(() => {
        setMessageFromDealStatus();
    }, [
        deal.approvalStatus,
        deal.isFinalized,
        timeRemaining
    ]);

    useEffect(() => {
        if (!deal.approvalStatus.expiration) {
            return;
        }

        if (hasDateExpired(deal.approvalStatus.expiration)) {
            deal.setApprovalStatus({
                ...deal.approvalStatus,
                isExpired: true
            })
            return;
        }
    }, [currentDateHook]);

    return {
        message: message,
        showMessage: true
    }
}