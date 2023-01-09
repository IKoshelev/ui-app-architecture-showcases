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
        const uncommittedValue = props.vm.state.uncommittedValue;

        if (uncommittedValue?.value !== undefined) {
            return getItemId(uncommittedValue.value);
        }

        const committedValue = props.vm.state.committedValue;

        return props.getModelId?.(committedValue!) ?? committedValue ?? "";
    });

    return <>
        <select
            {...props.selectAttributes}
            classList={{
                ...props.selectAttributes?.classList,
                invalid: !isValid(props.vm.state),
                touched: props.vm.state.isTouched,
                pristine: props.vm.state.committedValue === props.vm.state.pristineValue
            }}
            disabled={props.disabled ?? hasActiveFlows(props.vm.state)}
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
            when={props.vm.state.messages.length > 0}
            keyed={true}
        >
            <div {...props.messagesContainerAttributes}>
                <For each={props.vm.state.messages}>{(message, i) =>
                    <div>{message.type}: {message.message}</div>
                }
                </For>
            </div>
        </Show>
    </>;
}