import { createMemo, For, JSX, Show } from "solid-js";
import { createFunctionMemo } from "../util/createFunctionMemo";
import { isDisabled, isValid } from "./input-models/UserInput.pure";
import { UserInputVM } from "./input-models/UserInput.vm";

type SelectMultipleProps<TModel, TItem> =
    {
        selectAttributes?: JSX.HTMLAttributes<HTMLSelectElement>,
        messagesContainerAttributes?: JSX.HTMLAttributes<HTMLDivElement>,

        availableItems: TItem[],
        getItemId?: (item: TItem) => string,
        getItemDescription?: (item: TItem) => string,
        getModelId?: (item: TModel) => string,
        vm: UserInputVM<TModel[], TItem[], unknown>,
        onChangeAdditional?: (newVal: TItem[]) => void, 
        onBlurAdditional?: () => void,
    };

export function SelectMultiple<TModel, TItem>(
    props: SelectMultipleProps<TModel, TItem>) {

    const inputState = createMemo(() => props.vm.getState());
    const _isValid = createMemo(() => isValid(inputState()));

    const getItemId = createFunctionMemo(() =>
        props.getItemId ?? ((x) => x?.toString() ?? "")
    );

    const getItemDescription = createFunctionMemo(() =>
        props.getItemDescription ?? ((x) => x?.toString() ?? "")
    );

    function getSelectItemFromId(id: string) {

        const selectedItem = props.availableItems.find(
            (i) => id === getItemId(i)
        );

        if (selectedItem === undefined) {
            throw new Error();
        }

        return selectedItem;
    }

    const selectedIds = createMemo(() => {
        const uncommittedValue = inputState().uncommittedValue;

        if (uncommittedValue !== undefined) {
            return uncommittedValue.map(x => getItemId(x));
        }

        const committedValue = inputState().committedValue;

        return committedValue.map(x => 
            props.getModelId?.(x) ?? x?.toString() ?? "" );
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
            disabled={isDisabled(inputState())}
            multiple={true}
            onChange={(e) => {
                const selectedItems =
                    [...e.currentTarget.selectedOptions].map(x =>  getSelectItemFromId(x.value));
                props.vm.setCurrentUnsavedValue(selectedItems);
                props.onChangeAdditional?.(selectedItems);
            }}
            onBlur={(e) => {
                props.vm.tryCommitValue();
                props.onBlurAdditional?.();
            }}
        >
            <For each={props.availableItems}>{
                (item, i) => {
                    const id = getItemId(item);
                    const description = getItemDescription(item);
                    return <option 
                            value={id}
                            selected={selectedIds().includes(id)}
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
            <div {...props.messagesContainerAttributes}>
                <For each={inputState().messages}>{(message, i) =>
                    <div>{message.type}: {message.message}</div>
                }
                </For>
            </div>
        </Show>
    </>;
}