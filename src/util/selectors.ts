import { createSelectorCreator, defaultMemoize } from "reselect";
import isEqual from 'lodash.isequal';

// create a "selector creator" that uses lodash.isequal instead of ===
export const createStructuralEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
  )