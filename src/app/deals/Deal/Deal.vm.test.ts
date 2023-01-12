import { vi, expect, test, describe, SpyInstance, afterEach } from 'vitest';
import { dealVM } from './Deal.vm';
import { createMemo } from 'solid-js';
import { PartialDeep } from 'type-fest';
import { Deal } from './Deal';
import { ApprovalsStoreRoot } from '../../approval.store';
import { SubStore } from '../../../util/subStore';
import { ClockStoreRoot } from '../../clock.store';
import { DealsStoreRoot } from '../../deals.store';

vi.mock('solid-js', async (importOriginal) => {
    const mod = await importOriginal() as any;
    return {
      ...mod,
      createMemo: vi.fn()
    }
  });

export function stubStore<T>(
    state: PartialDeep<T> = {} as any, 
    update: (state: T) => void = () => {}){

    return [state, update] as any as SubStore<T>
}

describe('Deal.vm', () => {

    afterEach(() => {
        vi.restoreAllMocks();
      });
      
    // Typical VM contains almost no business logic, 
    // and only requires minimal testing 
    test(dealVM.name.toString(), () => {
 
        (createMemo as any as SpyInstance<any>).mockReturnValue(() => ({}) as any);

        const vm = dealVM(
            stubStore<Deal>({
                businessParams: {
                    dealId: 5
                }
            }),
            stubStore<DealsStoreRoot>(),
            stubStore<ApprovalsStoreRoot>({
                activeFlows: { [`loading:5`]: true }
            } ),
            stubStore<ClockStoreRoot>()
        );
      
        expect(vm).toBeDefined();
        expect(vm.derivedState.isCurrentApprovalLoading()).toBe(true);
    });
});

