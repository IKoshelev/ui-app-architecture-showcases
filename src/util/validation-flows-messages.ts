import { SubStore } from "./subStore";

export type DisplayMessage = {
    code: string,
    type: "error" | "warning",
    message: string,
}

export function error(code: string, message: string){
    return {
        type: "error" as const,
        code,
        message
    };
}

export function addError(
    messages: DisplayMessage[], 
    code: string,
    message: string){
        messages.push(error(code, message));
    }

export function isValid(
    state: { messages: DisplayMessage[] }) {
    return state.messages.some(x => x.type === "error") === false;
}

export function hasActiveFlows(
    state: { activeFlows: Record<string, true> }) {
    return Object.keys(state.activeFlows).length > 0;
}

export function isLoading(
    state: { activeFlows: Record<`loading:${string}`, true> }) {
    return Object.keys(state.activeFlows).filter(k => k.startsWith('loading:')).length > 0;
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

export function addActiveFlow<T extends string>(
    state: { activeFlows: Record<string, true> },
    reason: T) {
    state.activeFlows[reason] = true;
}

export function removeActiveFlow<T extends string>(
    state: { activeFlows: Record<string, true> },
    reason: T) {
    delete state.activeFlows[reason];
}

export async function runFlow<TRes, T extends string>(
    setStore: SubStore<{ activeFlows: Record<T, true> }>[1], 
    reason: T, 
    fn: () => Promise<TRes>){

    setStore(x => addActiveFlow(x, reason));

    let res: any;
    try {
        return await fn();
    } finally {
        setStore(x => removeActiveFlow(x, reason)); 
    }
}