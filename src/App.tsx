import React from 'react';

import { createTodoList, addTodo } from './entities/TodoList';
import { app } from './util/Entity';
import { createTodo } from './entities/Todo';
import { FilterSelector } from './components/FilterSelector';
import { TodoAdder } from './components/TodoAdder';
import { Todos } from './components/Todos';

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

    return <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px 1fr'
      }}
    >
      <div
        style={{
          gridColumn: '2'
        }}
      >
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
    </div>
  }

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