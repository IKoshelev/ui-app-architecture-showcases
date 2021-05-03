import moment from "moment";
import { carInsuranceClient, InsurancePlan } from "../../api/CarInsurance.Client";
import { carInvenotryClient, CarModel } from "../../api/CarInventory.Client";
import { GetApprovalResult } from "../../api/Financing.Client";
import { getBlankNumericInputState } from "../../models-generic/numeric-input";

export const createBlankDeal = () => ({
    
    businessParams: {
        dealId: 0,
        isDealFinalized: false,
        downpayment: 0,
        insurancePlanSelected: undefined as InsurancePlan | undefined,
        carModelSelected: undefined as CarModel | undefined,
    },
   
    isLoading: false,
    downplaymentInputState: getBlankNumericInputState(),
    insurancePlansAvailable: [] as InsurancePlan[],
    carModelsAvailable: [] as CarModel[],
    messages: [] as string[],
    approval: undefined as GetApprovalResult | undefined, //todo move approval to store
});

export type Deal = ReturnType<typeof createBlankDeal>;

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