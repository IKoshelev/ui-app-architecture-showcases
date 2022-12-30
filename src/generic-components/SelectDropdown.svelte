<script lang="ts">
    
    type T = $$Generic;
    export let selectAttributes: svelte.JSX.HTMLProps<HTMLElement> = {};
    export let getKeyValue: (item: T) => string = (x: any) => x.toString();
    export let getDescription: (item: T) => string = (x: any) => x.toString();
    export let disabled: boolean = false;
    export let availableItems: T[];

    export let hasEmptyOption: boolean;
    export let emptyPlaceholder: string = 'empty';
    export let modelState: T | undefined;
    export let onSelect: (item: T | undefined) => void;

    function handleSelect(value: string) {

        const selectedItem = availableItems.find(
            (i) => value === getKeyValue(i)
        );

        if (hasEmptyOption !== true && selectedItem === undefined) {
            throw new Error();
        } 

        onSelect(selectedItem);
    }
</script>

<select
    {...selectAttributes}
    disabled={disabled}
    value={modelState ? getKeyValue(modelState) : ""}
    on:change={(e) => handleSelect(e.currentTarget.value)}
>
    {#if hasEmptyOption}
        <option value={""}>
            {emptyPlaceholder}
        </option>
    {/if}

    {#each availableItems as item (getKeyValue(item))}
        <option value={getKeyValue(item)}>
            {getDescription(item)}
        </option>
    {/each}
</select>

<style>
</style>
