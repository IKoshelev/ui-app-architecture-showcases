import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useEffect } from "react";
import { getDealStatus } from "../../../../contexts/Deal/Deal.Sync";
import { hasDateExpired, secondsBetween } from "../../../../util/date";
import { useCurrentDate } from "../../../../util/useCurrentDate";

export const useDealState = () => {
    const deal = useDeal();

    const getMessageFromDealStatus = (): string => {
        const status = getDealStatus(
            deal.isFinalized,
            deal.approvalStatus.isApproved,
            deal.approvalStatus.expiration,
            deal.approvalStatus.isExpired,
        )

        if (status === 'deal-finalized') {
            return 'Congratulations! Deal is finalized.';
        }
        if (status === 'approval-with-expiry-date') {
            return `Approval granted. Expires in ${timeRemaining} seconds.`;
        }
        if (status === 'approval-expired') {
            return 'Approval expired.';
        }
        if (status === 'approval-perpetual') {
            return 'Approval granted.';
        }

        return '';
    }

    const expiration = deal.approvalStatus.expiration;
    const currentDateHook = useCurrentDate(() => !!expiration && expiration > currentDateHook);
    const timeRemaining = expiration ? secondsBetween(expiration, currentDateHook) : undefined;

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
    }, [deal.approvalStatus.expiration && currentDateHook]);

    return {
        message: getMessageFromDealStatus(),
        showMessage: true
    }
}