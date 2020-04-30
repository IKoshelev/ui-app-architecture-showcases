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
        // looks like this function could just take whole deal?
        const status = getDealStatus(
            deal.isFinalized,
            deal.approvalStatus.isApproved,
            deal.approvalStatus.expiration,
            deal.approvalStatus.isExpired,
        )

        // I really don't like this explicit state setting.
        // Derived computed state is much less prone to bugs.
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
        // i only see 1 of this dependencies used in the hook above.
        // They ARE used indirectly by setMessageFromDealStatus,
        // but it is not far-less visible. Next thing that will happen -
        // we will add another dependency to setMessageFromDealStatus and forget to add it here.
        // This is a bug waiting to happen.
        deal.approvalStatus,
        deal.isFinalized,
        timeRemaining
    ])

    // This is a bug waiting to happen and it will be impossible to change.
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