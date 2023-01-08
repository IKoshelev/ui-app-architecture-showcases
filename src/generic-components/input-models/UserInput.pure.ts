import { iterateDeep, transform } from "../../util/walkers";
import { ExpandDeep } from 'ts-mapping-types';
import cloneDeep from "lodash.clonedeep";
import { unwrap } from "solid-js/store";
import { DisplayMessage, spliceMessage } from "../../util/validAndDisabled";

export const inputStateMarker = "solidjsdemo:UserInputState:";

export type InputStateMarker = `${typeof inputStateMarker}${string}`;

export function getUserInputState<TModel, TInput = any>(
    initialValue: TModel
) {
    return {
        __type: inputStateMarker as InputStateMarker,
        uncommittedValue: undefined as TInput | undefined,
        committedValue: initialValue,
        pristineValue: initialValue,
        isTouched: false,
        reasonsToDisable: {} as Record<string, true>,
        messages: [] as DisplayMessage[]
    }
}

export type UserInputState<TModel, TInput = any> = ReturnType<typeof getUserInputState<TModel, TInput>>;

export function isUserInputState(target: any): target is UserInputState<unknown, unknown> {
    return typeof target === "object" 
        && typeof target.__type === "string" 
        && target.__type.startsWith(inputStateMarker);
}


export const PARSING_ERROR = "PARSING_ERROR";

export type Validator<TModel> = (val: TModel) => {
    status: "invalid",
    message: DisplayMessage
} | {
    status: "valid",
    code: string
}

export const validator = <TModel>(
    code: string,
    validWhen: (val: TModel) => boolean,
    messageFn: (val: TModel) => string): Validator<TModel> =>
    (val: TModel) => {
        if (!validWhen(val)) {
            return {
                status: "invalid",
                message: {
                    type: "error",
                    code,
                    message: messageFn(val)
                }
            };
        }

        return {
            status: "valid",
            code
        }
    }

export function setCurrentUnsavedValue<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>,
    newUnsavedValue: TInput | undefined,
    setTouched = true) {
    state.uncommittedValue = newUnsavedValue;
    spliceMessage(state.messages, PARSING_ERROR);
    if (setTouched){
        state.isTouched = true;
    }
}

export function isPristine<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>
){
    return state.committedValue === state.pristineValue;
}

export function clearMessages<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>) {
    state.messages = [];
}

export function revalidateCommittedValue<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>,
    validators: Validator<TModel>[]) {

    for (const validator of validators) {
        const result = validator(state.committedValue);
        if (result.status === "valid") {
            spliceMessage(state.messages, result.code);
            continue;
        }
        spliceMessage(state.messages, result.message.code, result.message);
    }
}

export function resetValueToPristine<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>,
    resetIsTouched = true,
    clearMessages = true
) {
    state.uncommittedValue = undefined;
    state.committedValue = state.pristineValue;
    if (resetIsTouched) {
        state.isTouched = false;
    }
    if (clearMessages) {
        state.messages = [];
    }
}

export function tryCommitValue<TModel, TInput = any>(
    state: UserInputState<TModel, TInput>,
    parseInput: (val: TInput) => {
        status: "parsed",
        parsed: TModel
    } | {
        status: "error",
        message: string,
    },
    validators: Validator<TModel>[]) {

    if (state.uncommittedValue === undefined) {
        return false;
    }

    let parseResult = parseInput(state.uncommittedValue);

    if (parseResult.status === "error") {
        spliceMessage(state.messages, PARSING_ERROR, {
            code: PARSING_ERROR,
            type: "error",
            message: parseResult.message
        });
        return;
    }

    spliceMessage(state.messages, PARSING_ERROR);

    state.committedValue = parseResult.parsed;
    state.uncommittedValue = undefined;
    revalidateCommittedValue(state, validators);
}

export function everyUserInputStateIn(
    target: object, 
    check: (val: UserInputState<unknown, unknown>) => boolean) {
    for (const [_, value] of iterateDeep(target)) {
        if (isUserInputState(value)) {
            const res = check(value);
            if(!res) {
                return false;
            }
        }
    }
    return true;
}

export function anyUserInputStateIn(
    target: object, 
    check: (val: UserInputState<unknown, unknown>) => boolean) {
    for (const [_, value] of iterateDeep(target)) {
        if (isUserInputState(value)) {
            const res = check(value);
            if(res) {
                return true;
            }
        }
    }
    return false;
}

type InputStateValue<T> = Pick<UserInputState<T>, '__type' | 'committedValue'>;

type TryPluckCommittedValue<T> = T extends InputStateValue<infer U> ? U : T;

type TryPluckFromTuple<T> = T extends [infer U, ...infer URest] 
    ?  [TryPluckCommittedValue<U>, ...TryPluckFromTuple<URest>]
    : TryPluckCommittedValue<T>;

export type InputStateContainerToPojo<T> = 
    T extends [infer U, ...infer URest] ? TryPluckFromTuple<T> :
    T extends (infer U)[] ? InputStateContainerToPojo<U>[] :
    T extends InputStateValue<infer U> ? U :
    T extends {} ? {
        [K in keyof T]: InputStateContainerToPojo<T[K]>
    } :
    T;

export function clonePojoWithCommittedValues<T extends object>
    (objectContainingInputStates: T): ExpandDeep<InputStateContainerToPojo<T>> {

    const clone = cloneDeep(unwrap(objectContainingInputStates));

    for (const sym of Object.getOwnPropertySymbols(clone)) {
        delete (clone as any)[sym];
    }

    transform(clone, (key, parent, pathToParent) => {

        const val = parent[key];
        if (isUserInputState(val)) {
            parent[key] = val.committedValue;
            return false;
        }

        return true;
    })

    return clone as any;
}