import React from "react";
import { NumericInputState } from "./numeric-input";

type NumericInputProps =
    {
        inputAttributes?: React.HTMLAttributes<HTMLElement>,
        messageAttributes?: React.HTMLAttributes<HTMLElement>,
        placeholder?: string | undefined,
        disabled?: boolean,
        modelState: number | undefined,
        inputState: NumericInputState,
        onChange: (newVal: string) => void,
        onBlur: () => void
    };

export const NumericInput = (props: NumericInputProps) => {

        return <>
            <input
                {...(props.inputAttributes ?? {})}
                className={(props.inputAttributes?.className ?? '') + (props.inputState.isValid ? '' : ' invalid')}
                value={props.inputState.currentUnsavedValue ?? props.modelState?.toString() ?? ''}
                placeholder={props.placeholder}
                disabled={props.disabled}
                onChange={(e) => props.onChange(e.target.value)}
                onBlur={(e) => props.onBlur()}
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