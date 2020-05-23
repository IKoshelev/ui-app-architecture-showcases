import { CarPurchaseVM } from './screens/car-purchase/components/CarPurchase.VM';
import { observable, action, toJS, spy } from 'mobx';
import { CarPurchaseWithForeignCurrencyVM } from './screens/car-purchase/components/CarPurchaseWithForeignCurrency.VM';


type CarDealVM = CarPurchaseVM | CarPurchaseWithForeignCurrencyVM;

class AppVM {

    public constructor() {
        this.addNewDeal();
    }

    private coutner = 0;

    @observable
    public readonly capPurchaseVMs: CarDealVM[] = [];

    @observable
    public activeCapPurchaseVM: CarDealVM | undefined;

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

function logApp() {
    const jsState = toJS(appVm, { detectCycles: true });
    console.log('App state:', JSON.parse(JSON.stringify(jsState)));
}

(window as any).logApp = logApp;

export const appVm = new AppVM();

let spyDepth = 0;
spy(e => {
    //console.log(e);

    // if (e.spyReportStart
    //     && ((e.type === 'action' && e.name !== 'tick')
    //         || spyDepth > 0)) {

    //     if (spyDepth === 0) {
    //         console.log(e);
    //     }
    //     spyDepth += 1;
    // }

    // if (e.spyReportEnd && spyDepth > 0) {
    //     spyDepth -= 1;
    //     if (spyDepth === 0) {
    //         logApp();
    //     }
    // }
    if (e.spyReportStart && (e.type === 'action' && e.name !== 'tick')) {
        if (spyDepth === 0) {
            console.trace(e);
        }
        spyDepth += 1;
    }

    if (e.spyReportEnd && spyDepth > 0) {
        spyDepth -= 1;
        if (spyDepth === 0) {
            logApp();
        }
    }
});