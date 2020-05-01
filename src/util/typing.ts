export type KeyofNonMethods<TType> = ({
    [key in keyof TType]: TType[key] extends Function
    ? never
    : key
})[keyof TType];

export type PartialState<T> = {
    [K in KeyofNonMethods<T>]?: T[K];
}