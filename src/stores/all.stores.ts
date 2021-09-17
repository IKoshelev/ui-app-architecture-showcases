//import { approvals } from './approval.store'
//import { deals } from './deals/deals.store'
import { clockStore } from './clock.store';

export const allStores = { 
	clockStore, 
	//deals, 
	//approvals 
}

export type AllStores = typeof allStores;