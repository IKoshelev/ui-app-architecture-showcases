import { observer } from "mobx-react";
import React from "react";
import { NumericInputVM } from "./NumericInputVM";

type NumericInputProps =
    {
        inputAttributes?: React.HTMLAttributes<HTMLElement>,
        messageAttributes?: React.HTMLAttributes<HTMLElement>,
        placeholder?: string | undefined,
        isValid?: boolean,
        displayedValue?: string,
        isDisabled?: boolean,
        handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
        handleBlur?: (event: React.FocusEvent<HTMLInputElement>) => void,
        message?: string
    };

export const NumericInput2: React.FC<NumericInputProps> = (props: NumericInputProps) => (
    <>
        <input
            {...props.inputAttributes ?? {}}
            className={(props.inputAttributes?.className ?? '') + (props.isValid ? '' : ' invalid')}
            value={props.displayedValue}
            placeholder={props.placeholder}
            disabled={props.isDisabled}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
        />

        {
            props.message &&
            <div
                {...props.messageAttributes ?? {}}>
                {props.message}
            </div>
        }
    </>
)