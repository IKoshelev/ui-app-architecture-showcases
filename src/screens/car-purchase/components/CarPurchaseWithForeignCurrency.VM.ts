import { CarPurchaseVM } from "./CarPurchase.VM";
import { CarPurchaseWithForeignCurrencyModel } from "../model/CarPurchaseWithForeignCurrency.Model";
import { CurrencySelectorVM } from "../../../generic-components/currency-selector/CurrencySelector.VM";
import { Currency, currencyExchangeClient } from "../../../api/CurrencyExchange.Client";
import { financingClient } from "../../../api/Financing.Client";
import { observable, reaction, action, runInAction } from "mobx";

export class CarPurchaseWithForeignCurrencyVM extends CarPurchaseVM {

  constructor(id: string, onClose?: (_this: CarPurchaseVM) => void) {
    super(id, onClose);

    reaction(
      () => this.carPurchaseModel.downpaymentCurrency,
      (_currency) => this.reloadExchangeRate(),
      { fireImmediately: true }
    );
  }

  public readonly carPurchaseModel: CarPurchaseWithForeignCurrencyModel = this.carPurchaseModel;

  protected createModel(): CarPurchaseWithForeignCurrencyModel {
    return new CarPurchaseWithForeignCurrencyModel();
  }

  protected headerAdditionalDescription() {
    return ` ${this.carPurchaseModel.downpaymentCurrency} `;
  }

  public readonly currencySelector = new CurrencySelectorVM(
    () => this.carPurchaseModel.downpaymentCurrency,
    (newCurrency) => this.carPurchaseModel.downpaymentCurrency = newCurrency,
    () => this.isDealFinilized
  );

  @observable
  private exchangeRate: number | undefined;

  @action.bound
  private async reloadExchangeRate() {
    this._isLoading = true;
    this.exchangeRate = undefined;
    try {

      const rate = await currencyExchangeClient.val.getExchangeRate(
        this.carPurchaseModel.downpaymentCurrency
      );

      runInAction(() => this.exchangeRate = rate);

    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  public foreignCuurencyHandlingCoeficient = 1.02 as const;
  protected calculateFinalPriceFromBase(basePrice: number) {

    if (this.exchangeRate === undefined) {
      return undefined;
    }

    const convertedBasePrice = basePrice * this.exchangeRate;

    let price = super.calculateFinalPriceFromBase(convertedBasePrice);

    if (!price) {
      return undefined;
    }

    if (this.carPurchaseModel.downpaymentCurrency !== Currency.USD) {
      price = price * this.foreignCuurencyHandlingCoeficient;
    }

    return Math.round(price);
  }

  protected async getMinimumPossibleDownpaymentFromServer() {
    return financingClient.val.getMinimumPossibleDownpaymentInForeignCurrency(
      this.carPurchaseModel.carModel!,
      this.carPurchaseModel.insurancePlansSelected,
      this.carPurchaseModel.downpaymentCurrency
    );
  }
}
