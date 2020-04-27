export type ApprovalStatus = {
    isApproved: boolean,
    expiration?: Date,
    isExpired?: boolean,
    approvalToken?: string
}