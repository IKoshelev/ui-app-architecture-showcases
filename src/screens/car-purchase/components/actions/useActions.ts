import { useDeal, IDealContext } from "../../../../contexts/Deal/Deal.Context";

export const useActions = () => {
    const { id, handleCloseDealClick }  = useDeal();
    
    return {
        handleCloseDealClick: () => handleCloseDealClick(id),
        // handleRequestApprovalClick: () => fetchApproval(),
        // isRequestApprovalButtonDisabled: !canRequestApproval(),
        // handleFinalizeDealClick: () => console.log('handleFinalizeDealClick called'),
        // isFinalizeDealButtonDisabled: false
    }
}