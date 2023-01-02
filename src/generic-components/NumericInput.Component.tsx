import { createMemo, For, JSX, Show } from "solid-js";
import { produce, SetStoreFunction } from "solid-js/store";
import { NumericInputState, setCurrentUnsavedValue, tryCommitValue } from "./NumericInput";

export function NumericInputComponent<TStore>(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLInputElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,
    placeholder?: string,

    disabled?: boolean,
    store: TStore,
    setStore: SetStoreFunction<TStore>,
    getInput: (val: TStore) => NumericInputState,
    onChangeAdditional?: (newVal: string) => void,
    onBlurAdditional?: () => void,
}) {

    const inputState = createMemo(() => props.getInput(props.store));

    const validity = createMemo(
        () => {
            const v = inputState().atomicValidators;
            return {
                isValid: !inputState().unsavedValueParsingError 
                    && v.every(x => x.isValid),
                messages: v.map(x => x.message)
            };
        },
        true);

    return <>
        <input
            {...props.inputAttributes}
            classList={{
                ...props.inputAttributes?.classList,
                invalid: !validity().isValid
            }}
            value={
                inputState().currentUnsavedValue
                ?? inputState().value
            }
            placeholder={props.placeholder}
            disabled={props.disabled}
            onChange={(e) => {
                props.setStore(produce(newState => {
                    const input = props.getInput(newState);
                    setCurrentUnsavedValue(input, e.currentTarget.value);
                }));
                props.onChangeAdditional?.(e.currentTarget.value);

            }}
            onBlur={(e) => {
                props.setStore(produce(newState => {
                    const input = props.getInput(newState);
                    tryCommitValue(input);
                }));
                props.onBlurAdditional?.();

            }}
        ></input>
        <Show
            when={ !validity().isValid}
            keyed={true}
        >
            <div {...props.messageAttributes}>
                <Show
                    when={inputState().unsavedValueParsingError}
                    keyed={true}
                >
                    <div>{inputState().unsavedValueParsingError}</div>
                </Show>
                <For each={validity().messages}>{(message, i) =>
                        <div>{message}</div>
                    }
                </For>
            </div>
        </Show>
    </>;
}
