import { Models } from '@rematch/core'
import { approvals } from './approval.store'
import { deals } from './deals/deals.store'
import { clock } from './clock.store';

export interface RootModel extends Models<RootModel> {
	clock: typeof clock,
	deals: typeof deals,
	approvals: typeof approvals
}

export const models: RootModel = { clock, deals, approvals }