<script lang="ts" context="module">
    window.process = { env: { NODE_ENV: 'production' } } as any;
</script>
<svelte:options immutable={true}/>
<script lang="ts">
    import {
        dealsStore,
        dealsEffects
    } from './stores/deals/deals.store'

    import {
        store1,
        store2,
        storeImmut
    } from './stores/experiments.store'

    $: console.log(`Store1:`, $store1);
    $: console.log(`Store1.a:`, $store1.a);
    $: console.log(`Store1.b:`, $store1.b);
    $: store1a = $store1.a;
    $: console.log(`store1a`, store1a);

    $: console.log(`Store2:`, $store2);
    $: console.log(`Store2.a.val:`, $store2.a.val);
    $: console.log(`Store2.b.val:`, $store2.b.val);
    $: store2a = $store2.a;
    $: console.log(`store2a`, store2a);

    $: console.log(`Store2:`, $storeImmut);
    $: console.log(`Store2.a.val:`, $storeImmut.a.val);
    $: console.log(`Store2.b.val:`, $storeImmut.b.val);
    $: storeImmutA = $storeImmut.a;
    $: console.log(`store2a`, storeImmutA);

    $: activeDealId = $dealsStore.activeDealId;
    $: activeDeal = $dealsStore.deals.find(x => x.businessParams.dealId === activeDealId);

</script>

<div id='app-root'>
    <div>
        {$store1.a}
        <button on:click={() => store1.incr1()}>+</button>
    </div>
    <div>
        {$store1.b}
        <button on:click={() => store1.incr2()}>+</button>
    </div>
    <div>
        {$store2.a.val}
        <button on:click={() => store2.incr1()}>+</button>
    </div>
    <div>
        {$store2.b.val}
        <button on:click={() => store2.incr2()}>+</button>
    </div>
    <div>
        {$storeImmut.a.val}
        <button on:click={() => storeImmut.incr1()}>+</button>
    </div>
    <div>
        {$storeImmut.b.val}
        <button on:click={() => storeImmut.incr2()}>+</button>
    </div>


    <div class='main-logo'>
      Crazy Ivan Motors (Svelte)
    </div>

    <div class='screens'>
      <div class='tabs'>
        <button
          class='button-add-new-deal'
          disabled={$dealsStore.newDealIsLoading}
          on:click={() => dealsEffects.loadNewDeal(dealsStore)}
        >
          Add deal
        </button>

        <button
          class="button-add-new-deal"
          disabled={$dealsStore.newDealIsLoading}
          on:click={() => dealsEffects.loadNewDealForeignCurrency(dealsStore)}
        >
          Add foreign currency deal
        </button>

        <!-- { dealsState.deals.filter(x => !x.isClosed).map(x => (<TabHeader 
              key={x.businessParams.dealId} 
              dealId={x.businessParams.dealId}
            />))} -->
      </div>

      <div class={`active-tab`}>
        <!-- {
          renderDealTab(dealsState.activeDealId, activeDealType)
        } -->
      </div>
    </div>
  </div>

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
