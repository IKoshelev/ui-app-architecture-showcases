import { CarPurchaseVM } from './car-purchase/vm/CarPurchase.VM';


class AppVM {

    public readonly capPurchaseVM = new CarPurchaseVM();

}


export const appVm = new AppVM();