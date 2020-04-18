import { delay } from "../util/delay";
import { EnsurancePlanType } from "./CarEnsurance.Client";
import { CarModel } from "./CarInventory.Client";
import moment from 'moment';

export type FinancingApproved = {
    isApproved: true,
    approvalToken: string,
    expiration?: Date
}

export type FinancingNotApproved = {
    isApproved: false
}

type GetApprovalResult = FinancingApproved | FinancingNotApproved;


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

    public async getApproval(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[],
        downpayment: number): Promise<GetApprovalResult> {

        console.log(`server call getApproval`);

        await delay(1000);

        //this would be calculated on the server

        if (ensurancePlans.some(x => x === EnsurancePlanType.assetProtection)) {
            return getApprovedFinancing();
        }

        if (carModel.basePrice / 5 >= downpayment) {
            return {
                isApproved: false
            }
        }

        return getApprovedFinancing(
            moment().add(15, 's').toDate()
        );

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