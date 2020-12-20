import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { atom, callback } from './App';
import * as serviceWorker from './serviceWorker';
import { useState } from 'react';

(window as any).atom = atom;

const Cmp: React.FC<{
  atom: any,
  callback: any
}> = ({atom, callback}: any) => {
  const [s, setState] = useState(0);
  //if(setState.toString() !== 'function () {}'){
    callback.call = () => {
      setState((s) => s + 1)
    };
  //}
  console.log('rendering');
  return <>
    {JSON.stringify(atom)}
    <button onClick={() => (atom as any).a = 5}>+</button>
    <button onClick={() => setState((s) => s + 1)}>+</button>
  </>;
}


ReactDOM.render(
  <Cmp atom={atom} callback={callback} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
