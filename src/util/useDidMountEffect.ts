import React, { useEffect, useRef } from 'react';

// not used?
export const useDidMountEffect = (callback: () => void, dependencies: unknown[]) => {
    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (didMount.current) callback();
        else didMount.current = true;
    }, dependencies);
}