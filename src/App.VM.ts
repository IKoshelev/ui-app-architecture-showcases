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
    public activeCapPurchaseVM: CarPurchaseVM | undefined;

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

    @action.bound
    public closeActiveDeal() {
        const index = this.capPurchaseVMs.findIndex((x) => x === this.activeCapPurchaseVM);
        if (index === -1) {
            return;
        }
        this.activeCapPurchaseVM =
            this.capPurchaseVMs[index - 1]
            ?? this.capPurchaseVMs[index + 1];

        this.capPurchaseVMs.splice(index, 1);
    }

}

export const appVm = new AppVM();