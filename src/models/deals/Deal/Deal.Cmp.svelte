<script lang="ts">
    import DealCmpBare from "./Deal.BareCmp.svelte";

    export let dealId: number;
</script>

<div class='car-purchase-deal'>
    <DealCmpBare dealId={dealId}/>
</div>

<style>
    :global(.car-purchase-deal) {
        display: grid;
        grid-template-columns: 16em 12em 12em;
        grid-template-rows: 2em 5em 2em auto 2em auto 2em auto;
    }

    :global(.car-purchase-deal) > * {
        margin: 2px;
    }

    /* css class names could still use some analysis and improvement */

    :global(.car-purchase-deal > .car-purchase-model-selector-label) {
        grid-row: 1;
        grid-column: 1;
    }

    :global(.car-purchase-deal > .car-model-selector-select),
    :global(.car-purchase-deal > .car-model-selector-loading) {
        grid-row: 1;
        grid-column: 2;
    }

    :global(.car-purchase-deal > .car-model-selector-refresh-btn) {
        grid-row: 1;
        grid-column: 3;
    }

    :global(.car-purchase-deal > .car-purchase-insurance-selector-label) {
        grid-row: 2;
        grid-column: 1;
    }

    :global(.car-purchase-deal > .insurance-plan-selector-select),
    :global(.car-purchase-deal > .insurance-plan-selector-loading) {
        grid-row: 2;
        grid-column: 2;
    }

    :global(.car-purchase-deal > .insurance-plan-selector-refresh-btn) {
        grid-row: 2;
        grid-column: 3;
    }

    :global(.car-purchase-deal > .car-purchase-downpayment-label) {
        grid-row: 3;
        grid-column: 1;
    }

    :global(.car-purchase-deal > .car-purchase-downpayment) {
        grid-row: 3;
        grid-column: 2;
    }

    :global(.car-purchase-deal > .car-purchase-downpayment.invalid) {
        border: 2px solid red;
    }

    :global(.car-purchase-deal > .button-set-minimum-possible-downpayment) {
        grid-row: 3;
        grid-column: 3;
    }

    :global(.car-purchase-deal > .car-purchase-downpayment-messages) {
        grid-row: 4;
        grid-column: 2 / span 2;
    }

    :global(.car-purchase-deal > .car-purchase-final-price-label) {
        grid-row: 5;
        grid-column: 1;
    }

    :global(.car-purchase-deal > .car-final-price) {
        grid-row: 5;
        grid-column: 2;
    }

    :global(.car-purchase-deal > .car-purchase-deal-state) {
        grid-row: 6;
        grid-column: 1 / span 3;
    }

    :global(.car-purchase-deal > .button-close-active-deal) {
        grid-row: 7;
        grid-column: 1;
    }

    :global(.car-purchase-deal > .button-request-approval) {
        grid-row: 7;
        grid-column: 2;
    }

    :global(.car-purchase-deal > .button-finalzie-deal) {
        grid-row: 7;
        grid-column: 3;
    }

    :global(.car-purchase-deal > .car-purchase-messages) {
        grid-row: 8;
        grid-column: 1 / span 3;
    }
</style>
