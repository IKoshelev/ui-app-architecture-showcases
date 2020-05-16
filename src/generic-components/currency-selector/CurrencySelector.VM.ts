import { Currency, currencyExchangeClient } from "../../api/CurrencyExchange.Client";
import { observable, action, computed } from "mobx";

// a bit naive, in real world we would probably have a few retries built in.
const availableCurrencies = currencyExchangeClient.getCurrencies();

export class CurrencySelectorVM {
    public constructor(
        getModelValue: () => Currency,
        setValueToModel: (val: Currency) => void,
        isDisabled?: () => boolean) {

        this.getModelValue = getModelValue;
        this.setValueToModel = setValueToModel;
        this.isDisabled = isDisabled ?? (() => false);

        this.isLoading = true;
        availableCurrencies.then(action((currencies) => {
            this.availableCurrencies = currencies;
            this.isLoading = false;
        }));
    }

    private readonly getModelValue: () => Currency;
    private readonly setValueToModel: (val: Currency) => void;
    private readonly isDisabled: () => boolean;

    @observable
    public availableCurrencies: Currency[] = [];

    @observable
    public isLoading: boolean = false;

    @computed
    public get selectedCurrency() {
        return this.getModelValue();
    }

    @computed
    public get disabled() {
        return this.isLoading || this.isDisabled();
    }

    @action.bound
    public onChange(val: Currency) {
        this.setValueToModel(val);
    }
}