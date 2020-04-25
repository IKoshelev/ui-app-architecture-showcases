import { dealsStore } from "../../../../stores/Deals.Store"

export const useMessages = () => {
    const message = dealsStore.status?.expirationTimer;
    return {
        messages: [message],
        showMessages: true
    }
}