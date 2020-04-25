export type dealState = 'deal-finalized' | 'approval-perpetual' | 'no-approval' | 'approval-expired';

const state: dealState = 'approval-expired';
const approvalExpiresInSeconds = 15;

export const useDealState = () => {

    const getDealStateDescription = (state: dealState) => {
        if (state === 'deal-finalized') {
            return 'Congratulations! Deal is finalized.';
        }
        if (state === 'no-approval') {
            return '';
        }
        if (state === 'approval-perpetual') {
            return 'Approval granted.';
        }
        if (state === 'approval-expired') {
            return 'Approval expired.';
        }
        return `Approval granted. Expires in ${approvalExpiresInSeconds} seconds.`;
    }

    return {
        message: getDealStateDescription(state),
        showMessage: true
    }
}