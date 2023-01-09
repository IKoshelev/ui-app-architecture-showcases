import { For, JSX, Show } from "solid-js";
import { hasActiveFlows, isValid } from "../util/validation-flows-messages";
import { UserInputVM } from "./input-models/UserInput.vm";

export function Input<T>(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLInputElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,
    placeholder?: string,

    vm: UserInputVM<T, string>,
    onChangeAdditional?: (newVal: string) => void,
    onBlurAdditional?: () => void,
    disabled?: boolean
}) {

    return <>
        <input
            {...props.inputAttributes}
            classList={{
                ...props.inputAttributes?.classList,
                invalid: !isValid(props.vm.state),
                touched: props.vm.state.isTouched,
                pristine: props.vm.state.committedValue === props.vm.state.pristineValue
            }}
            value={
                props.vm.state.uncommittedValue 
                    ? props.vm.state.uncommittedValue?.value
                    : props.vm.derivedState.customStringValue()
            }
            placeholder={props.placeholder}
            disabled={props.disabled ?? hasActiveFlows(props.vm.state)}
            onChange={(e) => {
                props.vm.setCurrentUncommittedValue(e.currentTarget.value);
                props.onChangeAdditional?.(e.currentTarget.value);

            }}
            onBlur={(e) => {
                props.vm.tryCommitValue();
                props.onBlurAdditional?.();

            }}
        ></input>
        <Show
            when={props.vm.state.messages.length > 0}
            keyed={true}
        >
            <div {...props.messageAttributes}>
                <For each={props.vm.state.messages}>{(message, i) =>
                        <div>{message.type}: {message.message}</div>
                    }
                </For>
            </div>
        </Show>
    </>;
}
