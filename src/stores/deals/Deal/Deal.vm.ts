import { SubStore } from "../../../util/subStore";
import { canRequestMinimumDownpayment, Deal, getDealProgressState, getFinalPrice, getGeneralValidation, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, validateDealBusinessParams } from "./Deal.pure";
import { disable, isLoading, isValid } from '../../../util/validAndDisabled';
import { carInventoryClient } from "../../../api/CarInventory.Client";
import { carInsuranceClient } from "../../../api/CarInsurance.Client";
import { resetValueToPristine } from "../../../generic-components/input-models/UserInput.pure";
import { financingClient } from "../../../api/Financing.Client";
import { ApprovalsState, getLatestMatchingApproval, storeApprovalReqStatus } from "../../approval.store";
import { createMemo } from "solid-js";
import { ClockState } from "../../clock.store";
import { canBeFinalized, prepareRequestApprovalCall } from "./Deal.pure";

export function getDealVM(
    dealStore: SubStore<Deal>,
    approvalStore: SubStore<ApprovalsState>,
    clockStore: SubStore<ClockState>) {

    const [getDeal, setDeal] = dealStore;
    const [getApprovals, setApprovals] = approvalStore;
    const [getClock, setClock] = clockStore;

    const currentApproval = createMemo(() => getLatestMatchingApproval(
        getApprovals(),
        getDeal()
    ));

    const dealProgressState = createMemo(() => getDealProgressState(
        getDeal(),
        currentApproval(),
        getClock().currentDate
    ));

    const generalValidation = createMemo(() => getGeneralValidation(getDeal()));

    return {
        state: () => getDeal(),
        derivedState: {
            currentApproval,
            isCurrentApprovalLoading: () => getApprovals().reasonsToDisable[`loading:${getDeal().businessParams.dealId}`],
            canRequestMinimumDownpayment: () => canRequestMinimumDownpayment(getDeal().businessParams),
            finalPrice: () => getFinalPrice(getDeal()),
            generalValidation,
            dealProgressState,
            headerAdditionalDescription: () => getHeaderAdditionalDescription(getDeal()),
            canBeFinalized: () => canBeFinalized(
                getDeal(),
                currentApproval(),
                getClock().currentDate
            ),
            isLoading: () => isLoading(getDeal()),
            canRequestApproval: () => {
                const deal = getDeal();
                return deal.businessParams.carModelSelected
                    && deal.businessParams.isDealFinalized === false
                    && isValid(deal.businessParams.downpayment)
                    && generalValidation().downpaymentExceedsPrice === false
            }
        },
        reloadAvailableCarModels: () => reloadAvailableCarModels(dealStore),
        reloadAvailableInsurancePlans: () => reloadAvailableInsurancePlans(dealStore),
        setMinimumPossibleDownpayment: () => setMinimumPossibleDownpayment(dealStore),
        requestApproval: () => requestApproval(dealStore, approvalStore),
        finalizeDeal: () => finalizeDeal(dealStore, approvalStore),
    };
};

export async function reloadAvailableCarModels(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    disable(setDeal, 'loading:car-models', async () => {
        const carModels = await carInventoryClient.getAvailableCarModels();
        setDeal(x => x.carModelsAvailable = carModels);
    });
}

export async function reloadAvailableInsurancePlans(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    disable(setDeal, 'loading:insurance-plans', async () => {
        const insurancePlans = await carInsuranceClient.getAvailableInsurancePlans();
        setDeal(x => x.insurancePlansAvailable = insurancePlans);
    });
}

export async function setMinimumPossibleDownpayment(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    disable(setDeal, 'loading:downpayment', async () => {
        validateDealBusinessParams(getDeal().businessParams);

        const minPayment = await getMinimumPossibleDownpayment(getDeal());

        setDeal(x => {
            x.businessParams.downpayment.pristineValue = minPayment;
            resetValueToPristine(x.businessParams.downpayment);
        });
    });
}

export async function requestApproval(
    dealStore: SubStore<Deal>,
    approvalStore: SubStore<ApprovalsState>) {

    const [getDeal, setDeal] = dealStore;
    const [getApprovals, setApprovals] = approvalStore;

    disable(setDeal, 'loading:downpayment', async () => {
        validateDealBusinessParams(getDeal().businessParams);

        disable(setApprovals, `loading:${getDeal().businessParams.dealId}`, async () => {
            const call = prepareRequestApprovalCall(getDeal());
            const resp = await call.makeCall();

            setApprovals((draft) => {
                storeApprovalReqStatus(draft, getDeal().businessParams.dealId, {
                    request: call.request,
                    result: resp,
                    timestamp: new Date()
                });
            });
        });
    });
}

export async function finalizeDeal(
    dealStore: SubStore<Deal>,
    approvalStore: SubStore<ApprovalsState>) {

    const [getDeal, setDeal] = dealStore;
    const [getApprovals, setApprovals] = approvalStore;

    const approval =  getLatestMatchingApproval(
        getApprovals(),
        getDeal()
    );

    if (approval?.isApproved !== true) {
        throw new Error("Attempt to finalize deal without approval.");
    }

    disable(setDeal, "loading:approval", async () => {
        const res = await financingClient.finalizeFinancing(approval.approvalToken);

        setDeal(x => x.businessParams.isDealFinalized = res);
    });
}

