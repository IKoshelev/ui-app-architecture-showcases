import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { app } from './App';
import * as serviceWorker from './serviceWorker';
import { useState } from 'react';
import { AppContext, Observer } from './util/observer';

(window as any).app = app;

const Cmp: React.FC<{
  target: object,
  indentation: number
}> = ({ target, indentation }: any) => {

  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  return <Observer render={
    () => {
      const indentationStr = '\u00A0'.repeat(indentation);
      return <div>
        {indentationStr}

        <input 
        style={{ display: 'inline', width: '200px' }} 
          type="text" 
          value={newKey}
          placeholder="key" 

          onChange={({ target: { value } }) => setNewKey(value)}/>

        <input 
          style={{ display: 'inline', width: '200px' }} 
          type="text" value={newVal}
          placeholder="json value" 
          onChange={({ target: { value } }) => setNewVal(value)}/>

        <button style={{ display: 'inline-block' }} onClick={() => {
          let json: any;
          try {
            json = JSON.parse(newVal);
          } catch(er) {
            window.alert("Oops... could not parse JSON. Remember to quote prop names with \".");
            return;
          }
          target[newKey] = json;
          setNewKey('');
          setNewVal('');
        }} >add</button>

        {Object.getOwnPropertyNames(target).map(key => {
          const val = target[key];
          return <div key={key.toString()} style={{ width: '500px' }}>
            {indentationStr}
            {key.toString()}:{
              typeof val === 'object'
                ? <Cmp target={val} indentation={indentation + 4} />
                : val?.toString()
            }
            {typeof val === 'number' && <button onClick={(() => { target[key] = val + 1 })}>+</button>}
          </div>;
        })}

      </div>
    }
  }>

  </Observer>;
}

ReactDOM.render(
  <div>
    <AppContext.Provider value={{ app }}>
      <Cmp target={app.root} indentation={0} />
    </AppContext.Provider>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
