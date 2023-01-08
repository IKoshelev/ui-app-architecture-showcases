import { produce, SetStoreFunction } from "solid-js/store";

export type SubStore<TState> = readonly [() => TState, (update: (draft: TState) => void) => void];

export function getSubStoreFromStore<TStore, TSubStore>(
    [store, setStore]: [TStore, SetStoreFunction<TStore>],
    getter: (store: TStore) => TSubStore
  ): SubStore<TSubStore> {
  
    return [
      () => getter(store),
      (update: (draft: TSubStore) => void) => setStore(produce(draft => {
        const substoreDraft = getter(draft);
        update(substoreDraft);
      }))
    ] as const;
  }

  export function getDeeperSubStore<TStore, TSubStore>(
    store: SubStore<TStore>,
    getter: (store: TStore) => TSubStore
  ): SubStore<TSubStore> {

    return [
      () => getter(store[0]()),
      (update: (draft: TSubStore) => void) => store[1](draft => {
        const substoreDraft = getter(draft);
        update(substoreDraft);
      })
    ] as const;
  }
