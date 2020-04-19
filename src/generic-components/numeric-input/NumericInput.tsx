import { observer } from "mobx-react";
import React from "react";
import { NumericInputVM } from "./NumericInputVM";

type NumericInputProps =
    React.HTMLAttributes<HTMLElement> & {
        placeholder?: string | undefined,
        messagesClassName?: string,
        vm: NumericInputVM
    };

export const NumericInput =
    observer((props: NumericInputProps) => {

        const vm = props.vm;
        const propsWithoutVm = {
            ...props,
            className: (props.className ?? '') + (vm.isValid ? '' : ' invalid'),
            vm: undefined
        }

        return <>
            <input
                {...propsWithoutVm}
                value={vm.displayedValue}
                placeholder={props.placeholder}
                disabled={vm.disabled}
                onChange={(e) => vm.onChange(e.target.value)}
                onBlur={(e) => vm.onBlur(e.target.value)}
            />

            {
                vm.message &&
                <div
                    className={props.messagesClassName}>
                    {vm.message}
                </div>
            }
        </>
    });