import { observable, computed, action } from "mobx";
import { CarModel } from "../../api/CarInventory.Client";
import { EnsurancePlanType } from "../../api/CarEnsurance.Client";
import { FinancingApproved, financingClient } from "../../api/Financing.Client";
import { setsMatch, sortByExpiration } from "../../util/util";
import { ticker1second } from "../../util/observable-ticker";

export class CarPurchaseModel {

    public construtor() {

    }

    @observable
    public carModel: CarModel | undefined = undefined;

    @observable
    public ensurancePlansSelected: EnsurancePlanType[] = [];

    @observable
    public downpayment: number = 0;

    @observable
    public isDealFinalized = false;

    @observable
    public isLoading = false;

    @observable
    public messages: string[] = [];

    @computed
    public get financingApprovalForCurrentDeal() {
        return this.fincingApprovalsCache
            .filter(x =>
                this.carModel?.id === x.carModelId
                && this.downpayment === x.downpayment
                && setsMatch(this.ensurancePlansSelected, x.ensurancePlansSelected)
            )
            .map(x => x.approval)
            .sort(sortByExpiration)
        [0];
    }

    @observable
    private fincingApprovalsCache: {
        carModelId: number,
        ensurancePlansSelected: EnsurancePlanType[],
        downpayment: number,
        approval: FinancingApproved
    }[] = [];

    @computed
    public get canRequestApproval() {

        const approvalIsNotPresentORExpired = !this.financingApprovalForCurrentDeal
            || (this.financingApprovalForCurrentDeal.expiration
                && this.financingApprovalForCurrentDeal.expiration < ticker1second.lastTickDate);

        return this.carModel
            && this.isDealFinalized === false
            && approvalIsNotPresentORExpired;
    }

    @action
    public async getApproval() {
        this.isLoading = true;
        this.messages = [];

        try {
            const result = await financingClient.getApproval(
                this.carModel!,
                this.ensurancePlansSelected,
                this.downpayment);

            if (result.isApproved === false) {
                this.messages.push(result.message);
                return;
            }

            this.fincingApprovalsCache.push({
                carModelId: this.carModel!.id,
                ensurancePlansSelected: [...this.ensurancePlansSelected],
                downpayment: this.downpayment,
                approval: result
            })

        }
        finally {
            this.isLoading = false;
        }
    }

    @computed
    public get canFinalizeDeal() {
        return this.isDealFinalized === false
            && this.financingApprovalForCurrentDeal
            && (this.financingApprovalForCurrentDeal.expiration === undefined
                || this.financingApprovalForCurrentDeal.expiration >= ticker1second.lastTickDate);
    }

    @action
    public async finalizeDeal() {
        this.isLoading = true;
        this.messages = [];

        try {
            const result = await financingClient.finalizeFinancing(
                this.financingApprovalForCurrentDeal.approvalToken
            );

            if (!result) {
                this.messages.push('Deal finalization failed.');
                return;
            }

            this.isDealFinalized = true;
        }
        finally {
            this.isLoading = false;
        }
    }
}