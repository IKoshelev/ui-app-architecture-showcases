<script context="module" lang="ts">
    import { clockStore, clockEffects } from "./models/clock.store";
    clockEffects.start(clockStore);
</script>

<!-- <svelte:options immutable={true}/> -->
<script lang="ts">
    import { DealForeignCurrencyTag } from "./models/deals/DealForeignCurrency/DealForeignCurrency";
    import { dealsStore, dealsEffects } from "./models/deals/deals.store";
    import DealCmp from "./models/deals/Deal/Deal.Cmp.svelte";
    import DealForeignCurrency from "./models/deals/DealForeignCurrency/DealForeignCurrency.Cmp.svelte";
    import TabHeader from "./TabHeader.svelte";

    $: activeDealId = $dealsStore.activeDealId;
    $: activeDeal = $dealsStore.deals.find(
        (x) => x.businessParams.dealId === activeDealId
    );
</script>

<div id="app-root">
    <div class="main-logo">Crazy Ivan Motors (Svelte)</div>

    <div class="screens">
        <div class="tabs">
            <button
                class="button-add-new-deal"
                disabled={$dealsStore.newDealIsLoading}
                on:click={() => dealsEffects.loadNewDeal(dealsStore)}
            >
                Add deal
            </button>

            <button
                class="button-add-new-deal"
                disabled={$dealsStore.newDealIsLoading}
                on:click={() =>
                    dealsEffects.loadNewDealForeignCurrency(dealsStore)}
            >
                Add foreign currency deal
            </button>

            {#each $dealsStore.deals as deal (deal.businessParams.dealId)}
                <TabHeader dealId={deal.businessParams.dealId} />
            {/each}
        </div>

        <div class={`active-tab`}>
            {#if typeof activeDealId === "undefined"}
                <!-- <svelte:fragment /> -->
            {:else if activeDeal.type === DealForeignCurrencyTag}
                <DealForeignCurrency  dealId={activeDealId} />
            {:else}
                <DealCmp dealId={activeDealId} />
            {/if}
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #app-root {
        display: grid;
        grid-template-columns: 1fr 40em 1fr;
        grid-template-rows: 5em auto auto;
    }

    .main-logo {
        font-size: 2em;
        font-weight: bold;
        grid-row: 1;
        grid-column: 2;
    }

    .screens {
        grid-row: 2;
        grid-column: 2;

        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
    }

    .screens > .tabs {
        grid-row: 1;
        grid-column: 1 / span 3;

        display: flex;
        flex-direction: row;
    }

    .screens > .tabs::after {
        border-bottom: 2px solid black;
        content: " ";
        flex-grow: 2;
    }

    .screens > .active-tab {
        grid-row: 2;
        grid-column: 1;

        border-left: 2px solid black;
        border-bottom: 2px solid black;
        border-right: 2px solid black;
    }
</style>
