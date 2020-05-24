import React from 'react';
import { EntityRef, getEntitySate } from '../util/Entity';
import { TODO_LIST, TodoList } from '../entities/TodoList';
import { Observer } from '../util/Observer';
import { TodoRow } from './TodoRow';

export const Todos: React.FC<{
    listRef: EntityRef<TODO_LIST>
}> = ({ listRef }) => (<Observer render={() => {
    const list = getEntitySate<TodoList>(listRef);

    console.log(`Rendering Todos for`, list);

    return <>
        {
            list.todos.map((ref) => (
                <TodoRow key={ref.__id__} listRef={listRef} todoRef={ref} />
            ))
        }
    </>;
}} />
);