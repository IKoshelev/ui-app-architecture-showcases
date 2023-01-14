import { PartialDeep } from "type-fest";
import { SubStore } from "./subStore";

export function stubStore<T>(
    state: PartialDeep<T> = {} as any, 
    update?: (update: (draft: T) => void) => void){

    const updateFinal = update ?? ((updateInternal: (draft: T) => void) => {
        updateInternal(state as any);
    });

    return [state, updateFinal] as any as SubStore<T>
}