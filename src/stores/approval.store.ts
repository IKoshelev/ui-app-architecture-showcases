export const a = 0;
// import { createModel } from '@rematch/core'
// import type { RootModel } from './all.storess'
// import { financingClient, GetApprovalResult } from '../api/Financing.Client';
// import { Deal, prepareRequstApprovalCall } from './deals/Deal/Deal';

// type ApprovalRequestStatus = {
//     request: any,
//     result: GetApprovalResult,
//     timestamp: Date
// };

// const defaultState = {
//     approvals: {} as {
//         [dealId: number]: ApprovalRequestStatus[]
//     },
//     isLoading: {} as {
//         [dealId: number]: boolean
//     }
// };

// export type ApprovalsState = typeof defaultState;

// export const approvals = createModel<RootModel>()({
//     state: defaultState,
//     reducers: {
//         storeApprovalReqStatus(state: ApprovalsState, dealId: number, reqStatus: ApprovalRequestStatus) {
//             if (!state.approvals[dealId]) {
//                 state.approvals[dealId] = [];
//             }

//             state.approvals[dealId].push(reqStatus);
//             return state;
//         },
//         setIsLoading(state: ApprovalsState, dealId: number, isLoading: boolean) {
//             state.isLoading[dealId] = isLoading;
//             return state;
//         },
//     },
//     effects: (dispatch) => ({
//         async requestApproval(deal: Deal, rootState) {
//             dispatch.approvals.setIsLoading(deal.businessParams.dealId, true);

//             const call = prepareRequstApprovalCall(deal);
//             const resp = await call.makeCall();

//             dispatch.approvals.storeApprovalReqStatus(deal.businessParams.dealId, {
//                 request: call.request,
//                 result: resp,
//                 timestamp: new Date()
//             });

//             dispatch.approvals.setIsLoading(deal.businessParams.dealId, false);
//         },
//     }),
// });