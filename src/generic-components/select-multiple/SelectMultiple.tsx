import React from "react";

type SelectMultipleProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,
        availableItems: T[],
        selectedItems: T[],
        getKeyValue: (item: T) => string,
        getDescription: (item: T) => string,
        handleSelect: (items: T[]) => void,
        disabled?: boolean
    };

export const SelectMultiple = <T extends unknown>(props: SelectMultipleProps<T>) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const options = e.target.options;
        const values: string[] = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }

        const selectedItems = props.availableItems
            .filter(i => values.some(v => v === props.getKeyValue(i)));

        props.handleSelect(selectedItems);
    }

    return (
        <select
            {...props.selectAttributes ?? {}}
            multiple={true}
            disabled={props.disabled}
            value={props.selectedItems.map(x => props.getKeyValue(x))}
            onChange={handleChange}
        >
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