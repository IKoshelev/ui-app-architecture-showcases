import { observable, computed, action, runInAction } from "mobx";
import { CarModel } from "../../../api/CarInventory.Client";
import { InsurancePlanType } from "../../../api/CarInsurance.Client";
import { financingClient } from "../../../api/Financing.Client";
import { setsMatch, getSorterByLatest, PromiseValueType } from "../../../util/util";
import { ticker1second } from "../../../util/observable-ticker";

export type DealApprovalCacheItem = {
    carModelId: number,
    insurancePlansSelected: InsurancePlanType[],
    downpayment: number,
    timestamp: Date,
    approvalResponse: PromiseValueType<ReturnType<typeof financingClient.val.getApproval>>
}

export class CarPurchaseModel {

    public construtor() {

    }

    @observable
    public carModel: CarModel | undefined = undefined;

    @observable
    public insurancePlansSelected: InsurancePlanType[] = [];

    @observable
    public downpayment: number = 0;

    @observable
    public isDealFinalized = false;

    @observable
    public isLoading = false;

    @observable
    private _messages: string[] = [];

    @computed
    public get messages() {

        const approval = this.financingApprovalResponseForCurrentDeal;

        return [
            ...this._messages,
            ...(approval?.isApproved === false ? [approval.message] : [])
        ];
    }

    @computed
    public get financingApprovalResponseForCurrentDeal() {
        return this.fincingApprovalsCache
            .filter(x => this.currentStateMatchesApprovalItem(x))
            .sort(getSorterByLatest(x => x.timestamp))
        [0]?.approvalResponse;
    }

    protected currentStateMatchesApprovalItem(item: DealApprovalCacheItem): boolean {

        return this.carModel?.id === item.carModelId
            && this.downpayment === item.downpayment
            && setsMatch(this.insurancePlansSelected, item.insurancePlansSelected);
    }

    @observable
    protected fincingApprovalsCache: DealApprovalCacheItem[] = [];

    @computed
    public get canRequestApproval() {
        return this.carModel
            && this.isDealFinalized === false
            && !this.hasValidFinancingApproval;
    }

    @action
    public async getApproval() {
        this.isLoading = true;

        try {
            const response = await financingClient.val.getApproval(
                this.carModel!,
                this.insurancePlansSelected,
                this.downpayment);

            runInAction(() => {
                this.fincingApprovalsCache.push({
                    carModelId: this.carModel!.id,
                    insurancePlansSelected: [...this.insurancePlansSelected],
                    downpayment: this.downpayment,
                    timestamp: new Date(),
                    approvalResponse: response
                })
            });

        }
        finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    @computed
    public get canFinalizeDeal() {
        return this.isDealFinalized === false
            && this.hasValidFinancingApproval;
    }

    @computed
    private get hasValidFinancingApproval() {
        const approval = this.financingApprovalResponseForCurrentDeal;

        return approval
            && approval.isApproved
            && (!approval.expiration || approval.expiration >= ticker1second.lastTickDate);
    }

    @action
    public async finalizeDeal() {
        this.isLoading = true;
        this._messages = [];

        try {
            if (!this.financingApprovalResponseForCurrentDeal?.isApproved) {
                throw new Error('Invalid state.');
            }
            const result = await financingClient.val.finalizeFinancing(
                this.financingApprovalResponseForCurrentDeal.approvalToken
            );

            runInAction(() => {
                if (!result) {
                    this._messages.push('Deal finalization failed.');
                    return;
                }

                this.isDealFinalized = true;
            });
        }
        finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}