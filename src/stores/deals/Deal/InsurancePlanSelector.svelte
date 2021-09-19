<!-- <svelte:options immutable={true}/> -->
<script lang="ts">
    import { dealsStore, dealsEffects } from "../deals.store";
    import { approvalsStore } from "../../approval.store";
    import { clockStore } from "../../clock.store";
    import { computeDealDerrivations } from "../../deals/Deal/Deal";
    import SelectMultiple from "../../../generic-components/SelectMultiple.svelte";

    export let dealId: number;

    $: dealState = computeDealDerrivations(
        $dealsStore,
        $approvalsStore,
        $clockStore,
        dealId
    );

    $: currentDate = $clockStore.currentDate;
</script>

{#if dealState.deal.isLoadingItemized.insurancePlansAvailable}
    <div class="insurance-plan-selector-select">Loading</div>
{:else}
    <SelectMultiple
        selectAttributes={{ class: "insurance-plan-selector-select" }}
        availableItems={dealState.deal.insurancePlansAvailable}
        modelState={dealState.deal.businessParams.insurancePlansSelected}
        disabled={dealState.isLoadingAny}
        getKeyValue={(item) => item.type.toString()}
        getDescription={(item) => item.description}
        onSelect={(items) =>
            dealsStore.setInBusinessParams(dealId, {
                insurancePlansSelected: items,
            })}
    />
{/if}

<button
    class="insurance-plan-selector-refresh-btn"
    on:click={() =>
        dealsEffects.reloadAvailableInsurancePlans(dealsStore, dealId)}
    disabled={dealState.isLoadingAny ||
        dealState.deal.businessParams.isDealFinalized}
>
    Refresh available plans
</button>

<style>
</style>
