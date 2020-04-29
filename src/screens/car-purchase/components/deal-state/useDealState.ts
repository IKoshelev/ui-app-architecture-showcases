import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useState, useEffect } from "react";
import { getDealStatus } from "../../../../contexts/Deal/Deal.Sync";
import useInterval from "../../../../util/useInterval";
import { hasDateExpired, timeRemainingBetweenDateAndNow } from "../../../../util/date";

export const useDealState = () => {
    const [message, setMessage] = useState<string>('message');
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);
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

    useEffect(() => {
        setMessageFromDealStatus();
        if (deal.approvalStatus.isApproved && deal.approvalStatus.isExpired === false) {
            setIsRunning(true);
        }
    }, [
        deal.approvalStatus,
        deal.isFinalized,
        timeRemaining
    ])

    useInterval(() => {
        if (!deal.approvalStatus.expiration) {
            return;
        }

        const nextValue: number = timeRemainingBetweenDateAndNow(deal.approvalStatus.expiration);
        setTimeRemaining(nextValue);

        if (hasDateExpired(deal.approvalStatus.expiration)) {
            deal.setApprovalStatus({
                ...deal.approvalStatus,
                isExpired: true
            })
            setIsRunning(false);
            return;
        }

    }, isRunning ? 1000 : null, true);

    useEffect(() => {
        if (deal.approvalStatus.expiration) {
            const nextValue: number = timeRemainingBetweenDateAndNow(deal.approvalStatus.expiration);
            setTimeRemaining(nextValue);
        }
    }, [deal.approvalStatus.expiration])

    return {
        message: message,
        showMessage: true
    }
}