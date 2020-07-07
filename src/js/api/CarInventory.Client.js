import { delay } from "../util/delay";

class CarInventoryClient {

    async getAvaliableCarModels() {
        console.log(`server call getAvaliableCarModels`);
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


export const carInvenotryClient = new CarInventoryClient();