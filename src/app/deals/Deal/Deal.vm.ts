import { getDeeperSubStore, SubStore } from "../../../util/subStore";
import { canRequestMinimumDownpayment, Deal, getDealProgressState, getFinalPrice, getGeneralValidation, getHeaderAdditionalDescription, getMinimumPossibleDownpayment, areDealBusinessParamsValid, canRequestApproval } from "./Deal";
import { runFlow, isLoading, isValid } from '../../../util/validation-flows-messages';
import { carInventoryClient, CarModel } from "../../../api/CarInventory.Client";
import { carInsuranceClient, InsurancePlan } from "../../../api/CarInsurance.Client";
import { resetValueToPristine } from "../../../generic-components/input-models/UserInput.pure";
import { financingClient } from "../../../api/Financing.Client";
import { ApprovalsStoreRoot, getLatestMatchingApproval, storeApprovalReqStatus } from "../../approval.store";
import { createMemo } from "solid-js";
import { ClockStoreRoot } from "../../clock.store";
import { canBeFinalized, prepareRequestApprovalCall } from "./Deal";
import { acceptAllParser, getUserInputVM } from "../../../generic-components/input-models/UserInput.vm";
import { getNumericInputVM, numberValidatorFns } from "../../../generic-components/input-models/NumericUserInput.vm";
import { DealsStoreRoot, removeDeal } from "../../deals.store";

export function dealVM<T extends Deal>(
    dealStore: SubStore<T>,
    dealsStore: SubStore<DealsStoreRoot>,
    approvalStore: SubStore<ApprovalsStoreRoot>,
    clockStore: SubStore<ClockStoreRoot>) {

    const [deal, setDeal] = dealStore;
    const [deals, setDeals] = dealsStore;
    const [approvals, setApprovals] = approvalStore;
    const [clock, setClock] = clockStore;

    console.log(`Creating dealVM for ${deal.businessParams.dealId}`);

    const currentApproval = createMemo(() => getLatestMatchingApproval(
        approvals,
        deal
    ));

    const dealProgressState = createMemo(() => getDealProgressState(
        deal,
        currentApproval(),
        clock.currentDate
    ));

    const generalValidation = createMemo(() => getGeneralValidation(deal));

    return {
        state: deal,
        derivedState: {
            currentDate: () => clock.currentDate,
            currentApproval,
            isCurrentApprovalLoading: () => approvals.activeFlows[`loading:${deal.businessParams.dealId}`],
            canRequestMinimumDownpayment: () => canRequestMinimumDownpayment(deal.businessParams),
            finalPrice: () => getFinalPrice(deal),
            generalValidation,
            dealProgressState,
            canBeFinalized: () => canBeFinalized(
                deal,
                currentApproval(),
                clock.currentDate
            ),
            isLoading: () => isLoading(deal),
            isActiveDeal: () => deals.activeDealId === deal.businessParams.dealId,
            canRequestApproval: () => canRequestApproval(deal)
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
        setThisDealAsActive: () => setDeals(x => x.activeDealId = deal.businessParams.dealId),
        reloadAvailableCarModels: () => reloadAvailableCarModels(dealStore),
        reloadAvailableInsurancePlans: () => reloadAvailableInsurancePlans(dealStore),
        setMinimumPossibleDownpayment: () => setMinimumPossibleDownpayment(dealStore),
        requestApproval: () => requestApproval(dealStore, approvalStore),
        finalizeDeal: () => finalizeDeal(dealStore, approvalStore),
        removeThisDeal: () => setDeals(x => removeDeal(x, deal.businessParams.dealId))
    };
};

export type DealVM = ReturnType<typeof dealVM>;

export async function reloadAvailableCarModels(
    dealStore: SubStore<Deal>) {

    const [deal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:car-models', async () => {
        const carModels = await carInventoryClient.getAvailableCarModels();
        setDeal(x => x.carModelsAvailable = carModels);
    });
}

export async function reloadAvailableInsurancePlans(
    dealStore: SubStore<Deal>) {

    const [deal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:insurance-plans', async () => {
        const insurancePlans = await carInsuranceClient.getAvailableInsurancePlans();
        setDeal(x => x.insurancePlansAvailable = insurancePlans);
    });
}

export async function setMinimumPossibleDownpayment(
    dealStore: SubStore<Deal>) {

    const [deal, setDeal] = dealStore;

    runFlow(setDeal, 'loading:downpayment', async () => {
        if (!areDealBusinessParamsValid(deal.businessParams)) {
            return;
        }

        const minPayment = await getMinimumPossibleDownpayment(deal);

        setDeal(x => {
            x.businessParams.downpayment.pristineValue = minPayment;
            resetValueToPristine(x.businessParams.downpayment);
        });
    });
}

export async function requestApproval(
    dealStore: SubStore<Deal>,
    approvalStore: SubStore<ApprovalsStoreRoot>) {

    const [deal, setDeal] = dealStore;
    const [approvals, setApprovals] = approvalStore;

    runFlow(setDeal, 'loading:approval', async () => {
        if (!areDealBusinessParamsValid(deal.businessParams)) {
            return;
        }

        runFlow(setApprovals, `loading:${deal.businessParams.dealId}`, async () => {
            const call = prepareRequestApprovalCall(deal);

            if (!call) {
                return;
            }

            const resp = await call.makeCall();

            setApprovals((draft) => {
                storeApprovalReqStatus(draft, deal.businessParams.dealId, {
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

    const [deal, setDeal] = dealStore;
    const [approvals, setApprovals] = approvalStore;

    const approval = getLatestMatchingApproval(
       approvals,
        deal
    );

    if (approval?.isApproved !== true) {
        throw new Error("Attempt to finalize deal without approval.");
    }

    runFlow(setDeal, "loading:finalizing", async () => {
        const res = await financingClient.finalizeFinancing(approval.approvalToken);

        setDeal(x => x.businessParams.isDealFinalized = res);
    });
}

