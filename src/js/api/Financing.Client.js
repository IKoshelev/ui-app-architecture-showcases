import { delay } from "../util/delay";
import { InsurancePlanType } from "./CarInsurance.Client";
import moment from 'moment';
import { currencyExchangeClient } from "./CurrencyExchange.Client";


const approvedFinacings = [];

function getApprovedFinancing(expiration) {

    const res = {
        isApproved: true,
        expiration: expiration,
        approvalToken: Math.random().toString()
    };

    approvedFinacings.push(res);

    return res
}

class FinancingClient {

    async getMinimumPossibleDownpayment(
        carModel,
        insurancePlans) {

        console.log(`server call getMinimumPossibleDownpayment`);

        await delay(1000);

        if (insurancePlans.some(x => x === InsurancePlanType.assetProtection)) {
            return carModel.basePriceUSD / 10;
        }

        return carModel.basePriceUSD / 5;
    }

    async getMinimumPossibleDownpaymentInForeignCurrency(
        carModel,
        insurancePlans,
        currency) {

        console.log(`server call getMinimumPossibleDownpaymentInForeignCurrency`);

        const [minDownpayment, rate] = await Promise.all([
            this.getMinimumPossibleDownpayment(carModel, insurancePlans),
            currencyExchangeClient.getExchangeRate(currency)
        ]);

        return minDownpayment * rate;
    }

    async getApproval(
        carModel,
        insurancePlans,
        downpayment) {

        console.log(`server call getApproval`);

        await delay(1000);

        //this would be calculated on the server

        if (insurancePlans.some(x => x === InsurancePlanType.assetProtection)
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
            message: "Approval denied. Downpayment should be over 20% of base price (10% with 'asset protection' insurance)."
        }
    }

    async getApprovalWithForeignCurrency(
        carModel,
        insurancePlans,
        downpayment,
        currency){

        console.log(`server call getApprovalWithForeignCurrency`);

        const rate = await currencyExchangeClient.getExchangeRate(currency);
        const downpaymentInUsd = (downpayment / rate) + 1;

        return this.getApproval(carModel, insurancePlans, downpaymentInUsd);
    }

    async finalizeFinancing(approvalToken) {

        console.log(`server call finalizeFinancing`);

        await delay(500);

        return approvedFinacings.some(x =>
            x.approvalToken === approvalToken
            && (!x.expiration || x.expiration >= new Date())
        );
    };
}

export const financingClient = new FinancingClient();