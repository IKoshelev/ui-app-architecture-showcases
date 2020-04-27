import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { financingClient } from "../../../../api/Financing.Client";
import { canRequestApproval } from "../../../../contexts/Deal/Deal.Sync";
import { useEffect, useState } from "react";

export const useActions = () => {
    const [isRequestApprovalButtonDisabled, setIsRequestApprovalButtonDisabled] = useState<boolean>(false);
    const deal = useDeal();

    useEffect(() => {
        const nextValue: boolean = !canRequestApproval(deal.isLoading, deal.carModel, deal.isFinalized, deal.isApproved, deal.expirationTimer, deal.isValid);
        setIsRequestApprovalButtonDisabled(nextValue);

    }, [deal.isLoading, deal.carModel, deal.isFinalized, deal.isApproved, deal.expirationTimer, deal.isValid])

    return {
        handleCloseDealClick: () => deal.handleCloseDealClick(deal.id),
        handleRequestApprovalClick: async () => {
            if (!deal.carModel) {
                return;
            }
            deal.setIsLoading(true);
            try {
            const result = await financingClient.getApproval(
                deal.carModel,
                deal.selectedInsurancePlans.map(plan => plan.type),
                deal.downpayment
            );
            console.log('result', result);
            const nextExpirationTimer: number = result.isApproved ? 15 : 0;
            deal.setExpirationTimer(nextExpirationTimer);
            deal.setIsApproved(result.isApproved);
            if (result.isApproved) {
                deal.setApprovalToken(result.approvalToken);
                deal.setMessages([]);
            } else {
                deal.setMessages([result.message]);
            }

            setInterval(() => {
                if (deal.expirationTimer && deal.expirationTimer > 0) {
                    const timeLeft = deal.expirationTimer - 1;
                    deal.setExpirationTimer(timeLeft);
                }
            }, 1000)
            } finally {
                deal.setIsLoading(false)
            }

        },
        isRequestApprovalButtonDisabled,
        handleFinalizeDealClick: () => console.log('handleFinalizeDealClick called'),
        isFinalizeDealButtonDisabled: false
    }
}