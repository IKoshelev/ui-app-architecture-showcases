import { observer } from "mobx-react";
import React from "react";
import { ReadonlyDeep } from "../../util/state-helpers";

type SelectMultipleProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        vm: {
            availableItems: ReadonlyDeep<T[]>,
            selectedItems: ReadonlyDeep<T[]>,

            getKeyValue: (item: ReadonlyDeep<T>) => string,
            getDescription: (item: ReadonlyDeep<T>) => string,

            handleSelect: (items: ReadonlyDeep<T>[]) => void,
            disabled?: boolean
        }
    };

export const SelectMultiple =
    observer(<T extends unknown>(props: SelectMultipleProps<T>) => {

        const vm = props.vm;

        return <select
            {...props.selectAttributes ?? {}}
            multiple={true}
            disabled={vm.disabled}
            value={vm.selectedItems.map(x => vm.getKeyValue(x))}
            onChange={handleSelect}
        >
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
            const options = e.target.options;
            const values: string[] = [];
            for (var i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }

            const selectedItems = vm.availableItems
                .filter(i => values.some(v => v === vm.getKeyValue(i)));

            vm.handleSelect(selectedItems);
        }
    });