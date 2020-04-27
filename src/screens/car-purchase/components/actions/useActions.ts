import { useDeal } from "../../../../contexts/Deal/Deal.Context";
import { financingClient } from "../../../../api/Financing.Client";
import { canRequestApproval } from "../../../../contexts/Deal/Deal.Sync";
import { useEffect, useState, useRef } from "react";
import useInterval from "../../../../util/useInterval";

export const useActions = () => {
    const [isRequestApprovalButtonDisabled, setIsRequestApprovalButtonDisabled] = useState<boolean>(false);

    const deal = useDeal();

    useEffect(() => {
        const nextValue: boolean = !canRequestApproval(deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid);
        setIsRequestApprovalButtonDisabled(nextValue);

    }, [deal.isLoading, deal.carModel, deal.isFinalized, deal.approvalStatus, deal.isValid]);

    useInterval(() => {
        if (!deal.approvalStatus.expiration) {
            return;
        }
        const expiration = deal.approvalStatus.expiration - 1;
        deal.setApprovalStatus({
            ...deal.approvalStatus,
            expiration,
        });
        return;
    }, 1000, false);

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

                if (result.isApproved && !result.expiration) {
                    console.log('is Approved without expiration', result);
                    deal.setApprovalStatus({
                        isApproved: true,
                        approvalToken: result.approvalToken,
                    })
                    deal.setMessages([]);
                    return;
                } 

                if (result.isApproved && !!result.expiration) {
                    console.log('is Approved with expiration', result);
                    const now = new Date();
                    const difference = result.expiration.getTime() - now.getTime();
                    let differenceRounded = Math.round(difference / 1000);
                    
                    deal.setApprovalStatus({
                        isApproved: true,
                        hasExpiration: true,
                        expiration: differenceRounded,
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
        handleFinalizeDealClick: () => console.log('handleFinalizeDealClick called'),
        isFinalizeDealButtonDisabled: false
    }
}