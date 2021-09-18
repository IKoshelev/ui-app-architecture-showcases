<script lang="ts">
    import { NumericInputState } from "./NumericInput";

    export let inputAttributes: svelte.JSX.HTMLProps<HTMLElement> | undefined;
    export let messageAttributes: svelte.JSX.HTMLProps<HTMLElement> | undefined;
    export let placeholder: string | undefined;
    export let disabled: boolean | undefined;
    export let modelState: number | undefined;
    export let inputState: NumericInputState;
    export let onChange: (newVal: string) => void;
    export let onBlur: () => void;

</script>

<input
    {...inputAttributes ?? {}}
    class={inputAttributes?.class ?? ""}
    class:invalid={!inputState.isValid}
    value={inputState.currentUnsavedValue ?? modelState?.toString() ?? ""}
    {placeholder}
    {disabled}
    on:change={(e) => onChange(e.currentTarget.value)}
    on:blur={(e) => onBlur()}
/>

{#if inputState.message}
    <div {...messageAttributes ?? {}}>
        {inputState.message}
    </div>
{/if}

<style>
</style>
