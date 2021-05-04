import React from "react";

type SelectDropdownProps<T> =
    {
        selectAttributes?: React.HTMLAttributes<HTMLElement>,    
        getKeyValue?: (item: T) => string,
        getDescription?: (item: T) => string,
        disabled?: boolean,
        availableItems: T[],
    }
    & ({
        hasEmptyOption: false,
        modelState: T,
        onSelect: (item: T) => void
    } | {
        hasEmptyOption: true,
        emptyPlaceholder: string,
        modelState: T | undefined,
        onSelect: (item: T | undefined) => void
    });


export const SelectDropdown = <T extends unknown>(props: SelectDropdownProps<T>) => {

    props = {
        ...props,
        getKeyValue: props.getKeyValue ?? ((x: any) => x.toString()),
        getDescription: props.getDescription ?? ((x: any) => x.toString())
    }

    return <select
        {...props.selectAttributes ?? {}}
        disabled={props.disabled}
        value={props.modelState
            ? props.getKeyValue?.(props.modelState) //for some reason rops.getKeyValue!.(....) does not work with React compiler
            : ''}
        onChange={handleSelect}
    >
        {
            props.hasEmptyOption &&
            <option value={''}>
                {props.emptyPlaceholder}
            </option>
        }

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
        const value = e.target.value

        const selectedItem = props.availableItems
            .find(i => value === props.getKeyValue!(i));

        // sattisfy compiler
        if (props.hasEmptyOption === true) {
            props.onSelect(selectedItem);
        } else {
            if (selectedItem === undefined) {
                throw new Error();
            }
            props.onSelect(selectedItem);
        }


    }
};