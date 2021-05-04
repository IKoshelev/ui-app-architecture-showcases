import React from "react";
import { NumericInputState, setCurrentUnsavedValue, tryCommitValue } from "./numeric-input";

type NumericInputProps =
    {
        inputAttributes?: React.HTMLAttributes<HTMLElement>,
        messageAttributes?: React.HTMLAttributes<HTMLElement>,
        placeholder?: string | undefined,
        disabled?: boolean,
        modelState: number | undefined,
        inputState: NumericInputState,
        onChange: (newModelState: number | undefined, newInputState: NumericInputState) => void,
    };

export const NumericInput = (props: NumericInputProps) => {

        return <>
            <input
                {...(props.inputAttributes ?? {})}
                className={(props.inputAttributes?.className ?? '') + (props.inputState.isValid ? '' : ' invalid')}
                value={props.inputState.currentUnsavedValue ?? props.modelState?.toString() ?? ''}
                placeholder={props.placeholder}
                disabled={props.disabled}
                onChange={(e) => {
                    const newInputState = setCurrentUnsavedValue(props.inputState, e.target.value);
                    props.onChange(props.modelState, newInputState);

                }}
                onBlur={(e) => {
                    const res = tryCommitValue(props.inputState, props.modelState);
                    props.onChange(res.newModelState, res.newInputState);
                }}
            />

            {
                props.inputState.message &&
                <div
                    {...(props.messageAttributes ?? {})}>
                    {props.inputState.message}
                </div>
            }
        </>
    };