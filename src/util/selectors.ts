import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
export const createStructuralEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
  )

export function memoizeSelectorCreatorIndeffinitely<
    TCacheKey, 
    TSelector>(selectorCreator: (key: TCacheKey) => TSelector) {

        //in production app, the cache would probably have a limit of 10-100 items
        const cache = new Map<TCacheKey, TSelector>();
        const result = function getCachedSelectorDealDerrivations(key: TCacheKey){
            const cached = cache.get(key);
            if(cached) {
                return cached;
            }
            const selector = selectorCreator(key);
            cache.set(key, selector);
            return selector;
        }

        result.cache = cache;

        return result;
    }