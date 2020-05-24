import { EntityRef, createEntityState, dispatch, Entity, getRefWithoutID } from "../util/Entity";

export type TODO = 'TODO';

type TodoState = {
    description: string;
    isDone: boolean;
}

export type Todo = Entity<TODO> & TodoState;

export function createTodo(state: TodoState) {
    const fullState = state as Todo;
    fullState.__ref__ = getRefWithoutID('TODO');
    return createEntityState(fullState);
}

export function setTodoDescription(ref: EntityRef<TODO>, description: string) {
    dispatch<Todo>(ref, () => ({
        description
    }));
}

export function setIsDone(ref: EntityRef<TODO>, isDone: boolean) {
    dispatch<Todo>(ref, () => ({
        isDone
    }));
}

export function toggleIsDone(ref: EntityRef<TODO>) {
    dispatch<Todo>(ref, (current) => ({
        isDone: !current.isDone
    }));
}