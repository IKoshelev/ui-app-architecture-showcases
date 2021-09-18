import type { AllStores } from './all.stores'
import { financingClient, GetApprovalResult } from '../api/Financing.Client';
import { Deal, prepareRequstApprovalCall } from './deals/Deal/Deal';
import { get, writable } from 'svelte/store';
import { bindToStore, makeApplyDiff } from '../util/genericReducers';

type ApprovalRequestStatus = {
    request: any,
    result: GetApprovalResult,
    timestamp: Date
};

const defaultState = {
    approvals: {} as {
        [dealId: number]: ApprovalRequestStatus[]
    },
    isLoading: {} as {
        [dealId: number]: boolean
    }
};

export type ApprovalsState = typeof defaultState;

export const approvalsReducers = {
        storeApprovalReqStatus(state:ApprovalsState,  dealId: number, reqStatus: ApprovalRequestStatus) {

            if (!state.approvals[dealId]) {
                state.approvals[dealId] = [];
            }

            state.approvals[dealId].push(reqStatus);
        },
        setIsLoading(state:ApprovalsState, dealId: number, isLoading: boolean) {
            state.isLoading[dealId] = isLoading;
        }
} 

function createStore() {
    const store = writable(defaultState);

    return {
        subscribe: store.subscribe,

        ...bindToStore(store, approvalsReducers)
    }
}

export type ApprovalsStore = ReturnType<typeof createStore>;

export const approvalsEffects = {

    async requestApproval(approvalsStore: ApprovalsStore, deal: Deal) {
        approvalsStore.setIsLoading(deal.businessParams.dealId, true);

        const call = prepareRequstApprovalCall(deal);
        const resp = await call.makeCall();

        approvalsStore.storeApprovalReqStatus(deal.businessParams.dealId, {
            request: call.request,
            result: resp,
            timestamp: new Date()
        });

        approvalsStore.setIsLoading(deal.businessParams.dealId, false);
    },
}

export type ApprovalsEffects =  typeof approvalsEffects;

export const approvalsStore = createStore();