<script lang="ts">
    import { clockStore, clockEffects } from "./stores/clock.store";
    import { approvalsStore, approvalsEffects } from "./stores/approval.store";
    import { createBlankDeal } from "./stores/deals/Deal/Deal";
    import Dropdown from "./generic-components/SelectDropdown.svelte";

    import SelectMultiple from "./generic-components/SelectMultiple.svelte";

    export let name: string;

    let modelState = 2;
    $: modelState2 = [];
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
    <Dropdown
        availableItems={[1, 2, 3]}
        hasEmptyOption={true}
        {modelState}
        emptyPlaceholder="none"
        onSelect={(i) => {
            modelState = i;
        }}
    />
    <div>
        {modelState}
    </div>
    <SelectMultiple
        availableItems={[1, 2, 3, 4]}
        modelState={modelState2}
        onSelect={(m) => (modelState2 = m)}
    />
    <button on:click={(e) => (modelState2 = [])}> reset </button>
</main>

<style>
    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
            monospace;
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

    .screens > .tabs > .deal-tab-header {
        border: 2px solid black;
        flex-grow: 0;
        min-width: 6em;
        text-align: center;
        display: flex;
        flex-direction: row;
    }

    .screens > .tabs > .deal-tab-header.active {
        font-weight: bold;
        border-bottom: 2px solid #ffffff00;
    }

    .screens > .tabs > .deal-tab-header > .header-text {
        flex-grow: 1;
        overflow: hidden;
        padding-left: 2px;
        padding-right: 2px;
        font-size: 0.8em;
    }

    .screens > .tabs > .deal-tab-header > .close-button {
        flex-grow: 0;
    }

    .screens > .active-tab {
        grid-row: 2;
        grid-column: 1;

        border-left: 2px solid black;
        border-bottom: 2px solid black;
        border-right: 2px solid black;
    }
</style>
