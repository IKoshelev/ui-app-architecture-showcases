import { createMemo, For, JSX, Show } from "solid-js";
import { produce, SetStoreFunction } from "solid-js/store";
import { NumericInputVM } from "./NumericInput.vm";
import { isDisabled, isValid } from "./UserInput.pure";

export function NumericInputComponent(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLInputElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,
    placeholder?: string,

    vm: NumericInputVM,
    onChangeAdditional?: (newVal: string) => void,
    onBlurAdditional?: () => void,
}) {

    const inputState = createMemo(() => props.vm.getState());
    const _isValid = createMemo(() => isValid(inputState()));

    return <>
        <input
            {...props.inputAttributes}
            classList={{
                ...props.inputAttributes?.classList,
                invalid: !_isValid()
            }}
            value={
                inputState().uncommittedValue
                ?? props.vm.getDisplayValue()
            }
            placeholder={props.placeholder}
            disabled={isDisabled(inputState())}
            onChange={(e) => {
                props.vm.setCurrentUnsavedValue(e.currentTarget.value);
                props.onChangeAdditional?.(e.currentTarget.value);

            }}
            onBlur={(e) => {
                props.vm.tryCommitValue();
                props.onBlurAdditional?.();

            }}
        ></input>
        <Show
            when={inputState().messages.length > 0}
            keyed={true}
        >
            <div {...props.messageAttributes}>
                <For each={inputState().messages}>{(message, i) =>
                        <div>{message.type}: {message.message}</div>
                    }
                </For>
            </div>
        </Show>
    </>;
}
