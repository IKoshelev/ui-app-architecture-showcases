import { EntityId, createEntityState, dispatch } from "../util/Entity";

export type TodoRef = EntityId & { __type__: 'TODO' };

type TodoState = {
    description: string;
    isDone: boolean;
}

export type Todo = TodoRef & TodoState;

export function createTodo(state: TodoState) {
    const fullState = state as Todo;
    fullState.__type__ = 'TODO';
    return createEntityState(fullState);
}

export function setTodoDescription(ref: TodoRef, description: string) {
    dispatch<Todo>(ref, () => ({
        description
    }));
}

export function setIsDone(ref: TodoRef, isDone: boolean) {
    dispatch<Todo>(ref, () => ({
        isDone
    }));
}

export function toggleIsDone(ref: TodoRef) {
    dispatch<Todo>(ref, (current) => ({
        isDone: !current.isDone
    }));
}