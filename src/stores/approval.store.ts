import isEqual from 'lodash.isequal';
import { GetApprovalResult } from '../api/Financing.Client';
import { SubStore } from '../util/subStore';
import { Deal, prepareRequestApprovalCall, validateDealBusinessParams } from './deals/Deal/Deal.pure';
import { runFlow } from '../util/validAndDisabled';

type ApprovalRequestStatus = {
    request: any,
    result: GetApprovalResult,
    timestamp: Date
};

const defaultState = {
    approvals: {} as Record<number, ApprovalRequestStatus[]>,
    activeFlows: {} as Record<`loading:${number}`, true>
};

export type ApprovalsState = typeof defaultState;

export function storeApprovalReqStatus(
    state: ApprovalsState,
    dealId: number,
    reqStatus: ApprovalRequestStatus) {
    if (!state.approvals[dealId]) {
        state.approvals[dealId] = [];
    }

    state.approvals[dealId].push(reqStatus);
}

export function getLatestMatchingApproval(
    state: ApprovalsState,
    deal: Deal): GetApprovalResult | undefined {

    const currentDealRequest = prepareRequestApprovalCall(deal).request;

    return state.approvals[deal.businessParams.dealId]
        ?.filter(({ request }) => {
            //relies on insurance plans always being in same order;
            //in the real world request should probably also include method name
            return isEqual(request, currentDealRequest);
        })
        .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
    [0]?.result;
}