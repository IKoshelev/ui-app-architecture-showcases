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