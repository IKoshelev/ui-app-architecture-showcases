export type ApprovalStatus = {
    isApproved: boolean,
    expiration?: Date,
    isExpired?: boolean, // this is state duplication with expiration date - typically bad
    approvalToken?: string
}