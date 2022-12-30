<script lang="ts">
    type T = $$Generic;

    export let selectAttributes: svelte.JSX.HTMLProps<HTMLElement> = {};
    export let getKeyValue: (item: T) => string = (x: any) => x.toString();
    export let getDescription: (item: T) => string = (x: any) => x.toString();
    export let disabled: boolean = false;
    export let availableItems: T[];
    export let modelState: T[];
    export let onSelect: (items: T[]) => void;

    function handleSelect(options: HTMLOptionsCollection) {
        const values: string[] = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                values.push(options[i].value);
            }
        }

        const selectedItems = availableItems.filter((i) =>
            values.some((v) => v === getKeyValue!(i))
        );

        onSelect(selectedItems);
    }
</script>

<select
    {...selectAttributes}
    multiple={true}
    {disabled}
    value={modelState.map((x) => getKeyValue(x))}
    on:change={(e) => handleSelect(e.currentTarget.options)}
>
    {#each availableItems as item (getKeyValue(item))}
        <option value={getKeyValue(item)}>
            {getDescription(item)}
        </option>
    {/each}
</select>

<style>
</style>
