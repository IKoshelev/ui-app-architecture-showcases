import moment from "moment";
import { carInsuranceClient, InsurancePlan } from "../../api/CarInsurance.Client";
import { carInvenotryClient, CarModel } from "../../api/CarInventory.Client";
import { GetApprovalResult } from "../../api/Financing.Client";
import { getBlankNumericInputState, tryCommitValue } from "../../generic-components/numeric-input";

export const createBlankDeal = () => ({
    
    businessParams: {
        dealId: 0,
        isDealFinalized: false,
        downpayment: 0,
        insurancePlansSelected: [] as InsurancePlan[],
        carModelSelected: undefined as CarModel | undefined,
    },
   
    isLoadingItemized: {},
    downplaymentInputState: getBlankNumericInputState({integer: true, positive: true}),
    insurancePlansAvailable: [] as InsurancePlan[],
    carModelsAvailable: [] as CarModel[],
    messages: [] as string[],
    approval: undefined as GetApprovalResult | undefined, //todo move approval to store
});

export type Deal = ReturnType<typeof createBlankDeal> 
                        & {isLoadingItemized: {[K in 
                            (keyof ReturnType<typeof createBlankDeal> | keyof ReturnType<typeof createBlankDeal>['businessParams']) ]?
                            : boolean}};

export type DealBusinessParams = Deal['businessParams'];

let dealIdCount = 1;

export async function loadNewDeal(){

    const deal = createBlankDeal();

    deal.businessParams.dealId = dealIdCount++;

    await Promise.all([
        carInvenotryClient.getAvaliableCarModels().then(x => deal.carModelsAvailable = x),
        carInsuranceClient.getAvaliableInsurancePlans().then(x => deal.insurancePlansAvailable = x)
      ]);

    return deal;      
}

export function getDealProgresssState(deal: Deal, currentDate: Date) {

    if (deal.businessParams.isDealFinalized) {
        return 'deal-finalized' as const;
    }

    const approval = deal.approval;

    if (!approval || approval.isApproved === false) {
        return 'no-approval' as const;
    }

    const expiration = approval.expiration;
    if (!expiration) {
        return 'approval-perpetual' as const;
    }

    var duration = moment.duration(moment(expiration).diff(currentDate));
    var seconds = Math.round(duration.asSeconds());

    if (seconds <= 0) {
        return 'approval-expired' as const;
    }

    return { approvalExpiresInSeconds: seconds } as const;
}

export type DealProgressState = ReturnType<typeof getDealProgresssState>;

export function canSetMinimumDownpayment(deal: DealBusinessParams){
    return deal.carModelSelected 
    && deal.isDealFinalized === false;
}

export function getFinalPrice(deal: DealBusinessParams){

        const basePrice = deal.carModelSelected?.basePrice;

        if(!basePrice) {
            throw new Error(`Can't calculate price.`);
        }

        const priceIncrease = deal
            .insurancePlansSelected
            .map(x => basePrice * x.rate)
            .reduce((prev, cur) => prev + cur, 0);

        return basePrice + priceIncrease;
}

export function getGeneralValidation(deal: Deal){
    
    const downpaymentExceedsPrice = !!(deal.businessParams.carModelSelected
                                        && deal.businessParams.downpayment > getFinalPrice(deal.businessParams));

    const validation = {
        downpaymentExceedsPrice
    }

    return validation;
}