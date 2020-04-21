import { computed, observable } from "mobx";
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
let dealIdCounter = 0;

const deal = createFreshDeal();

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

    @observable
    public activeDealId: number = 1;
    
    @observable 
    public deals: Deal[] = [deal];
    
    @computed
    public get getActiveDeal(): Deal | undefined { 
        return this.deals.find(x => x.id === this.activeDealId)
    };

    @computed
    public get carModel() {
        return this.getActiveDeal?.carModel;
    }

    @computed
    public get selectedEnsurancePlanTypes() {
        return this.getActiveDeal?.selectedEnsurancePlanTypes;
    }

    @computed
    public get downpayment() {
        return this.getActiveDeal?.downpayment;
    }

    @computed
    public get financingFinilizedToken() {
        return this.getActiveDeal?.financingFinilizedToken;
    }
}

export const dealsStore = new DealsStore();