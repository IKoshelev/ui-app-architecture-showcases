import { observer } from "mobx-react";
import React from "react";

type SelectDropdownProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        emptyPlaceholder: string,
        vm: {
            availableItems: T[],
            selectedItem: T | undefined,


            getKeyValue: (item: T) => string,
            getDescription: (item: T) => string,

            handleSelect: (item: T | undefined) => void,
            disabled?: boolean
        }
    };


export const SelectDropdown =
    observer(<T extends unknown>(props: SelectDropdownProps<T>) => {

        const vm = props.vm;

        return <select
            {...props.selectAttributes ?? {}}
            disabled={vm.disabled}
            value={vm.selectedItem
                ? vm.getKeyValue(vm.selectedItem)
                : ''}
            onChange={handleSelect}
        >
            <option value={''}>
                {props.emptyPlaceholder}
            </option>

            {
                vm.availableItems.map(x => {

                    const keyOrValue = vm.getKeyValue(x);
                    const description = vm.getDescription(x);

                    return <option
                        key={keyOrValue}
                        value={keyOrValue}
                    >
                        {description}
                    </option>
                })
            }
        </select>;

        function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
            const value = e.target.value

            const selectedItem = vm.availableItems
                .find(i => value === vm.getKeyValue(i));

            vm.handleSelect(selectedItem);
        }

    });