import { Models } from '@rematch/core'
// import { players } from './players'
// import { settings } from './settings'
import { deals } from './deals.store'
import { clock } from './clock.store';

export interface RootModel extends Models<RootModel> {
	clock: typeof clock
	deals: typeof deals
	// settings: typeof settings
}

export const models: RootModel = { clock, deals }
