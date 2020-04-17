import { observable, action, computed } from "mobx";
import { CarPurchaseModel } from "../../model/CarPurchase.Model";
import { CarModel, carInvenotryClient } from "../../../api/CarInventory.Client";


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
            this.availableModels = await carInvenotryClient.getAvaliableCarModels();
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
    public get selectedModel() {
        return this.carPurchaseModel.carModel;
    }

    @action.bound
    public async selectModel(modelId: string | undefined) {
        this.carPurchaseModel.carModel = this.availableModels.find(x => x.id.toString() === modelId);
    }
}