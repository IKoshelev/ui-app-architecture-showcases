import { observer } from "mobx-react";
import React from "react";
import { ReadonlyDeep } from "../../util/state-helpers";

type SelectDropdownProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        emptyPlaceholder: string,
        vm: {
            availableItems: ReadonlyDeep<T[]>,
            selectedItem: ReadonlyDeep<T> | undefined,

            getKeyValue: (item: ReadonlyDeep<T>) => string,
            getDescription: (item: ReadonlyDeep<T>) => string,

            handleSelect: (item: ReadonlyDeep<T> | undefined) => void,
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