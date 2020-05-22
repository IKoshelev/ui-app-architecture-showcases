import { delay } from "../util/delay";
import { Lazy } from "../util/util";

export enum Currency {
    USD = 'USD', EUR = 'EUR', GBP = 'GBP', CHF = 'CHF'
}

export const rates = {
    [Currency.USD]: 1,
    [Currency.EUR]: 0.93,
    [Currency.GBP]: 0.83,
    [Currency.CHF]: 0.97
}

class CurrencyExchangeClient {

    public async getCurrencies(): Promise<Currency[]> {

        console.log(`server call getCurrencies`);

        await delay(1000);

        return [
            Currency.USD,
            Currency.EUR,
            Currency.GBP,
            Currency.CHF
        ];
    }

    // in real life app we would probably have 
    // centralsed exchange rate cache on client side,
    // for now don't worry about that
    public async getExchangeRate(cur: Currency): Promise<number> {

        console.log(`server call getExchangeRate`);

        await delay(1000);

        return rates[cur];
    }
}

export const currencyExchangeClient = new Lazy(() => new CurrencyExchangeClient());