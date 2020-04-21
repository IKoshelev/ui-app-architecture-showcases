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
let dealIdCounter = 0;

const deal = createFreshDeal();

export function createFreshDeal(): Deal {
    return observable({
        id: (dealIdCounter += 1),
        carModel: undefined,
        selectedEnsurancePlanTypes: [],
        downpayment: undefined,
        financingFinilizedToken: undefined
    })
}

class DealsStore {

    @observable
    public activeDealId: number = 1;
    
    @observable 
    public deals: Deal[] = [deal];
    
    @computed
    public get getActiveDeal(): Deal | undefined { 
        return this.deals.find(deal => deal.id === this.activeDealId)
    };

    @action.bound 
    public setActiveDealId(value: number) {
        this.activeDealId = value
    }

    @computed
    public get carModel() {
        return this.getActiveDeal?.carModel;
    }

    @action.bound 
    public setCarModel(value: CarModel) {
        this.deals = this.deals.map(deal => {
            if (deal.id !== this.activeDealId) {
                return deal;
            }

            return {
                ...deal,
                carModel: value 
            }
        })
    }

    @computed
    public get selectedEnsurancePlanTypes() {
        return this.getActiveDeal?.selectedEnsurancePlanTypes;
    }

    @action.bound 
    public setSelectedEnsurancePlanTypes(value: EnsurancePlanType[]) {
        this.deals = this.deals.map(deal => {
            if (deal.id !== this.activeDealId) {
                return deal;
            }

            return {
                ...deal,
                selectedEnsurancePlanTypes: value 
            }
        })
    }

    @computed
    public get downpayment() {
        return this.getActiveDeal?.downpayment;
    }

    @action.bound 
    public setDownPayment(value: number) {
        this.deals = this.deals.map(deal => {
            if (deal.id !== this.activeDealId) {
                return deal;
            }

            return {
                ...deal,
                setDownPayment: value 
            }
        })
    }

    @computed
    public get financingFinilizedToken() {
        return this.getActiveDeal?.financingFinilizedToken;
    }

    @action.bound 
    public setFinancingFinilizedToken(value: number) {
        this.deals = this.deals.map(deal => {
            if (deal.id !== this.activeDealId) {
                return deal;
            }

            return {
                ...deal,
                financingFinilizedToken: value 
            }
        })
    }
}

export const dealsStore = new DealsStore();