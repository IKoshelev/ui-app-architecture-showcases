import React from "react";
import { ReadonlyDeep } from "../../util/state-helpers";

type SelectDropdownProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        emptyPlaceholder: string,
        availableItems: ReadonlyDeep<T[]>,
        selectedItem: ReadonlyDeep<T> | undefined,
        getKeyValue: (item: ReadonlyDeep<T>) => string,
        getDescription: (item: ReadonlyDeep<T>) => string,
        handleSelect: (item: ReadonlyDeep<T>) => void,
        disabled?: boolean
    };

export const SelectDropdown2 = <T extends unknown>(props: SelectDropdownProps<T>) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value

        const selectedItem = props.availableItems
            .find(i => value === props.getKeyValue(i));

        if (selectedItem) {
            props.handleSelect(selectedItem);
        }
    }

    return (
        <select
            {...props.selectAttributes ?? {}}
            disabled={props.disabled}
            value={props.selectedItem
                ? props.getKeyValue(props.selectedItem)
                : ''}
            onChange={handleChange}
        >
            <option value={''}>
                {props.emptyPlaceholder}
            </option>

            {
                props.availableItems.map(x => {

                    const keyOrValue = props.getKeyValue(x);
                    const description = props.getDescription(x);

                    return <option
                        key={keyOrValue}
                        value={keyOrValue}
                    >
                        {description}
                    </option>
                })
            }
        </select>
    )
};