import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { app, TodoListCmp } from './App';
import * as serviceWorker from './serviceWorker';
import { useState } from 'react';
import { AppContext, observer2 } from './util/observer';

(window as any).app = app;

ReactDOM.render(
  <div>
    <AppContext.Provider value={{ app }}>
      <TodoListCmp appState={app.state} />
    </AppContext.Provider>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();