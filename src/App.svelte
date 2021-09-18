<script lang="ts">
    import { clockStore, clockEffects } from "./stores/clock.store";
    import { approvalsStore, approvalsEffects } from "./stores/approval.store";
    import { createBlankDeal } from "./stores/deals/Deal/Deal";
    import Dropdown, {
        SelectDropdownProps,
    } from "./generic-components/SelectDropdown.svelte";
import { empty } from "svelte/internal";

    export let name: string;

    let params: SelectDropdownProps<number> = {
        availableItems: [1, 2, 3],
        hasEmptyOption: true,
        modelState: 2,
        emptyPlaceholder: 'none',
        onSelect: (i) => (params.modelState = i),
    };
</script>

<main>
    <h1>Hello {name}!</h1>
    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
    <p>
        {$clockStore.currentDate}
    </p>
    <p>
        {$clockStore.tickIntervalHandle ? "is ticking" : "is NOT ticking"}
    </p>
    <button on:click={() => clockEffects.start(clockStore)}>Start</button>
    <button on:click={() => clockEffects.stop(clockStore)}>Stop</button>
    <div>
        {JSON.stringify($approvalsStore)}
    </div>
    <button
        on:click={() => {
            const deal = createBlankDeal();
            deal.businessParams.carModelSelected = {
                id: 1,
                description: "",
                basePriceUSD: 100,
            };
            approvalsEffects.requestApproval(approvalsStore, deal);
        }}>Toggle</button
    >
    <Dropdown p={params} />
    <div>
        {params.modelState}
    </div>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
