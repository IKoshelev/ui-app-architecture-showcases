import { EntityRef, createEntityState, dispatch, getRefWithoutID, Entity } from "../util/Entity";
import { without } from 'lodash';
import { TODO } from "./Todo";

export type TODO_LIST = 'TODO_LIST'

type TodoListState = {
    todos: EntityRef<TODO>[];
    filter: 'ALL' | 'DONE' | 'NOT_DONE';
}

export type TodoList = Entity<TODO_LIST> & TodoListState;

export function createTodoList(state: TodoListState) {
    const fullState = state as TodoList;
    fullState.__ref__ = getRefWithoutID('TODO_LIST');
    return createEntityState(fullState);
}

export function addTodo(ref: EntityRef<TODO_LIST>, todo: EntityRef<TODO>) {
    dispatch<TodoList>(ref, (cur) => ({
        todos: [...cur.todos, todo]
    }));
}

export function removeTodo(ref: EntityRef<TODO_LIST>, todo: EntityRef<TODO>) {
    dispatch<TodoList>(ref, (cur) => ({
        todos: without(cur.todos, todo)
    }));
}

export function setFitler(ref: EntityRef<TODO_LIST>, filter: TodoList['filter']) {
    dispatch<TodoList>(ref, (cur) => ({
        filter
    }));
}