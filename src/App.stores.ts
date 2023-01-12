import { createStore } from "solid-js/store";
import { getDefaultClockStoreRoot } from "./app/clock.store";
import { getDefaultDealsStoreRoot } from "./app/deals.store";
import { getDefaultApprovalsStoreRoot } from "./app/approval.store";
import { getSubStoreFromStore } from "./util/subStore";

export const clockStore = getSubStoreFromStore(createStore(getDefaultClockStoreRoot()), x => x);
export const dealsStore = getSubStoreFromStore(createStore(getDefaultDealsStoreRoot()), x => x);
export const approvalsStore = getSubStoreFromStore(createStore(getDefaultApprovalsStoreRoot()), x => x);