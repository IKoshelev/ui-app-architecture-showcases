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
        console.log(AppVM);
        assert(AppVM !== undefined);
        const inst = new AppVM();
        const mocked = inst.activeCapPurchaseVM;
        assert((mocked as any).foo === 'bar');
    });
});

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });

        // it('this one should fails', function () {
        //     assert.equal(true, false);
        // });
    });
});