import React from "react";

type SelectDropdownProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        emptyPlaceholder: string,
        availableItems: T[],
        selectedItem: T | undefined,
        getKeyValue: (item: T) => string,
        getDescription: (item: T) => string,
        handleSelect: (item: T) => void,
        disabled?: boolean
    };

export const SelectDropdown = <T extends unknown>(props: SelectDropdownProps<T>) => {

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