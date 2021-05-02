import { carInsuranceClient, InsurancePlan } from "../../api/CarInsurance.Client";
import { carInvenotryClient, CarModel } from "../../api/CarInventory.Client";

const defaultDeal = {
    dealId: 0,
    isDealFinalized: true,
    isLoading: false,
    downpayment: 0,
    insurancePlansAvailable: [] as InsurancePlan[],
    insurancePlanSelected: undefined as InsurancePlan | undefined,
    carModelsAvailable: [] as CarModel[],
    carModelSelected: undefined as CarModel | undefined,
    messages: [] as string[]
}

export type Deal = typeof defaultDeal;

export const createBlankDeal = () => ({...defaultDeal});

let dealIdCount = 1;

export async function loadNewDeal(){

    const deal = createBlankDeal();

    deal.dealId = dealIdCount++;

    await Promise.all([
        carInvenotryClient.getAvaliableCarModels().then(x => deal.carModelsAvailable = x),
        carInsuranceClient.getAvaliableInsurancePlans().then(x => deal.insurancePlansAvailable = x)
      ]);

    return deal;      
}