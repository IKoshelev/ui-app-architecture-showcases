import { produce, SetStoreFunction } from "solid-js/store";

export function getSubStoreWProduce<TStore, TSubStore>(
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