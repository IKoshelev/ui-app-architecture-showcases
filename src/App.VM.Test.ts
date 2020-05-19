import assert from 'assert';
//const { AppVM } = await import('./App.VM');

import rewire from 'rewire';

var carPurchaseModule = rewire<typeof import('./App.VM')>
    ('./App.VM');

carPurchaseModule.__set__('CarPurchase_VM_1', {
    CarPurchaseVM: function () {
        return {
            foo: 'bar'
        }
    }
});

const { AppVM } = carPurchaseModule;

describe('AppVM', () => {
    it('existst', () => {
        console.log(AppVM);
        assert(AppVM !== undefined);
        const inst = new AppVM();
        const mocked = inst.activeCapPurchaseVM;
    });
});

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            let a = 5;
            a += 7;
            assert.equal([1, 2, 3].indexOf(4), -1);
        });

        it('this one fails', function () {
            let a = 5;
            a += 7;
            assert.equal(true, false);
        });
    });
});