import { EntityId, createEntityState, dispatch } from "../util/Entity";
import { TodoRef } from "./Todo";
import { without } from 'lodash';

type TodoListRef = EntityId & { __type__: 'TODO_LIST' };

type TodoListState = {
    todos: TodoRef[];
}

export type TodoList = TodoListRef & TodoListState;


export function createTodoList(state: TodoListState) {
    const fullState = state as TodoList;
    fullState.__type__ = 'TODO_LIST';
    return createEntityState(fullState);
}

export function addTodo(ref: TodoListRef, todo: TodoRef) {
    dispatch<TodoList>(ref, (cur) => ({
        todos: [...cur.todos, todo]
    }));
}

export function removeTodo(ref: TodoListRef, todo: TodoRef) {
    dispatch<TodoList>(ref, (cur) => ({
        todos: without(cur.todos, todo)
    }));
}
