import { useDeal } from "../../../../contexts/Deal/Deal.Context";

export const useMessages = () => {
    const deal = useDeal();
    return {
        messages: deal.messages,
        showMessages: true
    }
}