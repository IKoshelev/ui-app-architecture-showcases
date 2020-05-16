import { observer } from "mobx-react";
import React from "react";
import { CurrencySelectorVM } from "./CurrencySelector.VM";
import { SelectDropdown } from "../select-dropdown/SelectDropdown";

type CurrencySelectorProps =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        vm: CurrencySelectorVM
    };

export const CurrencySelector =
    observer((props: CurrencySelectorProps) => {

        const vm = props.vm;

        return <>
            <SelectDropdown
                selectAttributes={props.selectAttributes}
                emptyPlaceholder=''
                vm={{
                    availableItems: vm.availableCurrencies,
                    selectedItem: vm.selectedCurrency,
                    hasEmptyOption: false,
                    getKeyValue: (item) => item,
                    getDescription: (item) => item,

                    handleSelect: (item) => vm.onChange(item),
                    disabled: vm.disabled
                }}
            />
        </>
    });