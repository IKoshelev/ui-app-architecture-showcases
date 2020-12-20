import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { app, JsObjectView } from './App';
import * as serviceWorker from './serviceWorker';
import { useState } from 'react';
import { AppContext, observer2 } from './util/observer';

(window as any).app = app;


ReactDOM.render(
  <div>
    <AppContext.Provider value={{ app }}>

      <JsObjectView target={app.root} indentation={0} />

      <button onClick={() => {
        Object.assign(app.root, {
          counter1: 1,
          bar: {
            counter2: 1,
            baz: {
              stringProp: 'abcd',
              counter3: 1,
              bac: {}
            }
          }
        });
      }}>Add showcase structure</button>

    </AppContext.Provider>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
