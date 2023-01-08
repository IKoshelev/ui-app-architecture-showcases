import { expandMagnitudeShortcuts } from "../../util/numeric";
import { SubStore } from "../../util/subStore";
import { Validator, validator, getUserInputState, UserInputState } from "./UserInput.pure";
import { getUserInputVM } from "./UserInput.vm";

// Normally there would be versions for both Number and Number | undefined.
// For demo purposes I keep it short.

export const numberValidatorFns = {

    integer:() => validator(
        "numberValidator.integer",
        (val: number | undefined) => typeof val !== 'number' || Number.isInteger(val),
        (val: number | undefined) =>`Value ${val} must be an integer`),
    
    positive:() => validator(
        "numberValidator.positive",
        (val: number | undefined) => typeof val !== 'number' || val > 0,
        (val: number | undefined) => `Value ${val} must be positive`),
    
    lessThan:(bound: number) => validator(
        "numberValidator.lessThan",
        (val: number | undefined) => typeof val !== 'number' || val < bound,
        (val: number | undefined) => `Value ${val} must be less than ${bound}`),

    between:(loverBound: number, upperBound: number) => validator(
        "numberValidator.between",
        (val: number | undefined) => typeof val !== 'number' || (loverBound < val && val < upperBound),
        (val: number | undefined) => `Value ${val} must be between ${loverBound} and ${upperBound}`),
    
    // many more...
} as const;


export const getNumericInputVM = (
    store: SubStore<UserInputState<number | undefined, string>>,
    validators: Validator<number | undefined>[] = []
) => getUserInputVM(
    store,
    (val) => (val ?? "").toString(),
    (val) => {
        const expanded = expandMagnitudeShortcuts(val);
        const num = Number(expanded);
        if(Number.isNaN(num) 
            || !Number.isFinite(num)) {
                return {
                    status: "error",
                    message: 'Please enter a valid number'
                }
        }
        return {
            status: "parsed",
            parsed: num
        }
    },
    undefined,
    validators);

export type NumericUserInputVM = ReturnType<typeof getNumericInputVM>;
    
