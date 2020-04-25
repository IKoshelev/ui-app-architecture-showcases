import { dealsStore } from "./Deals.Store";
import { carInvenotryClient } from "../api/CarInventory.Client";
import { carEnsuranceClient, EnsurancePlan, EnsurancePlanType } from "../api/CarEnsurance.Client";
import { financingClient } from "../api/Financing.Client";
import { trackIsRunningGeneric } from "../util/util";
import { defaultDealStatus } from "./Deals.Sync";

const trackLoadingInDealsStore = trackIsRunningGeneric(dealsStore.setIsLoading)

export const fetchAvailableCarModels = trackLoadingInDealsStore(async () => {
    const result = await carInvenotryClient.getAvaliableCarModels();
    dealsStore.setAvailableCarModels(result);
});

export const fetchAvailableInsurancePlans = trackLoadingInDealsStore(async () => {
    const result: EnsurancePlan[] = await carEnsuranceClient.getAvaliableEnsurancePlans();
    dealsStore.setAvailableInsurancePlans(result);
});

export const fetchMinimumDownPayment = trackLoadingInDealsStore(async () => {
    const minimumDownpayment = await financingClient.getMinimumPossibleDownpayment(
        dealsStore.carModel!,
        <EnsurancePlanType[]>dealsStore.selectedInsurancePlans.map(plan => plan.type)
    );
    dealsStore.setDownPayment(minimumDownpayment);
});


export const fetchApproval = trackLoadingInDealsStore(async () => {
    const result = await financingClient.getApproval(
        dealsStore.carModel!,
        <EnsurancePlanType[]>dealsStore.selectedInsurancePlans.map(plan => plan.type),
        <number>dealsStore.downpayment
    );

    // @Paul, yeah this is something TS team could improve
    // tagged types don't yet play well with conditionals
    const nextMessage = result.isApproved === false ? [result.message] : [];

    const nextStatus = {
        ...defaultDealStatus,

        // this is very bad. What if request took 10 seconds to get back to us from the serve?
        // Sending bare dates is can also be problematic in real world due to client time being off by a few minutes
        // but for the sake of our excercies, lets assume client and server clock are both correct 
        expirationTimer: result.isApproved ? 15 : 0,
        isApproved: result.isApproved,
        messages: nextMessage
    };

    dealsStore.setStatus(nextStatus);

    // @Paul aren't we gona get another interval for every time we call a function for approval?
    // And then it will tick multiple times per second?
    // Also !!! this will only tick for active deal !!!, what about the rest of them? 
    setInterval(() => {
        const currentTime = dealsStore.status?.expirationTimer ?? 0;
        if (currentTime > 0) {
            const timeLeft = currentTime - 1;
            dealsStore.setStatus({
                ...nextStatus,
                expirationTimer: timeLeft
            });
        }
    }, 1000);


    // @Paul IMHO, its a bad idea to have expiration be a number that we have to manually tick.
    // Adding to everything I described above, setTimer and setInterval are not guaranteed to be precise.
    // It may tick every second, but may as well take 2 in times of sevear load.
    // Oh, BTW, take a look at this: https://stackoverflow.com/questions/26487403/why-do-js-modal-message-boxes-pause-countdown-on-settimeout 
    // I really think we should keep it a hard state of expiration Date and current Date and
    // derive remaining seconds. And here comes the question - we can do it in the hooks,
    // but what happens if Deal expiration has to have conseuqences even when deal is not active? 
    // Imagine, for example, we have to send a notification (you know, 'webpage want to send you notifications')
    // when a deal is about to expire? 
});
