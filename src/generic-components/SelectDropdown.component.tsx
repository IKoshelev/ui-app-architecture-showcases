import { createMemo, For, JSX, Show } from "solid-js";
import { createFunctionMemo } from "../util/createFunctionMemo";
import { isDisabled, isValid } from "./input-models/UserInput.pure";
import { UserInputVM } from "./input-models/UserInput.vm";

type SelectDropdownProps<TModel, TItem> =
    {
        selectAttributes?: JSX.HTMLAttributes<HTMLSelectElement>,
        messageAttributes?: JSX.HTMLAttributes<HTMLDivElement>,  

        availableItems: TItem[],
        getItemId?: (item: TItem) => string,  
        getItemDescription?: (item: TItem) => string,
        onBlurAdditional?: () => void,
    }
    & ({
        hasEmptyOption: false,
        vm: UserInputVM<TModel, TItem, string>,
        getModelId?: (item: TModel) => string,
        onChangeAdditional?: (newVal: TItem) => void,
    } | {
        hasEmptyOption: true,
        vm: UserInputVM<TModel | undefined, TItem, string>,
        getModelId?: (item: TModel | undefined) => string,
        emptyPlaceholder?: string,
        onChangeAdditional?: (newVal: TItem | undefined) => void,
    });

export function SelectDropdown<TModel, TItem>(
    props: SelectDropdownProps<TModel,TItem>) {

    const inputState = createMemo(() => props.vm.getState());
    const _isValid = createMemo(() => isValid(inputState()));

    const getItemId = createFunctionMemo(() => 
        props.getItemId ?? ((x: any) => x?.toString() ?? "")
    );

    const getItemDescription = createFunctionMemo(() => 
        props.getItemDescription ?? ((x: any) => x?.toString() ?? "")
    );

    function getSelectItemFromId(id: string) {

        const selectedItem = props.availableItems.find(
            (i) => id === getItemId(i)
        );

        if (props.hasEmptyOption !== true && selectedItem === undefined) {
            throw new Error();
        } 

        return selectedItem;
    }

    const value = createMemo(() => {
        const uncommittedValue = inputState().uncommittedValue;

        if (uncommittedValue !== undefined)
        {
            return getItemId(uncommittedValue);
        }

        const committedValue = inputState().committedValue;

        return props.getModelId?.(committedValue!) ?? committedValue ?? "";
    });

    return <>
        <select
            {...props.selectAttributes}
            classList={{
                ...props.selectAttributes?.classList,
                invalid: !_isValid(),
                touched: inputState().isTouched,
                pristine: inputState().committedValue === inputState().pristineValue
            }}
            value={value()}
            disabled={isDisabled(inputState())}
            onChange={(e) => {
                const selectedItem = getSelectItemFromId(e.currentTarget.value);

                props.vm.setCurrentUnsavedValue(selectedItem);
                props.onChangeAdditional?.(selectedItem!);

            }}
            onBlur={(e) => {
                props.vm.tryCommitValue();
                props.onBlurAdditional?.();

            }}
        >
            <Show
                when={props.hasEmptyOption}
            >
                <option value={''}>
                    {props.hasEmptyOption && props.emptyPlaceholder}
                </option>
            </Show>
            <For each={props.availableItems}>{
                (item, i) => {
                    const id = getItemId(item);
                    const description = getItemDescription(item);

                    return <option
                        value={id}
                    >
                        {description}
                </option>
                }}
            </For>
        </select>
        <Show
            when={inputState().messages.length > 0}
            keyed={true}
        >
            <div {...props.messageAttributes}>
                <For each={inputState().messages}>{(message, i) =>
                        <div>{message.type}: {message.message}</div>
                    }
                </For>
            </div>
        </Show>
    </>;
}