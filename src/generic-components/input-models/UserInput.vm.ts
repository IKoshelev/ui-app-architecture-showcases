import { SubStore } from "../../util/subStore";
import { addActiveFlow, removeActiveFlow } from "../../util/validation-flows-messages";
import { Validator, UserInputState, resetValueToPristine, revalidateCommittedValue, setCurrentUncommittedValue, tryCommitValue } from "./UserInput.pure";

export function acceptAllParser<T>(val: T) {
    return {
        status: "parsed" as const,
        parsed: val
    }
};

export function getUserInputVM<TModel, TInput = TModel>(
    store: SubStore<UserInputState<TModel, TInput>>,
    parseInput: (val: TInput) => {
        status: "parsed",
        parsed: TModel
    } | {
        status: "error",
        message: string,
    },
    modelToCustomStringValue: (val: TModel) => string = (m) => m?.toString() ?? "",
    onSuccessfulCommit?: (val: UserInputState<TModel, TInput>) => void,
    validators: Validator<TModel>[] = []
) {
    const [state, setState] = store;

    const bindFnToState = <TRestArgs extends any[], TReturn>(
        fn: (state: UserInputState<TModel, TInput>, ...args: TRestArgs) => TReturn
    ) => (...args: TRestArgs) => {
        let ret: TReturn;
        setState((draft) => { ret = fn(draft, ...args); })
        return ret!;
    };

    return {
        state,
        derivedState: {
            customStringValue: () => modelToCustomStringValue(state.committedValue),
        },
        setCurrentUncommittedValue: bindFnToState(setCurrentUncommittedValue<TModel, TInput>),
        tryCommitValue: bindFnToState((draft) => {
            const success = tryCommitValue<TModel, TInput>(
                draft,
                parseInput,
                validators
            );
            if (success) {
                onSuccessfulCommit?.(draft);
            }
        }),
        revalidateCommittedValue: bindFnToState(draft => revalidateCommittedValue(draft, validators)),
        setTouched: bindFnToState((draft, isTouched: boolean) => draft.isTouched = isTouched),
        resetValueToPristine: bindFnToState(resetValueToPristine),
        addActiveFlow: bindFnToState(addActiveFlow),
        removeActiveFlow: bindFnToState(removeActiveFlow)
    }
}

export type UserInputVM<TModel, TInput = any>
    = ReturnType<typeof getUserInputVM<TModel, TInput>>;