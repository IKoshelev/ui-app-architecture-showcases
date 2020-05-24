import React, { useState, useEffect } from 'react';

import './App.css';
import { createTodoList, TodoList, addTodo, removeTodo, TODO_LIST, setFitler } from './todo/TodoList';
import { app, getEntitySate, EntityRef, Immutable } from './util/Entity';
import { createTodo, Todo, setTodoDescription, toggleIsDone, TODO } from './todo/Todo';

app.root = createTodoList({
  todos: [
    createTodo({
      description: "aaaaaa",
      isDone: false
    }),
    createTodo({
      description: "bbbbb",
      isDone: false
    })
  ],
  filter: 'ALL'
});

export const App = () => {

  console.log('rendering');

  //typically all of the below would be done by convention
  const [rendersCount, setRendersCount] = useState(0);

  const triggerRendering = () => void setRendersCount(rendersCount + 1);
  app.onStateChanged = triggerRendering;

  const list = getEntitySate<TodoList>(app.root!);

  return <div>
    <FilterSelector
      list={list}
    />
    <div>
      <Todos
        list={list}
      />
    </div>

    <div>
      <TodoAdder onAdd={(text) => addTodo(app.root!, createTodo({
        description: text,
        isDone: false
      }))} />
    </div>

    <SnapshotControlls />
  </div>

};

export const FilterSelector: React.FC<{
  list: Immutable<TodoList>
}> = ({ list }) => {
  return <>Show:
    {
      (['ALL', 'DONE', 'NOT_DONE'] as const).map(x => {
        return list.filter === x
          ? <b>&nbsp;{x}&nbsp;</b>
          : <span
            style={{
              cursor: 'pointer'
            }}
            onClick={() => setFitler(list.__ref__, x)}
          >
            &nbsp;{x}&nbsp;
          </span>
      })
    }

  </>;
}

export const Todos: React.FC<{
  list: Immutable<TodoList>
}> = ({ list }) => {

  const filter =
    list.filter === 'DONE' ? ((todo: Todo) => todo.isDone === true) :
      list.filter === 'NOT_DONE' ? ((todo: Todo) => todo.isDone === false) :
        () => true;

  return <>
    {
      list
        .todos
        .map((ref) => getEntitySate<Todo>(ref)) // this would probably be a pattern
        .filter(filter)
        .map(todo => (
          <div key={todo.__ref__.__id__}>
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
          </div>)
        )}
  </>;
};

export const TodoAdder: React.FC<{
  onAdd: (text: string) => void
}> = ({ onAdd }) => {

  const [unsavedText, setUnsavedText] = useState('');

  return <>
    <input
      value={unsavedText}
      onChange={(e) => setUnsavedText(e.target.value)}
    />
    <button
      onClick={() => {
        onAdd(unsavedText);
        setUnsavedText('');
      }}
    >
      Add
    </button>
  </>;
};

export const SnapshotControlls = () => {
  const w = window as any;
  return <>

    <button
      onClick={() => w.snapshot = w.getAppStateJSON()}
    >Save snapshot</button>

    <button
      onClick={() => w.setAppStateJSON(w.snapshot)}
    >Load last snapshot</button>
  </>;
}