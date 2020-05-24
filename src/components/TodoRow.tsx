import React from 'react';
import { EntityRef, getEntitySate } from '../util/Entity';
import { TODO_LIST, TodoList, removeTodo } from '../entities/TodoList';
import { Observer } from '../util/Observer';
import { TODO, Todo, toggleIsDone, setTodoDescription } from '../entities/Todo';

export const TodoRow: React.FC<{
    listRef: EntityRef<TODO_LIST>,
    todoRef: EntityRef<TODO>
}> = ({ listRef, todoRef }) => (<Observer render={() => {

    const list = getEntitySate<TodoList>(listRef);
    const todo = getEntitySate<Todo>(todoRef);

    console.log(`Rendering TodoRow for`, todo);

    const filter =
        list.filter === 'DONE' ? ((todo: Todo) => todo.isDone === true) :
            list.filter === 'NOT_DONE' ? ((todo: Todo) => todo.isDone === false) :
                () => true;

    if (!filter(todo)) {
        return <></>;
    }

    return <div key={todo.__ref__.__id__}>
        <input
            type='checkbox'
            checked={todo.isDone}
            onChange={() => toggleIsDone(todo.__ref__)}
        ></input>
        <input
            value={todo.description}
            onChange={(e) => {
                e.preventDefault();
                setTodoDescription(todo.__ref__, e.target.value);
            }}
        />
        <button
            onClick={() => removeTodo(list.__ref__, todo.__ref__)}
        >X</button>
    </div>;
}
} />);