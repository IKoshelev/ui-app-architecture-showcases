import assert from 'assert';
import proxyquire from 'proxyquire';

const { AppVM } = proxyquire('./App.VM', {
    './screens/car-purchase/components/CarPurchase.VM': {
        CarPurchaseVM: function () {
            return {
                foo: 'bar'
            }
        }
    }
}) as typeof import('./App.VM');

describe('AppVM', () => {
    it('existst', () => {
        assert(AppVM !== undefined);
        console.log('aaaaa');
    });

    it('gets proxquire mocks', () => {
        const inst = new AppVM();
        const mocked = inst.activeCapPurchaseVM;
        assert((mocked as any).foo === 'bar');
    });
});