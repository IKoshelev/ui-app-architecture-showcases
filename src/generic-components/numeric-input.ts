

export function getBlankNumericInputState() {
    return {
        currentUnsavedValue: undefined as string | undefined,
        message: undefined as string | undefined,
        isValid: true as boolean | undefined,
        disabled: false as boolean | undefined
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

    if (inputState.currentUnsavedValue === undefined) {
        return {
            newInputState: { 
                ...getBlankNumericInputState(),
                disabled: inputState.disabled
            },
            newModelState: undefined
        };
    }

    let val = inputState.currentUnsavedValue;

    val = val.trim()
        .replace('k', '000')
        .replace('K', '000')
        .replace('m', '000000')
        .replace('M', '000000');

    if (val[0] === '-') {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: 'Value must be 0 or positive'
            },
            newModelState: modelState
        };
    }

    const isInteger = /^\d+$/.test(val) === true;
    if (!isInteger) {
        return {
            newInputState: {
                ...inputState,
                isValid: false,
                message: 'Please enter a valid integer'
            },
            newModelState: modelState
        };
    }

    const int = Number(val);

    const additionalValitidyCheck = additionalValidityCheck?.(int);
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
        newInputState: getBlankNumericInputState(),
        newModelState: int
    };
}