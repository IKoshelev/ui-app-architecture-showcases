export function setsMatch<T>(arr1: T[], arr2: T[]) {
    const unionSize = new Set([...arr1, ...arr2]).size;
    return unionSize === arr1.length && unionSize === arr2.length;
}

export const getSorterByLatest = <T>(getProp: (item: T) => Date) => (a: T, b: T) => {
    const dateA = getProp(a);
    const dateB = getProp(b);
    return dateB.valueOf() - dateA.valueOf();
}

export type PromiseValueType<T> = T extends Promise<infer TValuteType> ? TValuteType : never;

export type Expand<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

export type DeepPartial<T> = Expand<{
    [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}>;