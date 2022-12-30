import { JSX, Show } from "solid-js";
import { NumericInputState } from "./NumericInput";

export function NumericInputComponent(props: {
    inputAttributes?: JSX.HTMLAttributes<HTMLElement>,
    messageAttributes?: JSX.HTMLAttributes<HTMLElement>,
    inputState: NumericInputState,
    placeholder?: string,
    disabled?: boolean,
    modelState: number,
    onChange: (newVal: string) => void,
    onBlur: () => void,
}){

return <>
    <input
        {...props.inputAttributes}
        classList={{
            invalid: !props.inputState.isValid
        }}
        value={props.inputState.currentUnsavedValue ?? props.modelState?.toString() ?? ""}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        onBlur={(e) => props.onBlur()}
    ></input>
    <Show
        when={props.inputState.message} 
        keyed={true} 
        children={undefined}    
    >
        <div {...props.messageAttributes}>
            {props.inputState.message}
        </div>
    </Show>
</>;
}
