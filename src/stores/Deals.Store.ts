// properties
// activeDeal - a uniquie identifier for which deal the user has selected
// Deals - an array containing the selected values of each deal, each with a unique identifier
// isLoading

import { CarModel } from "../api/CarInventory.Client";
import { EnsurancePlanType } from "../api/CarEnsurance.Client";

export type Deal = {
    id: number,
    carModel: CarModel | undefined,
    selectedEnsurancePlanTypes: EnsurancePlanType[],
    downpayment: number | undefined,
    financingFinilizedToken: number | undefined
}

// assume deal ids are unique enough, 
// in real app this would be a generated guid or we woud get the from back-end
let dealIdCounter = 1;

export function createFreshDeal(): Deal {
    return {
        id: (dealIdCounter += 1),
        carModel: undefined,
        selectedEnsurancePlanTypes: [],
        downpayment: undefined,
        financingFinilizedToken: undefined
    }
}

class DealsStore {

    public activeDealId: number | undefined;

    public readonly deals: Deal[] = [];

    public getActiveDeal = () => this.deals.find(x => x.id === this.activeDealId);
}

export const dealsStore = new DealsStore();