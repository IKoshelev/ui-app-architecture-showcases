import { delay } from "../util/delay";


export enum InsurancePlanType {
    base, thirdParty, assetProtection
}

export type InsurancePlan = {
    type: InsurancePlanType,
    description: string,
    rate: number
}

class CarInsuranceClient {
    public async getAvailableInsurancePlans(): Promise<InsurancePlan[]> {
        console.log(`server call getAvailableInsurancePlans`);
        await delay(1500);
        return [{
            type: InsurancePlanType.base,
            description: 'base plan',
            rate: 0.05
        }, {
            type: InsurancePlanType.thirdParty,
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