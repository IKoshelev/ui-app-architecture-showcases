import { delay } from "../util/delay";

export type CarModel = {
    id: number,
    description: string,
    basePrice: number
}

class CarInventoryClient {

    public async getAvailableCarModels(): Promise<CarModel[]> {
        console.log(`server call getAvailableCarModels`);
        await delay(500);
        return [
            {
                id: 1,
                description: 'Hetman Speedster',
                basePrice: 100000
            },
            {
                id: 2,
                description: 'Hetman Workhorse',
                basePrice: 26000
            },
            {
                id: 3,
                description: 'Hetman Luxury',
                basePrice: 90000
            }];
    }
}


export const carInventoryClient = new CarInventoryClient();