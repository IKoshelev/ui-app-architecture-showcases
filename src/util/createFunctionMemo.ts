import { createMemo } from "solid-js";


export function createFunctionMemo<
    TProps extends any[], 
    TReturn
>(fnResolver: () => (...props:TProps) => TReturn) {
    const memoFn = createMemo(fnResolver);
    return (...props: TProps) => memoFn()(...props);
}