import { PartialDeep } from 'type-fest';
import { vi, expect, test, describe, afterEach } from 'vitest';
import { InsurancePlanType } from '../../../api/CarInsurance.Client';
import { financingClient } from '../../../api/Financing.Client';
import { Deal, DealTag, getFinalPrice, getMinimumPossibleDownpayment } from './Deal';

describe('Deal', () => {

    afterEach(() => {
        vi.restoreAllMocks();
      });

    test(getFinalPrice.name.toString(), () => {

        const deal: PartialDeep<Deal, { recurseIntoArrays: true }> = {
            type: DealTag,
            businessParams: {
                carModelSelected: {
                    committedValue: {
                        basePriceUSD: 100
                    }
                },
                insurancePlansSelected: {
                    committedValue: [{
                        rate: 0.1
                    }, {
                        rate: 0.2
                    }]
                }
            }
        } 

        const result = getFinalPrice(deal as Deal); 

        expect(result).eq(130); 
    });

    test(getMinimumPossibleDownpayment.name.toString(), async () => {

        const deal = {
            type: DealTag,
            businessParams: {
                carModelSelected: {
                    committedValue: {
                        id: 1,
                        description: "",
                        basePriceUSD: 100
                    }
                },
                insurancePlansSelected: {
                    committedValue: [{
                        type: InsurancePlanType.assetProtection
                    }]
                }
            }
        } satisfies PartialDeep<Deal, { recurseIntoArrays: true }>;

        vi.spyOn(financingClient, 'getMinimumPossibleDownpayment')
            .mockReturnValue(Promise.resolve(77));

        const result = await getMinimumPossibleDownpayment(deal as Deal); 

        expect(result).eq(77); 
        expect(financingClient.getMinimumPossibleDownpayment)
            .toBeCalledWith(
                deal.businessParams?.carModelSelected?.committedValue,
                deal.businessParams?.insurancePlansSelected.committedValue.map(x => x.type))
    });
});

