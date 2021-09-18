import React from "react";

type SelectMultipleProps<T> =
{
    selectAttributes?: React.HTMLAttributes<HTMLElement>,    
    getKeyValue?: (item: T) => string,
    getDescription?: (item: T) => string,
    disabled: boolean,
    availableItems: T[],
    modelState: T[],
    onSelect: (items: T[]) => void
};

export const SelectMultiple = <T extends unknown>(props: SelectMultipleProps<T>) => {

    props = {
        ...props,
        getKeyValue: props.getKeyValue ?? ((x: any) => x.toString()),
        getDescription: props.getDescription ?? ((x: any) => x.toString())
    }

        return <select
            {...props.selectAttributes ?? {}}
            multiple={true}
            disabled={props.disabled}
            value={props.modelState.map(x => props.getKeyValue!(x))}
            onChange={handleSelect}
        >
            {
                props.availableItems.map(x => {

                    const keyOrValue = props.getKeyValue!(x);
                    const description = props.getDescription!(x);

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

            const selectedItems = props.availableItems
                .filter(i => values.some(v => v === props.getKeyValue!(i)));

            props.onSelect(selectedItems);
        }
    }