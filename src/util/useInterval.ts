import { useEffect, useRef } from 'react';

/* istanbul ignore next */
/** keep typescript happy */
const noop = () => { };

export function useInterval(
  callback: () => void,
  delay: number | null | false,
  immediate?: boolean,
  clear?: () => boolean
) {
  const savedCallback = useRef(noop);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Execute callback if immediate is set.
  useEffect(() => {
    // very bad. We must always use curly bracket with if, while, for, etc...
    // i.e. never pass a bare line where block of code can be passed.
    // This is a hard learned lesson in all programming languages
    // Also, whole file is very hard to understand
    if (!immediate) return;
    if (delay === null || delay === false) return;
    savedCallback.current();
  }, [immediate]);

  // Set up the interval.
  useEffect(() => {
    if (delay === null || delay === false) return undefined;
    const tick = () => savedCallback.current();
    const id: NodeJS.Timeout = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;