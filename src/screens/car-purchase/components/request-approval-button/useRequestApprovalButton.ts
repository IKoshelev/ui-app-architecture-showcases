import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { useEffect, useState } from "react";
import { canRequestApproval } from "../../../../contexts/Deal/Deal.Sync";
import { financingClient } from "../../../../api/Financing.Client";

export const useRequestApprovalButton = () => {
    // i'm not sure, why this button suddenly needs its own state? 
    // its state is completely derived from state of the deal, no?
    const [isRequestApprovalButtonDisabled, setIsRequestApprovalButtonDisabled] = useState<boolean>(false);

    const deal = useDeal();

    useEffect(() => {
        const nextValue: boolean = !canRequestApproval(deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid);
        setIsRequestApprovalButtonDisabled(nextValue);

    }, [deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid]);

    return {
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
                    deal.setMessages([result.message]);
                }


            } finally {
                deal.setIsLoading(false)
            }

        },
        isRequestApprovalButtonDisabled,
    }
}