import React, { Profiler } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { App2 } from './App2';
import * as serviceWorker from './serviceWorker';
import { onRenderCallback } from './util/onRender';

ReactDOM.render(
  <React.StrictMode>
    <Profiler id="App" onRender={onRenderCallback}>  
      <App />
    </Profiler>
    <Profiler id="App2" onRender={onRenderCallback}>  
      <App2 />
    </Profiler>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
