import { approvalsStore } from './approval.store'
import { dealsStore } from './deals/deals.store'
import { clockStore } from './clock.store';

export const allStores = { 
	clockStore, 
	dealsStore, 
	approvalsStore 
}

export type AllStores = typeof allStores;