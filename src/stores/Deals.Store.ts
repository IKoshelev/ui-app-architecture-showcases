import { computed, observable, action } from "mobx";
import { CarModel } from "../api/CarInventory.Client";
import { EnsurancePlan } from "../api/CarEnsurance.Client";
import { ReadonlyDeep, getArrayWithUpdatedItems } from "../util/state-helpers";
import { createFreshDeal, defaultDealStatus } from "./Deals.Sync";
import { Deal, DealStatus } from "./Deals.Types";

const initialDeal = createFreshDeal();

class DealsStore {

    @observable
    public activeDealId: number = 1;

    @observable
    public deals: Deal[] = [initialDeal];

    @action.bound
    public addNewDeal = () => {
        const newDeal = createFreshDeal();
        this.deals = [...this.deals, newDeal];
    }

    @computed
    public get getActiveDeal() {
        return this.deals.find(deal => deal.id === this.activeDealId);
    };

    @action.bound
    public closeActiveDeal(): void {
        this.deals = this.deals.filter(deal => deal.id !== this.activeDealId);
    }

    @action
    private updateActiveItem(update: Partial<Deal>) {
        this.deals = getArrayWithUpdatedItems(this.deals, i => i.id === this.activeDealId, update);
    }

    @action.bound
    public setActiveDealId(value: number) {
        this.activeDealId = value
    }

    @computed
    public get isLoading() {
        return this.getActiveDeal?.isLoading;
    }

    @action.bound
    public setIsLoading(value: boolean) {
        this.updateActiveItem({
            isLoading: value
        });
    }

    @computed
    public get carModel() {
        return this.getActiveDeal?.carModel;
    }

    @action.bound
    public setCarModel(value: CarModel | undefined) {
        this.updateActiveItem({
            carModel: value,
            status: defaultDealStatus
        });
    }

    @computed
    public get availableInsurancePlans() {
        return this.getActiveDeal?.availableInsurancePlans ?? [];
    }

    @action.bound
    public setAvailableInsurancePlans(value: EnsurancePlan[]) {
        this.updateActiveItem({
            availableInsurancePlans: value
        });
    }

    @computed
    public get availableCarModels() {
        return this.getActiveDeal?.availableCarModels ?? [];
    }

    @action.bound
    public setAvailableCarModels(value: CarModel[]) {
        this.updateActiveItem({
            availableCarModels: value
        });
    }

    @computed
    public get selectedInsurancePlans() {
        return this.getActiveDeal?.selectedInsurancePlans ?? [];
    }


    @action.bound
    public setSelectedInsurancePlans(value: EnsurancePlan[]) {
        this.updateActiveItem({
            selectedInsurancePlans: value,
            status: defaultDealStatus
        });
    }

    @computed
    public get downpayment() {
        return this.getActiveDeal?.downpayment;
    }

    @action.bound
    public setDownPayment(value: number | undefined) {
        this.updateActiveItem({
            downpayment: value,
            status: defaultDealStatus
        });
    }

    @computed
    public get status() {
        return this.getActiveDeal?.status;
    }

    @action.bound
    public setStatus(value: DealStatus) {        
        this.updateActiveItem({
            status: value
        });
    }
}

export const dealsStore = new DealsStore();