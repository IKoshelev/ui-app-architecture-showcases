import { CarPurchaseVM } from './car-purchase/vm/CarPurchase.VM';
import { observable, action } from 'mobx';


class AppVM {

    public constructor() {
        this.addNewDeal();
    }

    private coutner = 0;

    @observable
    public readonly capPurchaseVMs: CarPurchaseVM[] = [];

    @observable
    public activeCapPurchaseVM!: CarPurchaseVM;

    @action.bound
    public addNewDeal() {
        this.coutner += 1;
        const vm = new CarPurchaseVM(`Deal ${this.coutner}`)
        this.capPurchaseVMs.push(vm);
        this.activeCapPurchaseVM = vm;
    }

    @action.bound
    public setActiveDeal(deal: CarPurchaseVM) {
        this.activeCapPurchaseVM = deal;
    }

}

export const appVm = new AppVM();