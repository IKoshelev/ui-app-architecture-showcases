import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { financingClient } from "../../../../api/Financing.Client";
import { useEffect, useState } from "react";
import { canFinalizeDeal } from "../../../../contexts/Deal/Deal.Sync";

export const useFinalizeDealButton = () => {
    const [isFinalizeDealButtonDisabled, setIsFinalizeDealButtonDisabled] = useState<boolean>(true);
    const deal = useDeal();

    useEffect(() => {

        const nextValue = !canFinalizeDeal(deal.isLoading, deal.isFinalized, deal.approvalStatus.isApproved, deal.approvalStatus.isExpired);
        setIsFinalizeDealButtonDisabled(nextValue);
    }, [deal.isLoading, deal.approvalStatus.isApproved, deal.isFinalized, deal.approvalStatus.isExpired]);

    return {
        handleFinalizeDealClick: async () => {
            if (!deal.approvalStatus.approvalToken) {
                return;
            }

            deal.setIsLoading(true);
            deal.setMessages([]);

            try {
                const result = await financingClient.finalizeFinancing(
                    deal.approvalStatus.approvalToken,
                    true
                );

                if (!result) {
                    deal.setMessages(['Deal finalization failed.']);
                    return;
                }
                deal.setIsFinalized(true);
            }
            finally {
                deal.setIsLoading(false);
            }
        },
        isFinalizeDealButtonDisabled
    }
}