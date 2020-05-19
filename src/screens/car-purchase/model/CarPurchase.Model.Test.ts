import assert from 'assert';
import proxyquire from 'proxyquire';
import { delay } from '../../../util/delay';
import { LooseMock } from '../../../util/util';

const getApprovalMarker = 'MARKER1';

// typing is optional, and serves to provide intellisense
const { CarPurchaseModel } = <typeof import('./CarPurchase.Model')>proxyquire('./CarPurchase.Model', {
    '../../../api/Financing.Client': <LooseMock<typeof import('../../../api/Financing.Client')>>{
        financingClient: {
            getApproval: async () => {
                await delay();
                return {
                    marker: getApprovalMarker
                };
            }
        }
    }
});

describe('CarPurchseModel', () => {

    it('calls getApproval', async () => {
        const model = new CarPurchaseModel();

        model.carModel = {
            id: 1,
            basePriceUSD: 10,
            description: ''
        };

        assert(model.canRequestApproval === true);

        model.getApproval();

        await delay();

        assert((model.financingApprovalResponseForCurrentDeal as any).marker === getApprovalMarker);
    });
});