import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, RootModel } from './models'

export const store = init<RootModel, RootModel>({
	models,
	plugins: [
		immerPlugin({
			whitelist: ['settings'],
		}),
		selectPlugin(),
	],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, RootModel>
