import { SubStore } from "./subStore";

export type DisplayMessage = {
    code: string,
    type: "error" | "warning",
    message: string,
}

export function isValid(
    state: { messages: DisplayMessage[] }) {
    return state.messages.some(x => x.type === "error");
}

export function isDisabled(
    state: { reasonsToDisable: Record<string, true> }) {
    return Object.keys(state.reasonsToDisable).length > 0;
}

export function isLoading(
    state: { reasonsToDisable: Record<`loading:${string}`, true> }) {
    return Object.keys(state.reasonsToDisable).filter(k => k.startsWith('loading:')).length > 0;
}

export function spliceMessage(
    messages: DisplayMessage[],
    code: string,
    newMessage?: DisplayMessage) {

    const previousParsingErrorIndex = messages.findIndex(x => x.code === code);

    if (previousParsingErrorIndex === -1) {
        if (newMessage) {
            messages.push(newMessage);
            return 'added new message';
        }
        return 'no changes';
    }

    if (newMessage) {
        messages[previousParsingErrorIndex].message = newMessage.message;
        return 'updated existing message';
    } else {
        messages.splice(previousParsingErrorIndex, 1);
        return 'removed message';
    }
}

export function addReasonToDisable<T extends string>(
    state: { reasonsToDisable: Record<string, true> },
    reason: T) {
    state.reasonsToDisable[reason] = true;
}

export function removeReasonToDisable<T extends string>(
    state: { reasonsToDisable: Record<string, true> },
    reason: T) {
    delete state.reasonsToDisable[reason];
}

export async function disable<TRes, T extends string>(
    setStore: SubStore<{ reasonsToDisable: Record<string, true> }>[1], 
    reason: T, 
    fn: () => Promise<TRes>){

    setStore(x => addReasonToDisable(x, reason));

    const res = await fn();

    setStore(x => removeReasonToDisable(x, reason));

    return res;
}