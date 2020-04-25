import { useState } from 'react';

let dealId = 1;

export const useApp = () => {
    const [activeDealId, setActiveDealId] = useState<number>(dealId);
    const [dealIds, setDealIds] = useState<number[]>([dealId]);

    return {
        dealIds,
        activeDealId,
        handleAddNewDealClick() {
            setDealIds([...dealIds, ++dealId])
            setActiveDealId(dealId)
        },
        handleSelectDealClick: (id: number) => setActiveDealId(id),
        handleCloseDealClick(id: number) {
            const activeIdIndex = dealIds.findIndex(id => id === activeDealId);
            const nextDealIds = dealIds.filter(dealId => dealId !== id);
            setDealIds(nextDealIds);
            if (nextDealIds.length === 0) {
                setActiveDealId(0);
                return;
            }
            const previousId = dealIds[activeIdIndex - 1];
            const nextId = dealIds[activeIdIndex + 1];
            if (previousId) {
                setActiveDealId(previousId);
                return;
            }
            setActiveDealId(nextId);
        }
    }
}