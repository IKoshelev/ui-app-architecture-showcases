<!-- <svelte:options immutable={true}/> -->
<script lang="ts">
    import { dealsEffects, dealsStore } from "../deals.store";
    import { approvalsEffects, approvalsStore } from "../../approval.store";
    import { clockStore } from "../../clock.store";
    import { computeDealDerrivations } from "../../deals/Deal/Deal";
    import CarModelSelector from "./CarModelSelector.svelte";
    import InsurancePlanSelector from "./InsurancePlanSelector.svelte";
    import NumericInput from "../../../generic-components/NumericInput.svelte";
    import DealDescription from "../Deal/DealDescription.svelte";

    export let dealId: number;

    $: dealState = computeDealDerrivations(
        $dealsStore,
        $approvalsStore,
        $clockStore,
        dealId
    );

    $: currentDate = $clockStore.currentDate;

    $: messages = [
        ...dealState.deal.messages,
        ...(dealState.generalValidation.downpaymentExceedsPrice
            ? [`Downpayment can't exceed total price.`]
            : []),
        ...(dealState.approval?.isApproved === false
            ? [dealState.approval.message]
            : []),
    ];
</script>

<div class="car-purchase-model-selector-label">Please select model</div>
<CarModelSelector {dealId} />
<div class="car-purchase-insurance-selector-label">
    Please select insurance options
</div>
<InsurancePlanSelector {dealId} />
<div class="car-purchase-downpayment-label">Please select downpayment</div>
<NumericInput
    inputAttributes={{ class: "car-purchase-downpayment" }}
    messageAttributes={{ class: "car-purchase-downpayment-messages" }}
    modelState={dealState.deal.businessParams.downpayment}
    inputState={dealState.deal.downplaymentInputState}
    disabled={dealState.deal.isLoadingItemized.downpayment ||
        dealState.deal.businessParams.isDealFinalized}
    onChange={(inputVal) =>
        dealsStore.updateDownpaymentInputValue(dealId, inputVal)}
    onBlur={() => dealsStore.tryCommitDownpaymentInputValue(dealId)}
/>
<button
    class="button-set-minimum-possible-downpayment"
    disabled={dealState.isLoadingAny || !dealState.canRequestMinimumDownpayment}
    on:click={() =>
        dealsEffects.setMinimumPossibleDownpayment(dealsStore, dealId)}
>
    Set minimum possible
</button>
<div class="car-purchase-final-price-label">Final price</div>
<div class="car-final-price">
    {dealState.finalPrice}
</div>
{#if dealState.dealProgressState !== "no-approval"}
    <div />
    <DealDescription dealId={dealId}/>
{/if}
<button
    class="button-request-approval"
    disabled={dealState.isLoadingAny ||
        dealState.isCurrentApprovalLoading ||
        !dealState.canRequestApproval}
    on:click={() =>
        approvalsEffects.requestApproval(approvalsStore, dealState.deal)}
>
    Request approval
</button>
<button
    class="button-close-active-deal"
    on:click={() => dealsStore.removeDeal(dealId)}
>
    Close this deal
</button>
<button
    class="button-finalzie-deal"
    disabled={dealState.deal.isLoadingItemized.isDealFinalized ||
        !dealState.canBeFinalized}
    on:click={() =>
        dealsEffects.finalizeDeal(
            dealsStore,
            approvalsStore,
            clockStore,
            dealId
        )}
>
    Finalize deal
</button>
{#if messages.length > 0}
    <div class="car-purchase-messages">
        {#each messages as message (message)}
            <div>{message}</div>
        {/each}
    </div>
{/if}

<style>
</style>
