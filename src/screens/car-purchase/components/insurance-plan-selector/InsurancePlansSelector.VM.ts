import { observable, action, computed } from "mobx";
import { CarPurchaseModel } from "../../model/CarPurchase.Model";
import { InsurancePlan, carInsuranceClient } from "../../../../api/CarInsurance.Client";

export class InsurancePlansSelectorVM {

    public constructor(carPurchaseModel: CarPurchaseModel) {
        this.carPurchaseModel = carPurchaseModel;
        this.reloadAvailablePlans();
    }

    private readonly carPurchaseModel: CarPurchaseModel;

    @observable
    public availablePlans: InsurancePlan[] = [];

    @observable
    public isLoading: boolean = false;

    @action.bound
    public async reloadAvailablePlans() {
        this.isLoading = true;
        try {
            this.availablePlans = await carInsuranceClient.val.getAvaliableInsurancePlans();
        }
        finally {
            this.isLoading = false;
        }
    }

    @computed
    public get isDealFinilized() {
        return this.carPurchaseModel.isDealFinalized;
    }

    @computed
    public get selectedPlans() {
        return this.availablePlans
            .filter(x =>
                this.carPurchaseModel.insurancePlansSelected.some(y => y === x.type));
    }

    @action.bound
    public async setSelectedPlans(newSelectedPlans: InsurancePlan[]) {

        const selectedPlanTypes = newSelectedPlans.map(x => x.type);
        this.carPurchaseModel.insurancePlansSelected = selectedPlanTypes;
    }
}