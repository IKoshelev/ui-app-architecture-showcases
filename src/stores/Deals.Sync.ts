import { observable } from "mobx";
import { Deal, dealsStore } from "./Deals.Store";
import { EnsurancePlanType, EnsurancePlan } from "../api/CarEnsurance.Client";

// assume deal ids are unique enough, 
// in real app this would be a generated guid or we woud get the from back-end
let dealIdCounter = 0;

export function createFreshDeal(): Deal {
    return observable({
        id: (dealIdCounter += 1),
        carModel: undefined,
        availableCarModels: [],
        selectedInsurancePlans: [],
        availableInsurancePlans: [],
        downpayment: undefined,
        financingFinilizedToken: undefined,
        isLoading: false
    })
}

export const calculateFinalPrice = (): number | undefined => {
    const basePrice = dealsStore?.carModel?.basePrice;
    if (!basePrice) {
        return undefined;
    }

    const priceIncrease = dealsStore?.selectedInsurancePlans?.map(plan => basePrice * plan.rate)
        .reduce((prev, cur) => prev + cur, 0) ?? 0;

    return basePrice + priceIncrease;
}