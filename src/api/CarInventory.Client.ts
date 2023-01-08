import { delay } from "../util/delay";

export type CarModel = {
    id: number,
    description: string,
    basePriceUSD: number
}

class CarInventoryClient {

    public async getAvailableCarModels(): Promise<CarModel[]> {
        console.log(`server call getAvailableCarModels`);
        await delay(500);
        return [
            {
                id: 1,
                description: 'Ford Mustang',
                basePriceUSD: 100000
            },
            {
                id: 2,
                description: 'Kia Sorento',
                basePriceUSD: 26000
            },
            {
                id: 3,
                description: 'Porsche Cayene',
                basePriceUSD: 90000
            }
        ]
    }
}


export const carInventoryClient = new CarInventoryClient();