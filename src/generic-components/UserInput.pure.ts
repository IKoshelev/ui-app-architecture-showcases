export const PARSING_ERROR = "PARSING_ERROR";

export type InputMessage = {
    code: string,
    type: "error" | "warning",
    message: string,
}

export type Validator<TModel> = (val: TModel) => {
    status: "invalid",
    message: InputMessage
} | {
    status: "valid",
    code: string
}

export const numberValidator = <TModel>(
    code: string,
    validWhen: (val: TModel) => boolean,
    messageFn: (val: TModel) => string): Validator<TModel> =>
    (val: TModel) => {
        if (!validWhen(val)) {
            return {
                status: "invalid",
                message: {
                    type: "error",
                    code,
                    message: messageFn(val)
                }
            };
        }

        return {
            status: "valid",
            code
        }

    }

export function getInputState<TModel, TInput = any>(
    initialValue: TModel
) {
    return {
        uncommittedValue: undefined as TInput | undefined,
        committedValue: initialValue,
        pristineValue: initialValue,
        isTouched: false,
        reasonsToDisable: {} as {
            [reason: string]: true
        },
        messages: [] as InputMessage[]
    }
}

export type InputState<TModel, TInput = any> = ReturnType<typeof getInputState<TModel, TInput>>;

export function isDisabled<TModel, TInput = any>(
    state: InputState<TModel, TInput>) {
    return Object.keys(state.reasonsToDisable).length > 0;
}

export function isValid<TModel, TInput = any>(
    state: InputState<TModel, TInput>){
    return state.messages.some(x => x.type === "error");
}

export function addReasonToDisable<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    reason: string) {
    state.reasonsToDisable[reason] = true;
}

export function removeReasonToDisable<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    reason: string) {
    delete state.reasonsToDisable[reason];
}

export function spliceMessage(
    messages: InputMessage[],
    code: string,
    newMessage?: InputMessage) {

    const previousParsingErrorIndex = messages.findIndex(x => x.code === code);

    if(previousParsingErrorIndex === -1)
    {
        if (newMessage){
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

export function setCurrentUnsavedValue<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    newUnsavedValue: TInput | undefined,
    setTouched = true) {
    state.uncommittedValue = newUnsavedValue;
    spliceMessage(state.messages, PARSING_ERROR);
    if (setTouched){
        state.isTouched = true;
    }
}

export function isPristine<TModel, TInput = any>(
    state: InputState<TModel, TInput>
){
    return state.committedValue === state.pristineValue;
}

export function clearMessages<TModel, TInput = any>(
    state: InputState<TModel, TInput>) {
    state.messages = [];
}

export function revalidateCommittedValue<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    validators: Validator<TModel>[]) {

    for (const validator of validators) {
        const result = validator(state.committedValue);
        if (result.status === "valid") {
            spliceMessage(state.messages, result.code);
            continue;
        }
        spliceMessage(state.messages, result.message.code, result.message);
    }
}

export function resetValueToPristine<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    resetIsTouched = true,
    clearMessages = true
) {
    state.uncommittedValue = undefined;
    state.committedValue = state.pristineValue;
    if (resetIsTouched) {
        state.isTouched = false;
    }
    if (clearMessages) {
        state.messages = [];
    }
}

export function tryCommitValue<TModel, TInput = any>(
    state: InputState<TModel, TInput>,
    parseInput: (val: TInput) => {
        status: "parsed",
        parsed: TModel
    } | {
        status: "error",
        message: string,
    },
    validators: Validator<TModel>[]) {

    if (state.uncommittedValue === undefined) {
        return false;
    }

    let parseResult = parseInput(state.uncommittedValue);

    if (parseResult.status === "error") {
        spliceMessage(state.messages, PARSING_ERROR, {
            code: PARSING_ERROR,
            type: "error",
            message: parseResult.message
        });
        return;
    }

    spliceMessage(state.messages, PARSING_ERROR);

    state.committedValue = parseResult.parsed;
    state.uncommittedValue = undefined;
    revalidateCommittedValue(state, validators);
}