import { delay } from "../util/delay";
import { EnsurancePlanType } from "./CarEnsurance.Client";
import { CarModel } from "./CarInventory.Client";
import moment from 'moment';
import { Currency, currencyExchangeClient } from "./CurrencyExchange.Client";

export type FinancingApproved = {
    isApproved: true,
    approvalToken: string,
    expiration?: Date
}

export type FinancingNotApproved = {
    isApproved: false,
    message: string
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

    public async getMinimumPossibleDownpayment(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[]): Promise<number> {

        console.log(`server call getMinimumPossibleDownpayment`);

        await delay(1000);

        if (ensurancePlans.some(x => x === EnsurancePlanType.assetProtection)) {
            return carModel.basePriceUSD / 10;
        }

        return carModel.basePriceUSD / 5;
    }

    public async getMinimumPossibleDownpaymentInForeignCurrency(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[],
        currency: Currency): Promise<number> {

        console.log(`server call getMinimumPossibleDownpaymentInForeignCurrency`);

        const [minDownpayment, rate] = await Promise.all([
            this.getMinimumPossibleDownpayment(carModel, ensurancePlans),
            currencyExchangeClient.getExchangeRate(currency)
        ]);

        return minDownpayment * rate;
    }

    public async getApproval(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[],
        downpayment: number): Promise<GetApprovalResult> {

        console.log(`server call getApproval`);

        await delay(1000);

        //this would be calculated on the server

        if (ensurancePlans.some(x => x === EnsurancePlanType.assetProtection)
            && carModel.basePriceUSD / 10 <= downpayment) {
            return getApprovedFinancing();
        }

        if (carModel.basePriceUSD / 5 <= downpayment) {
            return getApprovedFinancing(
                moment().add(15 + Math.random() * 30, 's').toDate()
            );
        }

        return {
            isApproved: false,
            message: "Approval denied. Downpayment should be over 20% of base price (10% with 'asset protection' ensurance)."
        }
    }

    public async getApprovalWithForeignCurrency(
        carModel: CarModel,
        ensurancePlans: EnsurancePlanType[],
        downpayment: number,
        currency: Currency): Promise<GetApprovalResult> {

        console.log(`server call getApprovalWithForeignCurrency`);

        const rate = await currencyExchangeClient.getExchangeRate(currency);
        const downpaymentInUsd = (downpayment / rate) + 1;

        return this.getApproval(carModel, ensurancePlans, downpaymentInUsd);
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