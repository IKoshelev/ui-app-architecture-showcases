import React from 'react';
import { TODO_LIST, setFitler, TodoList } from "../entities/TodoList";
import { EntityRef, getEntitySate } from "../util/Entity";
import { Observer } from "../util/Observer";

export const FilterSelector: React.FC<{
    listRef: EntityRef<TODO_LIST>
}> = ({ listRef }) => (<Observer render={() => {

    const list = getEntitySate<TodoList>(listRef);

    console.log(`Rendering FilterSelector for`, list);

    return <> Show:
        {
            (['ALL', 'DONE', 'NOT_DONE'] as const).map(x => {
                return list.filter === x
                    ? <b
                        key={x}
                    >&nbsp;{x}&nbsp;</b>
                    : <span
                        key={x}
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={() => setFitler(list.__ref__, x)}
                    >
                        &nbsp;{x}&nbsp;
            </span>
            })
        } </>;
}}
/>);