import { createMemo, For, JSX, Show } from "solid-js";
import { isDisabled, isValid } from "./input-models/UserInput.pure";
import { UserInputVM } from "./input-models/UserInput.vm";

export function InputComponent(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLInputElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,
    placeholder?: string,

    vm: UserInputVM<any, string, string>,
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
