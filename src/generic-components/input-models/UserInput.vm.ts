import { addReasonToDisable, Validator, UserInputState, removeReasonToDisable, resetValueToPristine, revalidateCommittedValue, setCurrentUnsavedValue, tryCommitValue } from "./UserInput.pure";

export function getUserInputVM<TModel, TInput = any, TDisplay = TInput>(
    getState: () => UserInputState<TModel, TInput>,
    updateState: (update: (stateDraft: UserInputState<TModel, TInput>) => void) => void,
    modelToDisplayValue: (val: TModel) => TDisplay,
    parseInput: (val: TInput) => { 
        status: "parsed",
        parsed: TModel 
    } | {
        status: "error",
        message: string,
    },
    
    validators: Validator<TModel>[] = []
) {
    const bindFnToState = <TRestArgs extends any[], TReturn>(
        fn: (state: UserInputState<TModel, TInput>, ...args: TRestArgs) => TReturn
    ) => (...args: TRestArgs) => {
        let ret: TReturn;
        updateState((draft) => { ret = fn(draft, ...args); })
        return ret!;
    };

    return {
        getState: bindFnToState(getState),
        getDisplayValue: () => modelToDisplayValue(getState().committedValue),
        setCurrentUnsavedValue: bindFnToState(setCurrentUnsavedValue<TModel, TInput>),
        tryCommitValue: bindFnToState((draft) => tryCommitValue<TModel, TInput>(
            draft,
            parseInput,
            validators
        )),
        revalidateCommittedValue: bindFnToState(draft => revalidateCommittedValue(draft, validators)),
        setTouched: bindFnToState((draft, isTouched: boolean) => draft.isTouched = isTouched),
        resetValueToPristine: bindFnToState(resetValueToPristine),
        addReasonToDisable: bindFnToState(addReasonToDisable),
        removeReasonToDisable: bindFnToState(removeReasonToDisable) 
    }
}

export type UserInputVM<TModel, TInput = any, TDisplay = TInput>
    = ReturnType<typeof getUserInputVM<TModel, TInput, TDisplay>>;