import { createModel } from '@rematch/core'
import type { RootModel } from './RootModel'
import { financingClient, GetApprovalResult } from '../api/Financing.Client';

type requestApprovalParams = Parameters<typeof financingClient.getApproval>;
type ApprovalRequestStatus = {
    request: requestApprovalParams,
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

export const approvals = createModel<RootModel>()({
    state: defaultState,
    reducers: {
        storeApprovalReqStatus(state: ApprovalsState, dealId: number, reqStatus: ApprovalRequestStatus) {
            if (!state.approvals[dealId]) {
                state.approvals[dealId] = [];
            }

            state.approvals[dealId].push(reqStatus);
            return state;
        },
        setIsLoading(state: ApprovalsState, dealId: number, isLoading: boolean) {
            state.isLoading[dealId] = isLoading;
            return state;
        },
    },
    effects: (dispatch) => ({
        async requestApproval(req: { dealId: number, args: requestApprovalParams }, rootState) {
            dispatch.approvals.setIsLoading(req.dealId, true);

            const resp = await financingClient.getApproval(...req.args);

            dispatch.approvals.storeApprovalReqStatus(req.dealId, {
                request: req.args,
                result: resp,
                timestamp: new Date()
            });

            dispatch.approvals.setIsLoading(req.dealId, false);
        },
    }),
});