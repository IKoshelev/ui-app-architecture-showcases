import { get, Updater, Writable } from "svelte/store";

// import { produce } from "immer";
// window.process = { env: { NODE_ENV: 'production' } } as any;

export const makeApplyDiff = <T>(update: (this: void, updater: Updater<T>) => void) =>
    (diff: Partial<T>) => update((state: T) => {
        return Object.assign(state, diff) as T;
    });


type UpdaterVoid<TState extends object, TArgs extends any[]> = (state: TState, ...args: TArgs) => void;

type BoundUpdaterVoid<TUpdaterVoid> = TUpdaterVoid extends UpdaterVoid<any, infer TArgs>
    ? (...args: TArgs) => void
    : never;

type BoundUpdaters<TUpdatersVoidMap> = {
    [K in keyof TUpdatersVoidMap]: BoundUpdaterVoid<TUpdatersVoidMap[K]>
}

export function bindToStore<
    TStoreState,
    TUpdaters extends {
        [key: string]: UpdaterVoid<any, any>,
    }>(
        store: Writable<TStoreState>,
        updatersMap: TUpdaters
    ): BoundUpdaters<TUpdaters> {

    return Object.entries(updatersMap).reduce((prev, [key, updater]) => {
        prev[key] = (...args: any) => {
            const state = get(store);
            updater(state, ...args);
            store.set(state);
        };
        return prev;
    }, {}) as any as BoundUpdaters<TUpdaters>;

}