import isEqual from 'lodash.isequal';
import { GetApprovalResult } from '../api/Financing.Client';
import { Deal, prepareRequestApprovalCall } from './deals/Deal/Deal';

type ApprovalRequestStatus = {
    request: any,
    result: GetApprovalResult,
    timestamp: Date
};

export function getDefaultApprovalsStoreRoot() {
    return {
        approvals: {} as Record<number, ApprovalRequestStatus[]>,
        activeFlows: {} as Record<`loading:${number}`, true>
    }
};

export type ApprovalsStoreRoot = ReturnType<typeof getDefaultApprovalsStoreRoot>;

export function storeApprovalReqStatus(
    state: ApprovalsStoreRoot,
    dealId: number,
    reqStatus: ApprovalRequestStatus) {
    if (!state.approvals[dealId]) {
        state.approvals[dealId] = [];
    }

    state.approvals[dealId].push(reqStatus);
}

export function getLatestMatchingApproval(
    state: ApprovalsStoreRoot,
    deal: Deal): GetApprovalResult | undefined {

    const approvalCall = prepareRequestApprovalCall(deal);

    if (!approvalCall) {
        return undefined;
    }

    const currentDealRequest = approvalCall.request;

    return state.approvals[deal.businessParams.dealId]
        ?.filter(({ request }) => {
            //relies on insurance plans always being in same order;
            //in the real world request should probably also include method name
            return isEqual(request, currentDealRequest);
        })
        .sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())
    [0]?.result;
}