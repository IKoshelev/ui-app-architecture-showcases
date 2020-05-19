import { CarPurchaseVM } from './screens/car-purchase/components/CarPurchase.VM';
import { observable, action, computed } from 'mobx';
import { CarPurchaseWithForeignCurrencyVM } from './screens/car-purchase/components/CarPurchaseWithForeignCurrency.VM';


type CarDealVM = CarPurchaseVM | CarPurchaseWithForeignCurrencyVM;

export class AppVM {

    public constructor() {
        this.addNewDeal();
    }

    private coutner = 0;

    @observable
    public readonly capPurchaseVMs: CarDealVM[] = [];

    @observable
    public activeCapPurchaseVM: CarDealVM | undefined;

    @computed
    public get activeCarPurchaseId() {
        return this.activeCapPurchaseVM?.id;
    }

    @action.bound
    public addNewDeal() {
        this.coutner += 1;
        const vm = new CarPurchaseVM(`Deal ${this.coutner}`, this.closeDeal);
        this.capPurchaseVMs.push(vm);
        this.activeCapPurchaseVM = vm;
    }

    @action.bound
    public addForeignCurrencyDeal() {
        this.coutner += 1;
        const vm = new CarPurchaseWithForeignCurrencyVM(`Deal ${this.coutner}`, this.closeDeal);
        this.capPurchaseVMs.push(vm);
        this.activeCapPurchaseVM = vm;
    }

    @action.bound
    public setActiveDeal(deal: CarPurchaseVM) {
        this.activeCapPurchaseVM = deal;
    }

    @action.bound
    private closeDeal(dealVm: CarPurchaseVM) {
        const index = this.capPurchaseVMs.findIndex((x) => x === dealVm);
        if (index === -1) {
            return;
        }

        if (this.activeCapPurchaseVM === this.capPurchaseVMs[index]) {
            this.activeCapPurchaseVM =
                this.capPurchaseVMs[index - 1]
                ?? this.capPurchaseVMs[index + 1];
        }

        this.capPurchaseVMs.splice(index, 1);
    }

}

export const appVm = new AppVM();