import { expandMagnitudeShortcuts, isInteger } from "../util/numeric";

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

export function setCurrentUnsavedValue(state: NumericInputState, currentUnsavedValue: string | undefined){
    return {
        ...state,
        currentUnsavedValue,
    }
}

export function tryCommitValue(
    inputState: NumericInputState,
    modelState: number | undefined,
    additionalValidityCheck?: (val: number) => string | undefined): {
        newInputState: NumericInputState,
        newModelState: number | undefined
    } {

    if (!inputState.currentUnsavedValue) {
        return {
            newInputState: { 
                ...inputState,
                currentUnsavedValue: undefined,
                isValid: true,
                message: undefined,
            },
            newModelState: modelState
        };
    }

    let val = inputState.currentUnsavedValue;

    val = expandMagnitudeShortcuts(val.trim());

    const num = Number(val);

    if(Number.isNaN(num) 
        || !Number.isFinite(num)) {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: 'Please enter a valid number'
            },
            newModelState: modelState
        };
    }


    if (inputState.reuirments.integer 
        && !Number.isInteger(num)) {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: 'Please enter a valid integer'
            },
            newModelState: modelState
        };
    }

    if (inputState.reuirments.positive 
        && num < 0) {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: 'Value must be positive'
            },
            newModelState: modelState
        };
    }

    const additionalValitidyCheck = additionalValidityCheck?.(num);
    if(additionalValitidyCheck) {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: additionalValitidyCheck
            },
            newModelState: modelState
        };
    }

    return {
        newInputState: { 
            ...inputState,
            currentUnsavedValue: undefined,
            isValid: true,
            message: undefined,
        },
        newModelState: num
    };
}