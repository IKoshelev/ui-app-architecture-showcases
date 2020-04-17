import { observable, action, computed } from "mobx";
import { CarPurchaseModel } from "../../model/CarPurchase.Model";
import { EnsurancePlan, carEnsuranceClient } from "../../../api/CarEnsurance.Client";


export class EnsurancePlansSelectorVM {

    public constructor(carPurchaseModel: CarPurchaseModel) {
        this.carPurchaseModel = carPurchaseModel;
        this.reloadAvailablePlans();
    }

    private readonly carPurchaseModel: CarPurchaseModel;

    @observable
    public availablePlans: EnsurancePlan[] = [];

    @observable
    public isLoading: boolean = false;

    @action.bound
    public async reloadAvailablePlans() {
        this.isLoading = true;
        try {
            this.availablePlans = await carEnsuranceClient.getAvaliableEnsurancePlans();
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
    public get selectedPlanTypes() {
        return this.carPurchaseModel.ensurancePlansSelected.map(x => x.toString());
    }

    @computed
    public get selectedPlans() {
        return this.availablePlans
            .filter(x =>
                this.carPurchaseModel.ensurancePlansSelected.some(y => y === x.type));
    }

    @action.bound
    public async setSelectedPlans(newSelectedPlans: string[]) {
        const selectedPlanTypes = this.availablePlans
            .filter(x => {
                return newSelectedPlans.some(y => y === x.type.toString())
            })
            .map(x => x.type);

        this.carPurchaseModel.ensurancePlansSelected = selectedPlanTypes;
    }
}