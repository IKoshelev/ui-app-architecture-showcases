import { observer } from "mobx-react";
import React from "react";
import { NumericInputVM } from "./NumericInputVM";

type NumericInputProps =
    {
        inputAttributes?: React.HTMLAttributes<HTMLElement>,
        messageAttributes?: React.HTMLAttributes<HTMLElement>,
        placeholder?: string | undefined,
        vm: NumericInputVM
    };

export const NumericInput =
    observer((props: NumericInputProps) => {

        const vm = props.vm;

        return <>
            <input
                {...props.inputAttributes ?? {}}
                className={(props.inputAttributes?.className ?? '') + (vm.isValid ? '' : ' invalid')}
                value={vm.displayedValue}
                placeholder={props.placeholder}
                disabled={vm.disabled}
                onChange={(e) => vm.onChange(e.target.value)}
                onBlur={(e) => vm.onBlur(e.target.value)}
            />

            {
                vm.message &&
                <div
                    {...props.messageAttributes ?? {}}>
                    {vm.message}
                </div>
            }
        </>
    });