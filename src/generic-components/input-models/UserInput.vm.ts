import { SubStore } from "../../util/subStore";
import { addActiveFlow, removeActiveFlow } from "../../util/validAndDisabled";
import { Validator, UserInputState, resetValueToPristine, revalidateCommittedValue, setCurrentUnsavedValue, tryCommitValue } from "./UserInput.pure";

export function getUserInputVM<TModel, TInput = any, TDisplay = TInput>(
    store: SubStore<UserInputState<TModel, TInput>>,
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
    const [getState, setState] = store;

    const bindFnToState = <TRestArgs extends any[], TReturn>(
        fn: (state: UserInputState<TModel, TInput>, ...args: TRestArgs) => TReturn
    ) => (...args: TRestArgs) => {
        let ret: TReturn;
        setState((draft) => { ret = fn(draft, ...args); })
        return ret!;
    };

    return {
        state: getState,
        derivedState: {
            displayValue: () => modelToDisplayValue(getState().committedValue),
        },
        setCurrentUnsavedValue: bindFnToState(setCurrentUnsavedValue<TModel, TInput>),
        tryCommitValue: bindFnToState((draft) => tryCommitValue<TModel, TInput>(
            draft,
            parseInput,
            validators
        )),
        revalidateCommittedValue: bindFnToState(draft => revalidateCommittedValue(draft, validators)),
        setTouched: bindFnToState((draft, isTouched: boolean) => draft.isTouched = isTouched),
        resetValueToPristine: bindFnToState(resetValueToPristine),
        addReasonToDisable: bindFnToState(addActiveFlow),
        removeReasonToDisable: bindFnToState(removeActiveFlow) 
    }
}

export type UserInputVM<TModel, TInput = any, TDisplay = TInput>
    = ReturnType<typeof getUserInputVM<TModel, TInput, TDisplay>>;