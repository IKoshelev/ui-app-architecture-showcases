import { expandMagnitudeShortcuts } from "../util/numeric";
import { NumberAtomicValidatorDefinition, NumberAtomicValidatorState, getNumberAtomicValidatorFunctionFromDefinition } from "./AtomicValidators";

export function getBlankNumericInputState(
    ...params: NumberAtomicValidatorDefinition[]
) {
    
    return {
        currentUnsavedValue: undefined as string | undefined,
        value: undefined as number | undefined,
        unsavedValueParsingError: undefined as string | undefined,
        atomicValidators: params.map(x => ({
            definition: x,
            isValid: true,
            message: ""
        })) as NumberAtomicValidatorState[]
    }
}

export type NumericInputState = ReturnType<typeof getBlankNumericInputState>;

export function setCurrentUnsavedValue(
    state: NumericInputState, 
    newUnsavedValue: string | undefined){

    state.currentUnsavedValue = newUnsavedValue;
    state.unsavedValueParsingError = undefined;
}

export function clearValidity(
    state: NumericInputState){

    for (const validator of state.atomicValidators){
        validator.isValid = true;
        validator.message = "";
    }
}

export function validate(
    validators: NumberAtomicValidatorState[],
    potentialNumber: Number){



    for (const validator of validators){
        const message = getNumberAtomicValidatorFunctionFromDefinition(
            validator.definition)(potentialNumber);
        if (message) {
            validator.isValid = false;
            validator.message = message;
        } else {
            validator.isValid = true;
            validator.message = "";
        }
    }
}


export function tryCommitValue(
    inputState: NumericInputState){

    if (inputState.currentUnsavedValue === undefined) {
        inputState.value = undefined;
        return;
    }

    let val = inputState.currentUnsavedValue;

    val = expandMagnitudeShortcuts(val.trim());

    const num = Number(val);

    if(Number.isNaN(num) 
        || !Number.isFinite(num)) {
            clearValidity(inputState);
            inputState.unsavedValueParsingError = 'Please enter a valid number';
            return;
    }

    validate(inputState.atomicValidators, num);
    if (inputState.atomicValidators.some(x => x.isValid === false)){
        return;
    }

    inputState.currentUnsavedValue = undefined;
    inputState.value = num;
}