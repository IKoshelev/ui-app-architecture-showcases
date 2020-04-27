export type ApprovalStatus = {
    isApproved: boolean,
    approvalHasExpirationTimer: boolean,
    expirationTimer: number,
    approvalToken: string
}