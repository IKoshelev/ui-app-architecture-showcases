import { expandMagnitudeShortcuts } from "../util/numeric";

export function getBlankNumericInputState(requirments?:  {
    integer: boolean,
    positive: boolean
}) {
    return {
        currentUnsavedValue: undefined as string | undefined,
        message: undefined as string | undefined,
        isValid: true as boolean | undefined,
        reuirments: requirments ?? {
            integer: false,
            positive: false
        }
    }
}

export type NumericInputState = ReturnType<typeof getBlankNumericInputState>;

export function setCurrentUnsavedValue(
    state: NumericInputState, 
    currentUnsavedValue: string | undefined, 
    clearValidity = false){

    state.currentUnsavedValue = currentUnsavedValue;

    if(clearValidity) {
        state.message = undefined;
        state.isValid = true;
    }
}

export function tryCommitValue(
    inputState: NumericInputState,
    setModelState: (val: number) => void,
    additionalValidityCheck?: (val: number) => string | undefined){

    if (!inputState.currentUnsavedValue) {
        inputState.currentUnsavedValue = undefined;
        inputState.isValid = true;
        inputState.message = undefined;
        return;
    }

    let val = inputState.currentUnsavedValue;

    val = expandMagnitudeShortcuts(val.trim());

    const num = Number(val);

    if(Number.isNaN(num) 
        || !Number.isFinite(num)) {

            inputState.isValid = false;
            inputState.message = 'Please enter a valid number';
            return;
    }


    if (inputState.reuirments.integer 
        && !Number.isInteger(num)) {

            inputState.isValid = false;
            inputState.message = 'Please enter a valid integer';
            return;
    }

    if (inputState.reuirments.positive 
        && num < 0) {

            inputState.isValid = false;
            inputState.message = 'Value must be positive';
            return;
    }

    const additionalValidityCheckRes = additionalValidityCheck?.(num);
    if(additionalValidityCheck) {
        inputState.isValid = false;
        inputState.message = additionalValidityCheckRes;
        return;
    }

    inputState.currentUnsavedValue = undefined;
    inputState.isValid = true;
    inputState.message = undefined;

    setModelState(num);
}