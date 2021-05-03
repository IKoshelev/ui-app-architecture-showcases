import { delay } from "../util/delay";
import { InsurancePlanType } from "./CarInsurance.Client";
import { CarModel } from "./CarInventory.Client";
import moment from 'moment';

export type FinancingApproved = {
    isApproved: true,
    approvalToken: string,
    expiration?: Date
}

export type FinancingNotApproved = {
    isApproved: false,
    message: string
}

export type GetApprovalResult = FinancingApproved | FinancingNotApproved;

const approvedFinacings: FinancingApproved[] = [];

function getApprovedFinancing(expiration?: Date) {

    const res = {
        isApproved: true as const,
        expiration: expiration,
        approvalToken: Math.random().toString()
    };

    approvedFinacings.push(res);

    return res
}

class FinancingClient {

    public async getMinimumPossibleDownpayment(
        carModel: CarModel,
        insurancePlans: InsurancePlanType[]): Promise<number> {

        console.log(`server call getMinimumPossibleDownpayment`);

        await delay(1000);

        if (insurancePlans.some(x => x === InsurancePlanType.assetProtection)) {
            return carModel.basePrice / 10;
        }

        return carModel.basePrice / 5;
    }

    public async getApproval(
        carModel: CarModel,
        insurancePlans: InsurancePlanType[],
        downpayment: number): Promise<GetApprovalResult> {

        console.log(`server call getApproval`);

        await delay(1000);

        //this would be calculated on the server

        if (insurancePlans.some(x => x === InsurancePlanType.assetProtection)
            && carModel.basePrice / 10 <= downpayment) {
            return getApprovedFinancing();
        }

        if (carModel.basePrice / 5 <= downpayment) {
            return getApprovedFinancing(
                moment().add(15 + Math.random() * 30, 's').toDate()
            );
        }

        return {
            isApproved: false,
            message: "Approval denied. Downpayment should be over 20% of base price (10% with 'asset protection' insurance)."
        }
    }

    public async finalizeFinancing(approvalToken: string) {

        console.log(`server call finalizeFinancing`);

        await delay(500);

        return approvedFinacings.some(x =>
            x.approvalToken === approvalToken
            && (!x.expiration || x.expiration >= new Date())
        )
    };
}

export const financingClient = new FinancingClient();