import { observable } from "mobx";
import { dealsStore } from "./Deals.Store";
import { Deal } from "./Deals.Types";

// assume deal ids are unique enough, 
// in real app this would be a generated guid or we woud get the from back-end
let dealIdCounter = 0;

export const defaultDealStatus = {
    isApproved: false,
    expirationTimer: 0,
    isFinalized: false,
    finalizedToken: '',
    messages: []
}

export function createFreshDeal(): Deal {
    return observable({
        id: (dealIdCounter += 1),
        carModel: undefined,
        availableCarModels: [],
        selectedInsurancePlans: [],
        availableInsurancePlans: [],
        downpayment: undefined,
        financingFinilizedToken: undefined,
        isLoading: false,
        status: defaultDealStatus
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

export const canRequestApproval = (): boolean => {
    if (dealsStore.isLoading) {
        return false;
    }

    const status = dealsStore.status;
    if (!status) {
        return false;
    }

    return !status.isFinalized
        && !status.isApproved
        && !(status.expirationTimer > 0);
}