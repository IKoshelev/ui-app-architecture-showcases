import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { financingClient } from "../../../../api/Financing.Client";

export const useActions = () => {
    const { id, handleCloseDealClick }  = useDeal();

    const deal = useDeal();
    const hasCarModel = !!deal?.carModel;
    const hasExpired = !!deal.expirationTimer;
    
    return {
        handleCloseDealClick: () => handleCloseDealClick(id),
        handleRequestApprovalClick: async () => {
            if (!deal.carModel) {
                return;
            }
            const result = await financingClient.getApproval(
                deal.carModel,
                deal.selectedInsurancePlans.map(plan => plan.type),
                deal.downpayment
            );

            const nextExpirationTimer: number = result.isApproved ? 15 : 0;
            console.log('result', result);
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
        },
        isRequestApprovalButtonDisabled: !(deal.isLoading
                                        || !!deal?.carModel
                                        || deal.isFinalized
                                        || deal.isApproved
                                        || !!deal.expirationTimer),
        handleFinalizeDealClick: () => console.log('handleFinalizeDealClick called'),
        isFinalizeDealButtonDisabled: false
    }
}