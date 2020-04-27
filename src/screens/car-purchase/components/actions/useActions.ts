import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { financingClient } from "../../../../api/Financing.Client";
import { canRequestApproval } from "../../../../contexts/Deal/Deal.Sync";
import { useState, useEffect } from "react";

let count = 0;

export const useActions = () => {
    const [isRequestApprovalButtonDisabled, setIsRequestApprovalButtonDisabled] = useState<boolean>(false);

    const deal = useDeal();

    useEffect(() => {
        const nextValue: boolean = !canRequestApproval(deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid);
        setIsRequestApprovalButtonDisabled(nextValue);

    }, [deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid]);

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
            
                if (result.isApproved && !result.expiration) {
                    deal.setApprovalStatus({
                        isApproved: true,
                        approvalToken: result.approvalToken
                    })
                    deal.setMessages([]);
                    return;
                } 

                if (result.isApproved && !!result.expiration) {              
                    deal.setApprovalStatus({
                        isApproved: true,
                        expiration: result.expiration,
                        isExpired: false,
                        approvalToken: result.approvalToken,
                    })
                    deal.setMessages([]);
                } 

                if (!result.isApproved) {
                    deal.setApprovalStatus({
                        isApproved: false
                    });
                    deal.
                    setMessages([result.message]);
                }
                

            } finally {
                deal.setIsLoading(false)
            }

        },
        isRequestApprovalButtonDisabled,
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
        isFinalizeDealButtonDisabled: false
    }
}