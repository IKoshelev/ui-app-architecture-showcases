import { useEffect } from "react";


export function useEffectOnce(fn: () => void) {
    useEffect(() => {
        //notice, we don't return anything for now.
        //if cleanup is needed - probably a separate hooks should be used
        fn();
    }, []);
}