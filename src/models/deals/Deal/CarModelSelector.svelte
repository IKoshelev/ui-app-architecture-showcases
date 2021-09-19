<!-- <svelte:options immutable={true}/> -->
<script lang="ts">
    import { dealsStore, dealsEffects } from "../deals.store";
    import { approvalsStore } from "../../approval.store";
    import { clockStore } from "../../clock.store";
    import { computeDealDerrivations } from "../../deals/Deal/Deal";
    import SelectDropdown from "../../../generic-components/SelectDropdown.svelte";

    export let dealId: number;

    $: dealState = computeDealDerrivations(
        $dealsStore,
        $approvalsStore,
        $clockStore,
        dealId
    );

    $: currentDate = $clockStore.currentDate;
</script>

{#if dealState.deal.isLoadingItemized.carModelsAvailable}
    <div class="car-model-selector-select">Loading</div>
{:else}
    <SelectDropdown
        selectAttributes={{ class: "car-model-selector-select" }}
        emptyPlaceholder="Please select model"
        hasEmptyOption={true}
        availableItems={dealState.deal.carModelsAvailable}
        modelState={dealState.deal.businessParams.carModelSelected}
        getKeyValue={(item) => item.id.toString()}
        getDescription={(item) => item.description}
        disabled={dealState.isLoadingAny ||
            dealState.deal.businessParams.isDealFinalized}
        onSelect={(item) =>
            dealsStore.setInBusinessParams(dealId, {
                carModelSelected: item,
            })}
    />
{/if}

<button
    class="car-model-selector-refresh-btn"
    on:click={() =>
        dealsEffects.reloadAvailableCarModels(
            dealsStore,
            dealState.deal.businessParams.dealId
        )}
    disabled={dealState.isLoadingAny ||
        dealState.deal.businessParams.isDealFinalized}
>
    Refresh available models
</button>

<style>
</style>
