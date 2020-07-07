import { delay } from "../util/delay";

class CarInsuranceClient {
    async getAvaliableInsurancePlans() {
        console.log(`server call getAvaliableInsurancePlans`);
        await delay(1500);
        return [{
            type: InsurancePlanType.base,
            description: 'base plan',
            rate: 0.05
        }, {
            type: InsurancePlanType.thridParty,
            description: '3rd-party liability',
            rate: 0.05
        }, {
            type: InsurancePlanType.assetProtection,
            description: 'asset protection',
            rate: 0.3
        }];
    }
}

export const carInsuranceClient = new CarInsuranceClient();