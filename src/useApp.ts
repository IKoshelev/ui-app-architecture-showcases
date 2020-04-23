import { dealsStore } from "./stores/Deals.Store"

export const useApp = () => {
    return {
        deals: dealsStore.deals,
        activeDealId: dealsStore.activeDealId,
        handleAddNewDealClick: () => dealsStore.addNewDeal(),
        handleSelectDealClick: (id: number) => dealsStore.setActiveDealId(id),
        handleCloseDealClick: () => dealsStore.closeActiveDeal()
    }
}