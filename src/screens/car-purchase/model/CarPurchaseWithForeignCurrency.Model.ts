import { CarPurchaseModel, DealApprovalCacheItem } from "./CarPurchase.Model";
import { observable, action } from "mobx";
import { Currency } from "../../../api/CurrencyExchange.Client";
import { financingClient } from "../../../api/Financing.Client";

type DealWithForeignCurrencyApprovalCacheItem =
    DealApprovalCacheItem & {
        downpaymentCurrency: Currency;
    }


export class CarPurchaseWithForeignCurrencyModel extends CarPurchaseModel {

    @observable
    public downpaymentCurrency: Currency = Currency.USD;

    @observable
    protected fincingApprovalsCache: DealWithForeignCurrencyApprovalCacheItem[] = [];

    protected currentStateMatchesApprovalItem(item: DealWithForeignCurrencyApprovalCacheItem): boolean {
        return super.currentStateMatchesApprovalItem(item)
            && this.downpaymentCurrency === item.downpaymentCurrency;
    }

    @action
    public async getApproval() {
        this.isLoading = true;

        try {
            const response = await financingClient.getApprovalWithForeignCurrency(
                this.carModel!,
                this.insurancePlansSelected,
                this.downpayment,
                this.downpaymentCurrency);

            this.fincingApprovalsCache.push({
                carModelId: this.carModel!.id,
                insurancePlansSelected: [...this.insurancePlansSelected],
                downpayment: this.downpayment,
                timestamp: new Date(),
                approvalResponse: response,
                downpaymentCurrency: this.downpaymentCurrency
            });

        }
        finally {
            this.isLoading = false;
        }
    }
}