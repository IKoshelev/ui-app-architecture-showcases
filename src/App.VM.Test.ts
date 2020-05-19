import assert from 'assert';
import proxyquire from 'proxyquire';
import { StrictMock } from './util/util';
import { observable } from 'mobx';

const CarPurchaseVM_module: StrictMock<typeof import('./screens/car-purchase/components/CarPurchase.VM')> = {
    CarPurchaseVM: (class {
        id = 'bar';
        constructor() {
            observable.object(this);
        }
    }),
}

const { AppVM } = <typeof import('./App.VM')>proxyquire('./App.VM', {
    './screens/car-purchase/components/CarPurchase.VM': CarPurchaseVM_module
});

describe('AppVM', () => {
    it('existst', () => {
        assert(AppVM !== undefined);
        console.log('aaaaa');
    });

    it('gets proxquire mocks', () => {
        const inst = new AppVM();
        const mocked = inst.activeCapPurchaseVM;
        assert(mocked!.id === 'bar');
        assert(inst.activeCarPurchaseId === 'bar');

        //bypass readonly
        (mocked as any).id = 'mmm';

        //computed reacts to mocked value change, mocked value is observable
        assert(inst.activeCarPurchaseId === 'mmm');

    });
});