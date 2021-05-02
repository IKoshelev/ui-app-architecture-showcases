import { Models } from '@rematch/core'
// import { players } from './players'
// import { settings } from './settings'
// import { cart } from './cart'
import { clock } from './clock';

export interface RootModel extends Models<RootModel> {
	clock: typeof clock
	// cart: typeof cart
	// settings: typeof settings
}

export const models: RootModel = { clock, }
