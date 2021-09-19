<!-- <svelte:options immutable={true}/> -->
<script lang="ts">
    import { dealsStore, dealsEffects } from "./stores/deals/deals.store";
    import { approvalsStore } from "./stores/approval.store";
    import { clockStore } from "./stores/clock.store";
    import { computeDealDerrivations } from "./stores/deals/Deal/Deal";
import { diffSeconds } from "./util/diffSeconds";

    export let dealId: number;

    $: dealState = computeDealDerrivations(
        $dealsStore,
        $approvalsStore,
        $clockStore,
        dealId
    );

    $: currentDate = $clockStore.currentDate;
    $: headerText = computeHeaderText(dealState, currentDate);
    
    function computeHeaderText(
        dealState: ReturnType<typeof computeDealDerrivations>,
        currentDate: Date
    ) {
        if (!dealState.deal.businessParams.carModelSelected) {
            return `blank deal`;
        }

        let text: string = "";
        if (dealState.dealProgressState === "deal-finalized") {
            text = "done";
        } else if (dealState.dealProgressState === "approval-perpetual") {
            text = "approved";
        } else if (typeof dealState.dealProgressState !== "string") {
            text = `${diffSeconds(
                dealState.dealProgressState.approvalExpiresAt,
                currentDate
            )} sec`;
        }

        return `${dealState.deal.businessParams.carModelSelected.description} ${dealState.headerAdditionalDescription}${text}`;
    };
</script>

<div
    class="deal-tab-header"
    class:active={ dealId === $dealsStore.activeDealId}
>
    <div
      class='header-text'
      on:click={() => dealsStore.applyDiff({ activeDealId: dealId})}
    >
      {headerText}
    </div>

    <button
      class='close-button'
      on:click={() => dealsStore.removeDeal(dealId)}
    >
      X
    </button>
  </div>

<style>
    .deal-tab-header {
        border: 2px solid black;
        flex-grow: 0;
        min-width: 6em;
        text-align: center;
        display: flex;
        flex-direction: row;
    }

    .deal-tab-header.active {
        font-weight: bold;
        border-bottom: 2px solid #ffffff00;
    }

    .deal-tab-header > .header-text {
        flex-grow: 1;
        overflow: hidden;
        padding-left: 2px;
        padding-right: 2px;
        font-size: 0.8em;
    }

   .deal-tab-header > .close-button {
        flex-grow: 0;
    }
</style>
