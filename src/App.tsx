import React, { useState } from 'react';

import './App.css';
import { createTodoList, TodoList, addTodo, removeTodo, TODO_LIST, setFitler } from './todo/TodoList';
import { app, getEntitySate, EntityRef, Immutable } from './util/Entity';
import { createTodo, Todo, setTodoDescription, toggleIsDone, TODO } from './todo/Todo';
import { Observer } from './Observer';

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

export class App extends React.Component<{}> {

  render() {
    console.log('rendering App');

    app.onStateChanged = () => this.forceUpdate();

    return <div>
      <FilterSelector
        listRef={app.root!}
      />
      <div>
        <Todos
          listRef={app.root!}
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
  }

};

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