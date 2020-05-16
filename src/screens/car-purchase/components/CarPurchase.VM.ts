import { computed, action, observable, runInAction } from "mobx";
import { CarPurchaseModel } from "../model/CarPurchase.Model";
import { CarModelsSelectorVM } from "./car-model-selector/CarModelsSelector.VM";
import { InsurancePlansSelectorVM } from "./insurance-plan-selector/InsurancePlansSelector.VM";
import { ticker1second } from "../../../util/observable-ticker";
import moment from "moment";
import { PositiveIntegerVM } from "../../../generic-components/numeric-input/NumericInputVM";
import { financingClient } from "../../../api/Financing.Client";

export class CarPurchaseVM {

    constructor(id: string, onClose?: (_this: CarPurchaseVM) => void) {
        this.id = id;
        this.onClose = onClose;

        this.carPurchaseModel = this.createModel();

        this.carModelSelectorVM = new CarModelsSelectorVM(this.carPurchaseModel);
        this.insurancePlanSelectorVM = new InsurancePlansSelectorVM(this.carPurchaseModel);

        this.downpaymentInputVm = this.createDownpaymentVM();
    }

    protected createModel(): CarPurchaseModel {
        return new CarPurchaseModel();
    }

    public readonly cssClassName = 'car-purchase-deal' as const;

    public readonly id: string;
    private readonly onClose?: (_this: CarPurchaseVM) => void;

    public readonly carPurchaseModel: CarPurchaseModel;
    public readonly carModelSelectorVM: CarModelsSelectorVM;
    public readonly insurancePlanSelectorVM: InsurancePlansSelectorVM;

    @observable
    protected _isLoading: boolean = false;

    @computed
    public get messages() {
        return [
            ...this.carPurchaseModel.messages
        ];
    }

    @computed
    public get isLoading() {
        return this._isLoading
            || this.insurancePlanSelectorVM.isLoading
            || this.carModelSelectorVM.isLoading
            || this.carPurchaseModel.isLoading;
    }

    @computed
    public get tabHeader() {
        if (!this.carPurchaseModel.carModel) {
            return `${this.id}`;
        }

        let state: string = '';
        if (this.dealState === 'deal-finalized') {
            state = 'done';
        } else if (this.dealState === 'approval-perpetual') {
            state = 'approved'
        } else if (typeof this.dealState !== 'string') {
            state = `${this.dealState.approvalExpiresInSeconds} sec`;
        }

        return `${this.carPurchaseModel.carModel.description} ${this.headerAdditionalDescription()} ${state}`;
    }

    protected headerAdditionalDescription() {
        return '';
    }

    @computed
    public get finalPrice() {
        const basePrice = this.carPurchaseModel.carModel?.basePriceUSD;

        if (basePrice === undefined) {
            return undefined;
        }

        return this.calculateFinalPriceFromBase(basePrice);
    }

    protected calculateFinalPriceFromBase(basePrice: number): number | undefined {

        const priceIncrease = this.insurancePlanSelectorVM
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

        const approval = this.carPurchaseModel.financingApprovalResponseForCurrentDeal;

        if (!approval || approval.isApproved === false) {
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
                        message: 'Downpayment exceeds final price'
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
            const minimumDownpayment = await this.getMinimumPossibleDownpaymentFromServer();

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

    protected async getMinimumPossibleDownpaymentFromServer() {
        return financingClient.getMinimumPossibleDownpayment(
            this.carPurchaseModel.carModel!,
            this.carPurchaseModel.insurancePlansSelected
        );
    }

    @action.bound
    public close() {
        // clean deal, probably by notifying backend
        this.onClose?.(this);
    }
}