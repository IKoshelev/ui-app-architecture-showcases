import { computed, action } from "mobx";
import { CarPurchaseModel } from "../model/CarPurchase.Model";
import { CarModelsSelectorVM } from "./car-model-selector/CarModelsSelector.VM";
import { EnsurancePlansSelectorVM } from "./ensurance-plan-selector/EnsurancePlansSelector.VM";
import { ticker1second } from "../../util/observable-ticker";
import moment from "moment";

export class CarPurchaseVM {

    constructor() {
        this.carPurchaseModel = new CarPurchaseModel();

        this.carModelSelectorVM = new CarModelsSelectorVM(this.carPurchaseModel);
        this.ensurancePlanSelectorVM = new EnsurancePlansSelectorVM(this.carPurchaseModel);
    }

    public readonly carPurchaseModel: CarPurchaseModel;
    public readonly carModelSelectorVM: CarModelsSelectorVM;
    public readonly ensurancePlanSelectorVM: EnsurancePlansSelectorVM;

    @computed
    public get messages() {
        return [
            ...this.carPurchaseModel.messages
        ];
    }

    @computed
    public get isLoading() {
        return this.ensurancePlanSelectorVM.isLoading
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
            return 'Congratulations! Deal is finalized.';
        }

        const approval = this.carPurchaseModel.financingApprovalForCurrentDeal;

        if (!approval) {
            return '';
        }

        const expiration = approval.expiration;
        if (!expiration) {
            return 'Approval granted.';
        }

        var duration = moment.duration(moment(expiration).diff(ticker1second.lastTickDate));
        var seconds = Math.round(duration.asSeconds());

        if (seconds <= 0) {
            return 'Approval expired';
        }

        return `Approval granted. Expires in ${seconds} seconds`;
    }

    @computed
    public get canRequestApproval() {
        return this.carPurchaseModel.canRequestApproval;
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
        return this.carPurchaseModel.canFinalizeDeal;
    }

    @action.bound
    public async finalzieDeal() {
        await this.carPurchaseModel.finalizeDeal();
    }

    @computed
    public get downpayment() {
        return this.carPurchaseModel.downpayment;
    }

    @action.bound
    public setDownpayment(value: string = '0') {
        const parsedVal = parseInt(value) || 0;
        this.carPurchaseModel.downpayment = parsedVal;
    }
}