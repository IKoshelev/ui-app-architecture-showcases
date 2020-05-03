import { observable, computed, action } from "mobx";
import { CarModel } from "../../../api/CarInventory.Client";
import { InsurancePlanType } from "../../../api/CarInsurance.Client";
import { financingClient } from "../../../api/Financing.Client";
import { setsMatch, getSorterByLatest, PromiseValueType } from "../../../util/util";
import { ticker1second } from "../../../util/observable-ticker";

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
            .filter(x =>
                this.carModel?.id === x.carModelId
                && this.downpayment === x.downpayment
                && setsMatch(this.insurancePlansSelected, x.insurancePlansSelected)
            )
            .sort(getSorterByLatest(x => x.timestamp))
        [0]?.approvalResponse;
    }

    @observable
    private fincingApprovalsCache: {
        carModelId: number,
        insurancePlansSelected: InsurancePlanType[],
        downpayment: number,
        timestamp: Date,
        approvalResponse: PromiseValueType<ReturnType<typeof financingClient.getApproval>>
    }[] = [];

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
            const response = await financingClient.getApproval(
                this.carModel!,
                this.insurancePlansSelected,
                this.downpayment);

            this.fincingApprovalsCache.push({
                carModelId: this.carModel!.id,
                insurancePlansSelected: [...this.insurancePlansSelected],
                downpayment: this.downpayment,
                timestamp: new Date(),
                approvalResponse: response
            });

        }
        finally {
            this.isLoading = false;
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
            const result = await financingClient.finalizeFinancing(
                this.financingApprovalResponseForCurrentDeal.approvalToken
            );

            if (!result) {
                this._messages.push('Deal finalization failed.');
                return;
            }

            this.isDealFinalized = true;
        }
        finally {
            this.isLoading = false;
        }
    }
}