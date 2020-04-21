import { computed, observable, action } from "mobx";
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

    constructor() {
        this.deals = [...this.deals, createFreshDeal()];
    }
    
    @observable
    public activeDealId: number = 1;
    
    @observable 
    public deals: Deal[] = [];
    
    @computed
    public getActiveDeal = (): Deal | undefined => this.deals.find(x => x.id === this.activeDealId);

    @computed
    public get carModel() {
        const activeDeal: Deal | undefined = this.getActiveDeal();
        return activeDeal?.carModel;
    }

    @computed
    public get selectedEnsurancePlanTypes() {
        const activeDeal: Deal | undefined = this.getActiveDeal();
        return activeDeal?.selectedEnsurancePlanTypes;
    }

    @computed
    public get downpayment() {
        const activeDeal: Deal | undefined = this.getActiveDeal();
        return activeDeal?.downpayment;
    }

    @computed
    public get financingFinilizedToken() {
        const activeDeal: Deal | undefined = this.getActiveDeal();
        return activeDeal?.financingFinilizedToken;
    }
}

export const dealsStore = new DealsStore();