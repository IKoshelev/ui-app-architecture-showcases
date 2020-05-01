import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useState, useEffect } from "react";
import { getDealStatus } from "../../../../contexts/Deal/Deal.Sync";
import { hasDateExpired, timeRemainingBetween } from "../../../../util/date";
import { useCurrentDate1secondResolution } from "../../../../util/useCurrentDate1seccondResolution";

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
    const currentDateHook = useCurrentDate1secondResolution(!!expiration && expiration > new Date());
    const timeRemaining = expiration ? timeRemainingBetween(expiration, currentDateHook) : undefined;

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