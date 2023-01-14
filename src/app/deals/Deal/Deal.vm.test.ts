import { vi, expect, test, describe, SpyInstance, afterEach, assert } from 'vitest';
import { dealVM, finalizeDeal } from './Deal.vm';
import { createMemo } from 'solid-js';
import { Deal } from './Deal';
import { ApprovalsStoreRoot } from '../../approval.store';
import { ClockStoreRoot } from '../../clock.store';
import { DealsStoreRoot, getDefaultDealsStoreRoot } from '../../deals.store';
import { stubStore } from '../../../util/stubStore';
import { getUserInputState } from '../../../generic-components/input-models/UserInput.pure';
import { getLatestMatchingApproval } from '../../approval.store';
import { FinancingApproved } from '../../../api/Financing.Client';
import { PartialDeep } from 'type-fest';
import { financingClient } from '../../../api/Financing.Client';

vi.mock('../../approval.store', async (importOriginal) => {
    const mod = await importOriginal() as any;
    return {
        ...mod,
        getLatestMatchingApproval: vi.fn()
    }
});

vi.mock('solid-js', async (importOriginal) => {
    const mod = await importOriginal() as any;
    return {
        ...mod,
        createMemo: vi.fn()
    }
});

// Typical VM contains almost no business logic, 
// and only requires minimal testing 
describe(dealVM.name.toString(), () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // testing derived state
    test('provides derived state isCurrentApprovalLoading', () => {

        assert(vi.isMockFunction(createMemo));
        createMemo.mockReturnValue(() => ({}) as any);

        const vm = dealVM(
            stubStore<Deal>({
                businessParams: {
                    dealId: 5
                }
            }),
            stubStore<DealsStoreRoot>(),
            stubStore<ApprovalsStoreRoot>({
                activeFlows: { [`loading:5`]: true }
            }),
            stubStore<ClockStoreRoot>()
        );

        expect(vm).toBeDefined();
        expect(vm.derivedState.isCurrentApprovalLoading()).toBe(true);
    });

    // testing subVMs and state mutation
    test('provides downpayment subVM with validation for positive integer', () => {

        assert(vi.isMockFunction(createMemo));
        createMemo.mockReturnValue(() => ({}) as any);

        const vm = dealVM(
            stubStore<Deal>({
                businessParams: {
                    downpayment: getUserInputState(0)
                }
            }),
            stubStore<DealsStoreRoot>(),
            stubStore<ApprovalsStoreRoot>(),
            stubStore<ClockStoreRoot>()
        );

        expect(vm.subVMS.downpayment).toBeDefined();

        const downpaymentVM = vm.subVMS.downpayment;

        downpaymentVM.setCurrentUncommittedValue("-1.1");
        downpaymentVM.tryCommitValue();

        const downpaymentState = vm.state.businessParams.downpayment;
        expect(downpaymentState.committedValue).toBe(-1.1);
        expect(downpaymentState.uncommittedValue).toBe(undefined);
        expect(downpaymentState.messages).toEqual([{
            code: 'numberValidator.integer',
            message: 'Value -1.1 must be an integer',
            type:'error'
        }, { 
            code: 'numberValidator.positive',
            message: 'Value -1.1 must be positive',
            type: 'error'
        }]); 
    });

    // testing mutation when two subStores are part of the same store root
    test('can remove given deal from deals store', () => {

        assert(vi.isMockFunction(createMemo));
        createMemo.mockReturnValue(() => ({}) as any);

        const dealsStore = getDefaultDealsStoreRoot();

        dealsStore.deals.push({
            businessParams: {
                dealId: 5
            }
        } as any as Deal);

        const vm = dealVM(
            stubStore<Deal>(dealsStore.deals[0]),
            stubStore<DealsStoreRoot>(dealsStore),
            stubStore<ApprovalsStoreRoot>(),
            stubStore<ClockStoreRoot>()
        );

        expect(vm.subVMS.downpayment).toBeDefined();
        
        vm.removeThisDeal();

        expect(dealsStore.deals.length).toBe(0);
    });
});

describe(finalizeDeal.name.toString(), () => {

    afterEach(() => {
        vi.restoreAllMocks();
    });

     // testing 'flows'
     test('given an existing approval, will finalize deal', async () => {

        const approval: FinancingApproved = {
            isApproved: true,
            approvalToken: "777"
        }

        assert(vi.isMockFunction(getLatestMatchingApproval));
        getLatestMatchingApproval
            .mockReturnValue(approval);
        
        const dealState ={
            businessParams: {
                isDealFinalized: false
            },
            activeFlows: {}
        } as PartialDeep<Deal>;

        const spy = vi.spyOn(financingClient, "finalizeFinancing")
            .mockReturnValue(Promise.resolve(true));

        const flowPromise = finalizeDeal(
            stubStore<Deal>(dealState),
            stubStore<ApprovalsStoreRoot>());
        
        expect(dealState!.activeFlows!["loading:finalizing"]).toBe(true); 
        
        expect(dealState!.businessParams?.isDealFinalized).toEqual(false); 

        await flowPromise;

        expect(dealState!.activeFlows!["loading:finalizing"]).not.toBe(true);

        expect(dealState!.businessParams?.isDealFinalized).toEqual(true);

        expect(spy).toBeCalledWith(approval.approvalToken);
    });
});