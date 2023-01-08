import { createMemo, For, JSX, Show } from "solid-js";
import { createFunctionMemo } from "../util/createFunctionMemo";
import { hasActiveFlows, isValid } from "../util/validation-flows-messages";
import { UserInputVM } from "./input-models/UserInput.vm";

type SelectDropdownProps<TModel, TItem> =
    {
        selectAttributes?: JSX.HTMLAttributes<HTMLSelectElement>,
        messagesContainerAttributes?: JSX.HTMLAttributes<HTMLDivElement>,

        availableItems: TItem[],
        getItemId?: (item: TItem) => string,
        getItemDescription?: (item: TItem) => string,
        onBlurAdditional?: () => void,
        disabled?: boolean,
    }
    & ({
        hasEmptyOption: false,
        vm: UserInputVM<TModel, TItem>,
        getModelId?: (item: TModel) => string,
        onChangeAdditional?: (newVal: TItem) => void,
    } | {
        hasEmptyOption: true,
        vm: UserInputVM<TModel | undefined, TItem>,
        getModelId?: (item: TModel | undefined) => string,
        emptyPlaceholder?: string,
        onChangeAdditional?: (newVal: TItem | undefined) => void,
    });

export function SelectDropdown<TModel, TItem>(
    props: SelectDropdownProps<TModel, TItem>) {

    const inputState = createMemo(() => props.vm.state());
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

        if (props.hasEmptyOption !== true && selectedItem === undefined) {
            throw new Error();
        }

        return selectedItem;
    }

    const selectedId = createMemo(() => {
        const uncommittedValue = inputState().uncommittedValue;

        if (uncommittedValue?.value !== undefined) {
            return getItemId(uncommittedValue.value);
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
            disabled={props.disabled ?? hasActiveFlows(inputState())}
            onChange={(e) => {
                const selectedItem = getSelectItemFromId(e.currentTarget.value);
                props.vm.setCurrentUncommittedValue(selectedItem!);
                props.onChangeAdditional?.(selectedItem!);
                props.vm.tryCommitValue();
            }}
            onBlur={(e) => {
                props.onBlurAdditional?.();
            }}
        >
            <Show when={props.hasEmptyOption}>
                <option 
                    selected={selectedId() === ''}
                    value={''}>
                    {props.hasEmptyOption && props.emptyPlaceholder}
                </option>
            </Show>
            <For each={props.availableItems}>{
                (item, i) => {
                    const id = getItemId(item);
                    const description = getItemDescription(item);
                    return <option 
                        value={id}
                        selected={selectedId() === id}    
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