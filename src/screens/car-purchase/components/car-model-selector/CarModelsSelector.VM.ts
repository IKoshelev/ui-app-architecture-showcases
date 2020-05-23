import { observable, action, computed, runInAction } from "mobx";
import { CarPurchaseModel } from "../../model/CarPurchase.Model";
import { CarModel, carInvenotryClient } from "../../../../api/CarInventory.Client";

export class CarModelsSelectorVM {

    public constructor(carPurchaseModel: CarPurchaseModel) {
        this.carPurchaseModel = carPurchaseModel;
        this.reloadAvailableModels();
    }

    private readonly carPurchaseModel: CarPurchaseModel;

    @observable
    public availableModels: CarModel[] = [];

    @observable
    public isLoading: boolean = false;

    @action.bound
    public async reloadAvailableModels() {
        this.isLoading = true;
        try {
            const models = await carInvenotryClient.val.getAvaliableCarModels();
            runInAction(() => this.availableModels = models);

        }
        finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    @computed
    public get isDealFinilized() {
        return this.carPurchaseModel.isDealFinalized;
    }

    @computed
    public get selectedModel() {
        return this.carPurchaseModel.carModel;
    }

    @action.bound
    public async setSelectedModel(carModel: CarModel | undefined) {
        this.carPurchaseModel.carModel = carModel;
    }
}