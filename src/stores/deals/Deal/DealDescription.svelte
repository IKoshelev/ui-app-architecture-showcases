<script lang="ts">
    import { diffSeconds } from "../../../util/diffSeconds";

    import { approvalsStore } from "../../approval.store";
    import { clockStore } from "../../clock.store";

    import { dealsStore } from "../deals.store";
    import { computeDealDerrivations, DealProgressState } from "./Deal";

    export let dealId: number;

    $: dealState = computeDealDerrivations(
        $dealsStore,
        $approvalsStore,
        $clockStore,
        dealId
    );
    $: dealStateDescription = getDealStateDescription(
        dealState.dealProgressState,
        $clockStore.currentDate
    );

    function getDealStateDescription(
        state: DealProgressState,
        currentDate: Date
    ) {
        if (state === "deal-finalized") {
            return "Congratulations! Deal is finalized.";
        }
        if (state === "no-approval") {
            return "";
        }
        if (state === "approval-perpetual") {
            return "Approval granted.";
        }
        if (state === "approval-expired") {
            return "Approval expired.";
        }
        return `Approval granted. Expires in ${diffSeconds(
            state.approvalExpiresAt,
            currentDate
        )} seconds.`;
    }
</script>

<div class="car-purchase-deal-state">
    {dealStateDescription}
</div>

<style>
</style>
