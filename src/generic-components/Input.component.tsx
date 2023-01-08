import { createMemo, For, JSX, Show } from "solid-js";
import { hasActiveFlows, isValid } from "../util/validAndDisabled";
import { UserInputVM } from "./input-models/UserInput.vm";

export function Input(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLInputElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,
    placeholder?: string,

    vm: UserInputVM<any, string, string>,
    onChangeAdditional?: (newVal: string) => void,
    onBlurAdditional?: () => void,
    disabled?: boolean
}) {

    const inputState = createMemo(() => props.vm.state());
    const _isValid = createMemo(() => isValid(inputState()));

    return <>
        <input
            {...props.inputAttributes}
            classList={{
                ...props.inputAttributes?.classList,
                invalid: !_isValid(),
                touched: inputState().isTouched,
                pristine: inputState().committedValue === inputState().pristineValue
            }}
            value={
                inputState().uncommittedValue
                ?? props.vm.derivedState.displayValue()
            }
            placeholder={props.placeholder}
            disabled={props.disabled ?? hasActiveFlows(inputState())}
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
