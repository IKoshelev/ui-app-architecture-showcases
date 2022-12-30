import { Component, createEffect, createSignal } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import styles from './App.module.scss';
import { getBlankNumericInputState, setCurrentUnsavedValue, tryCommitValue } from './generic-components/NumericInput';
import { clockStore } from './stores/clock.store';
import { NumericInputComponent } from './generic-components/NumericInput.Component';

const App: Component = () => {

  const [storeState, setStoreState] = createStore({
    input: getBlankNumericInputState(),
    modelState: 0
  });


  return (
    <div class={styles.App}>
      <header class={styles.header}>
        The current time is: {clockStore.state.currentDate?.toString() ?? ''}.
        <button onClick={clockStore.commands.start}>start</button>
        <button onClick={clockStore.commands.stop}>stop</button>
      </header>
      <div>
        <NumericInputComponent
          inputState={storeState.input}
          modelState={storeState.modelState}
          onChange={(inputVal) => setStoreState(produce((newState) => {
              setCurrentUnsavedValue(newState.input, inputVal)
            }
          ))}
          onBlur={() => setStoreState(produce((newState) => {
              tryCommitValue(
                newState.input, 
                (newModelState) => newState.modelState = newModelState);
            }))}
        />
      </div>
      {
        JSON.stringify(storeState)
      }
    </div>
  );
};

export default App;
