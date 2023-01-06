import { produce, SetStoreFunction } from "solid-js/store";

export function getSubStoreFromStore<TStore, TSubStore>(
    store: TStore,
    setStore: SetStoreFunction<TStore>,
    getter: (store: TStore) => TSubStore
  ) {
  
    return [
      () => getter(store),
      (update: (draft: TSubStore) => void) => setStore(produce(draft => {
        const substoreDraft = getter(draft);
        update(substoreDraft);
      }))
    ] as const;
  }

  export function getDeeperSubStore<TStore, TSubStore>(
    getState: () => TStore,
    setState: (update: (draft: TStore) => void) => void,
    getter: (store: TStore) => TSubStore
  ) {
  
    return [
      () => getter(getState()),
      (update: (draft: TSubStore) => void) => setState(draft => {
        const substoreDraft = getter(draft);
        update(substoreDraft);
      })
    ] as const;
  }