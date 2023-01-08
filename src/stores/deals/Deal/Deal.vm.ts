import { getDeeperSubStore, SubStore } from "../../../util/subStore";
import { canRequestMinimumDownpayment, Deal, getDealProgressState, getFinalPrice, getGeneralValidation, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, areDealBusinessParamsValid } from "./Deal.pure";
import { runFlow, isLoading, isValid } from '../../../util/validation-flows-messages';
import { carInventoryClient, CarModel } from "../../../api/CarInventory.Client";
import { carInsuranceClient, InsurancePlan } from "../../../api/CarInsurance.Client";
import { resetValueToPristine } from "../../../generic-components/input-models/UserInput.pure";
import { financingClient } from "../../../api/Financing.Client";
import { ApprovalsStoreRoot, getLatestMatchingApproval, storeApprovalReqStatus } from "../../approval.store";
import { createMemo } from "solid-js";
import { ClockStoreRoot } from "../../clock.store";
import { canBeFinalized, prepareRequestApprovalCall } from "./Deal.pure";
import { acceptAllParser, getUserInputVM } from "../../../generic-components/input-models/UserInput.vm";
import { getNumericInputVM, numberValidatorFns } from "../../../generic-components/input-models/NumericUserInput.vm";
import { DealsStoreRoot, removeDeal } from "../../deals.store";

export function getDealVM<T extends Deal>(
    dealStore: SubStore<T>,
    dealsStore: SubStore<DealsStoreRoot>,
    approvalStore: SubStore<ApprovalsStoreRoot>,
    clockStore: SubStore<ClockStoreRoot>) {

    const [getDeal, setDeal] = dealStore;
    const [getDeals, setDeals] = dealsStore;
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
            currentDate: () => getClock().currentDate,
            currentApproval,
            isCurrentApprovalLoading: () => getApprovals().activeFlows[`loading:${getDeal().businessParams.dealId}`],
            canRequestMinimumDownpayment: () => canRequestMinimumDownpayment(getDeal().businessParams),
            finalPrice: () => getFinalPrice(getDeal()),
            generalValidation,
            dealProgressState,
            canBeFinalized: () => canBeFinalized(
                getDeal(),
                currentApproval(),
                getClock().currentDate
            ),
            isLoading: () => isLoading(getDeal()),
            isActiveDeal: () => getDeals().activeDealId === getDeal().businessParams.dealId,
            canRequestApproval: () => {
                const deal = getDeal();
                return deal.businessParams.carModelSelected.committedValue
                    && deal.businessParams.isDealFinalized === false
                    && isValid(deal.businessParams.downpayment)
                    && generalValidation().downpaymentExceedsPrice === false
            }
        },
        subVMS: {
            insurancePlansSelected: getUserInputVM<InsurancePlan[]>(
                getDeeperSubStore(dealStore, x => x.businessParams.insurancePlansSelected),
                acceptAllParser,
                (m) => m.map(x => x.description).join(", ")),
            carModelSelected: getUserInputVM<CarModel | undefined>(
                getDeeperSubStore(dealStore, x => x.businessParams.carModelSelected),
                acceptAllParser,
                (m) => m?.description ?? ""),
            downpayment: getNumericInputVM(
                getDeeperSubStore(dealStore, x => x.businessParams.downpayment),
                [
                    numberValidatorFns.integer(),
                    numberValidatorFns.positive()
                ]),
        },
        setThisDealAsActive: () => setDeals(x => x.activeDealId = getDeal().businessParams.dealId),
        reloadAvailableCarModels: () => reloadAvailableCarModels(dealStore),
        reloadAvailableInsurancePlans: () => reloadAvailableInsurancePlans(dealStore),
        setMinimumPossibleDownpayment: () => setMinimumPossibleDownpayment(dealStore),
        requestApproval: () => requestApproval(dealStore, approvalStore),
        finalizeDeal: () => finalizeDeal(dealStore, approvalStore),
        removeThisDeal: () => setDeals(x => removeDeal(x, getDeal().businessParams.dealId))
    };
};

export type DealVM = ReturnType<typeof getDealVM>;

export async function reloadAvailableCarModels(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:car-models', async () => {
        const carModels = await carInventoryClient.getAvailableCarModels();
        setDeal(x => x.carModelsAvailable = carModels);
    });
}

export async function reloadAvailableInsurancePlans(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:insurance-plans', async () => {
        const insurancePlans = await carInsuranceClient.getAvailableInsurancePlans();
        setDeal(x => x.insurancePlansAvailable = insurancePlans);
    });
}

export async function setMinimumPossibleDownpayment(
    dealStore: SubStore<Deal>) {

    const [getDeal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:downpayment', async () => {
        if (!areDealBusinessParamsValid(getDeal().businessParams)) {
            return;
        }

        const minPayment = await getMinimumPossibleDownpayment(getDeal());

        setDeal(x => {
            x.businessParams.downpayment.pristineValue = minPayment;
            resetValueToPristine(x.businessParams.downpayment);
        });
    });
}

export async function requestApproval(
    dealStore: SubStore<Deal>,
    approvalStore: SubStore<ApprovalsStoreRoot>) {

    const [getDeal, setDeal] = dealStore;
    const [getApprovals, setApprovals] = approvalStore;

    runFlow(setDeal, 'loading:approval', async () => {
        if (!areDealBusinessParamsValid(getDeal().businessParams)) {
            return;
        }

        runFlow(setApprovals, `loading:${getDeal().businessParams.dealId}`, async () => {
            const call = prepareRequestApprovalCall(getDeal());

            if (!call) {
                return;
            }

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
    approvalStore: SubStore<ApprovalsStoreRoot>) {

    const [getDeal, setDeal] = dealStore;
    const [getApprovals, setApprovals] = approvalStore;

    const approval = getLatestMatchingApproval(
        getApprovals(),
        getDeal()
    );

    if (approval?.isApproved !== true) {
        throw new Error("Attempt to finalize deal without approval.");
    }

    runFlow(setDeal, "loading:finalizing", async () => {
        const res = await financingClient.finalizeFinancing(approval.approvalToken);

        setDeal(x => x.businessParams.isDealFinalized = res);
    });
}

