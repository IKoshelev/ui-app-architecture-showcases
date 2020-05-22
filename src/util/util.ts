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

export class Lazy<T> {

    constructor(initialize: () => T) {
        this._initialize = initialize;
    }

    private _instance: T | undefined;
    private readonly _initialize: () => T;

    public get val() {
        this._instance = this._instance ?? this._initialize();
        return this._instance;
    }

}