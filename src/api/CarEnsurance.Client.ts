import { delay } from "../util/delay";


export enum EnsurancePlanType {
    base, thridParty, assetProtection
}

export type EnsurancePlan = {
    type: EnsurancePlanType,
    description: string,
    rate: number
}

class CarEnsuranceClient {
    public async getAvaliableEnsurancePlans(): Promise<EnsurancePlan[]> {
        console.log(`server call getAvaliableEnsurancePlans`);
        await delay(1500);
        return [{
            type: EnsurancePlanType.base,
            description: 'base plan',
            rate: 0.05
        }, {
            type: EnsurancePlanType.thridParty,
            description: '3rd-party liability',
            rate: 0.05
        }, {
            type: EnsurancePlanType.assetProtection,
            description: 'asset protection',
            rate: 0.3
        }];
    }
}

export const carEnsuranceClient = new CarEnsuranceClient();