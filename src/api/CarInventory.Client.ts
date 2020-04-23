import { delay } from "../util/delay";

export type CarModel = {
    id: number,
    description: string,
    basePrice: number
}

class CarInventoryClient {

    public async getAvaliableCarModels(): Promise<CarModel[]> {
        console.log(`server call getAvaliableCarModels`);
        await delay(500);
        return [
            {
                id: 1,
                description: 'Ford Mustang',
                basePrice: 100000
            },
            {
                id: 2,
                description: 'Kia Sorento',
                basePrice: 26000
            },
            {
                id: 3,
                description: 'Porsche Cayene',
                basePrice: 90000
            }
        ]
    }
}


export const carInvenotryClient = new CarInventoryClient();