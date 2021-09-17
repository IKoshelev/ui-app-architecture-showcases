import { NarrowPropTypeByKey, PartialDeep } from "ts-typing-util";

export function assert(value: unknown): asserts value {
    if (!value) {
        throw new Error("Assertion failed");
    }
}

//todo move to ts-typing-util
export function assertNarrowPropType<
    T,
    TKey extends keyof T,
    TNarrowedPropType extends T[TKey]>
    (inst: T, key: TKey, guard: (wide: T[TKey]) => wide is TNarrowedPropType): asserts inst is NarrowPropTypeByKey<T, TKey, TNarrowedPropType> {

    const val = inst[key];

    if (guard(val) === false) {
        throw new Error("Assertion failed");
    }
}

export type DiffWithGuard<TDerived> = {
    guard: (val:any) => val is TDerived,
    diff: PartialDeep<TDerived> 
};

export function guard<TDerived>(
    guard: (val: any) => val is TDerived,
    diff: PartialDeep<TDerived>): DiffWithGuard<TDerived>{

        return {
            guard,
            diff
        }
}