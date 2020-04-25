import { dealsStore } from "../../../../stores/Deals.Store"
import { fetchApproval } from "../../../../stores/Deals.Async"
import { canRequestApproval } from "../../../../stores/Deals.Sync"

export const useActions = () => {
    return {
        handleCloseDealClick: () => dealsStore.closeActiveDeal(),
        handleRequestApprovalClick: () => fetchApproval(),
        isRequestApprovalButtonDisabled: !canRequestApproval(),
        handleFinalizeDealClick: () => console.log('handleFinalizeDealClick called'),
        isFinalizeDealButtonDisabled: false
    }
}