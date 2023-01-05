import { addReasonToDisable, AtomicValidator, InputState, removeReasonToDisable, resetValueToPristine, revalidateCommittedValue, setCurrentUnsavedValue, tryCommitValue } from "./UserInput.pure";

export function getUserInputVM<TModel, TInput = any, TDisplay = TInput>(
    getState: () => InputState<TModel, TInput>,
    updateState: (update: (stateDraft: InputState<TModel, TInput>) => void) => void,
    parseInput: (val: TInput) => { 
        status: "parsed",
        parsed: TModel 
    } | {
        status: "error",
        message: string,
    },
    modelToDisplayValue: (val: TModel) => TDisplay,
    validators: AtomicValidator<TModel>[]
) {

    const bindFnToState = <TRestArgs extends any[], TReturn>(
        fn: (state: InputState<TModel, TInput>, ...args: TRestArgs) => TReturn
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