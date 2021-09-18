<script lang="ts" context="module">
    export type SelectDropdownProps<T> = {
        selectAttributes?: svelte.JSX.HTMLProps<HTMLElement>;
        getKeyValue?: (item: T) => string;
        getDescription?: (item: T) => string;
        disabled?: boolean;
        availableItems: T[];
    } & (
        | {
              hasEmptyOption: false;
              modelState: T;
              onSelect: (item: T) => void;
          }
        | {
              hasEmptyOption: true;
              emptyPlaceholder: string;
              modelState: T | undefined;
              onSelect: (item: T | undefined) => void;
          }
    );
</script>

<script lang="ts">
    type T = $$Generic;
    export let p: SelectDropdownProps<T>;

    $: getKeyValue = p.getKeyValue ?? ((x: any) => x.toString());
    $: getDescription = p.getDescription ?? ((x: any) => x.toString());

    function handleSelect(value: string) {

        const selectedItem = p.availableItems.find(
            (i) => value === getKeyValue(i)
        );

        // sattisfy compiler
        if (p.hasEmptyOption === true) {
            p.onSelect(selectedItem);
        } else {
            if (selectedItem === undefined) {
                throw new Error();
            }
            p.onSelect(selectedItem);
        }
    }
</script>

<select
    {...p.selectAttributes ?? {}}
    disabled={p.disabled}
    value={p.modelState ? getKeyValue(p.modelState) : ""}
    on:change={(e) => handleSelect(e.currentTarget.value)}
>
    {#if p.hasEmptyOption}
        <option value={""}>
            {p.emptyPlaceholder}
        </option>
    {/if}

    {#each p.availableItems as item (getKeyValue(item))}
        <option value={getKeyValue(item)}>
            {getDescription(item)}
        </option>
    {/each}
</select>;

<style>
</style>
