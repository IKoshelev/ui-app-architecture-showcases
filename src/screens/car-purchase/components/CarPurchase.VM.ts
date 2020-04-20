import { computed, action, observable, runInAction } from "mobx";
import { CarPurchaseModel } from "../model/CarPurchase.Model";
import { CarModelsSelectorVM } from "./car-model-selector/CarModelsSelector.VM";
import { EnsurancePlansSelectorVM } from "./ensurance-plan-selector/EnsurancePlansSelector.VM";
import { ticker1second } from "../../../util/observable-ticker";
import moment from "moment";
import { PositiveIntegerVM } from "../../../generic-components/numeric-input/NumericInputVM";
import { financingClient } from "../../../api/Financing.Client";

export class CarPurchaseVM {

    constructor(id: string) {
        this.id = id;
        this.carPurchaseModel = new CarPurchaseModel();

        this.carModelSelectorVM = new CarModelsSelectorVM(this.carPurchaseModel);
        this.ensurancePlanSelectorVM = new EnsurancePlansSelectorVM(this.carPurchaseModel);

        this.downpaymentInputVm = this.createDownpaymentVM();
    }

    public readonly id: string;

    public readonly carPurchaseModel: CarPurchaseModel;
    public readonly carModelSelectorVM: CarModelsSelectorVM;
    public readonly ensurancePlanSelectorVM: EnsurancePlansSelectorVM;

    @observable
    private _isLoading: boolean = false;

    @computed
    public get messages() {
        return [
            ...this.carPurchaseModel.messages
        ];
    }

    @computed
    public get isLoading() {
        return this._isLoading
            || this.ensurancePlanSelectorVM.isLoading
            || this.carModelSelectorVM.isLoading
            || this.carPurchaseModel.isLoading;
    }

    @computed
    public get finalPrice() {
        const basePrice = this.carPurchaseModel.carModel?.basePrice;

        if (basePrice === undefined) {
            return undefined;
        }

        const priceIncrease = this.ensurancePlanSelectorVM
            .selectedPlans
            .map(x => basePrice * x.rate)
            .reduce((prev, cur) => prev + cur, 0);

        return basePrice + priceIncrease;
    }

    @computed
    public get dealState() {

        if (this.carPurchaseModel.isDealFinalized) {
            return 'deal-finalized' as const;
        }

        const approval = this.carPurchaseModel.financingApprovalForCurrentDeal;

        if (!approval) {
            return 'no-approval' as const;
        }

        const expiration = approval.expiration;
        if (!expiration) {
            return 'approval-perpetual' as const;
        }

        var duration = moment.duration(moment(expiration).diff(ticker1second.lastTickDate));
        var seconds = Math.round(duration.asSeconds());

        if (seconds <= 0) {
            return 'approval-expired' as const;
        }

        return { approvalExpiresInSeconds: seconds } as const;
    }

    public readonly downpaymentInputVm: PositiveIntegerVM;
    private createDownpaymentVM() {
        return new PositiveIntegerVM(
            () => this.carPurchaseModel.downpayment,
            (val) => this.carPurchaseModel.downpayment = (val ?? 0),
            () => this.isDealFinilized,
            () => {
                if (this.finalPrice
                    && this.carPurchaseModel.downpayment > this.finalPrice) {
                    return {
                        isValid: false,
                        message: 'Downpaymanet exceeds final price'
                    }
                }

                return {
                    isValid: true
                }
            }
        );
    }

    @computed
    public get isValid() {
        return !this.isLoading
            && this.downpaymentInputVm.isValid;
    }

    @computed
    public get canRequestApproval() {
        return this.carPurchaseModel.canRequestApproval
            && !this.isLoading
            && this.isValid;
    }

    @action.bound
    public async getApproval() {
        await this.carPurchaseModel.getApproval();
    }

    @computed
    public get isDealFinilized() {
        return this.carPurchaseModel.isDealFinalized;
    }

    @computed
    public get canFinalizeDeal() {
        return this.carPurchaseModel.canFinalizeDeal
            && !this.isLoading
            && this.isValid;
    }

    @action.bound
    public async finalzieDeal() {
        await this.carPurchaseModel.finalizeDeal();
    }

    @computed
    public get canSetMinimumPossibleDownpayment() {
        return this.carPurchaseModel.carModel !== undefined
            && !this.isDealFinilized
            && !this.isLoading;
    }

    @action.bound
    public async setMinimumPossibleDownpayment() {
        this._isLoading = true;
        try {
            const minimumDownpayment = await financingClient.getMinimumPossibleDownpayment(
                this.carPurchaseModel.carModel!,
                this.carPurchaseModel.ensurancePlansSelected
            );

            runInAction(() => {
                if (this.carPurchaseModel.downpayment !== minimumDownpayment) {
                    this.carPurchaseModel.downpayment = minimumDownpayment;
                } else {
                    this.downpaymentInputVm.clearUnsavedState();
                }
            });

        } finally {
            this._isLoading = false;
        }
    }
}