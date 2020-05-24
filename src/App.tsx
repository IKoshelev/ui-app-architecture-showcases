import React, { useState, useEffect } from 'react';

import './App.css';
import { createTodoList, TodoList } from './todo/TodoList';
import { app, getEntitySate } from './util/Entity';
import { createTodo, Todo, setTodoDescription, toggleIsDone } from './todo/Todo';

const listRef = createTodoList({
  todos: [
    createTodo({
      description: "aaaaaa",
      isDone: false
    }),
    createTodo({
      description: "bbbbb",
      isDone: false
    })
  ]
});

app.root = listRef;

export const App = () => {

  console.log('rendering');

  //typically all of the below would be done by convention
  const [rendersCount, setRendersCount] = useState(0);

  const triggerRendering = () => void setRendersCount(rendersCount + 1);
  app.onStateChanged = triggerRendering;

  const todoList = getEntitySate<TodoList>(app.root!);

  return <div>
    {
      todoList.todos
        .map((ref) => getEntitySate<Todo>(ref)) // this would probable be a pattern
        .map(todo => (
          <div key={todo.__id__}>
            <input
              type='checkbox'
              checked={todo.isDone}
              onChange={() => toggleIsDone(todo)}
            ></input>
            <input
              value={todo.description}
              onChange={(e) => {
                e.preventDefault();
                setTodoDescription(todo, e.target.value);
              }}
            />
          </div>)
        )
    }
  </div>

};