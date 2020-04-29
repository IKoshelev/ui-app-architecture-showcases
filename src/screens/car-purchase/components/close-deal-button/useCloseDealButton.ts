import { useDeal } from "../../../../contexts/Deal/Deal.Context";

export const useCloseDealButton = () => {

    const deal = useDeal();

    return {
        handleCloseDealClick: () => deal.handleCloseDealClick(deal.id)
    }
}