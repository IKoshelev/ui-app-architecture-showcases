import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import * as serviceWorker from './serviceWorker';

const fullBaseUrl = window.location.href;
if(/localhost/.test(fullBaseUrl) === false) {
  console.log(`Setting base url (for relative links) to ${fullBaseUrl}`);
  window.document.head.append(
    window.document.createElement("base", {
      href: fullBaseUrl
    } as any)
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
