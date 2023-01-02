import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';

import styles from './App.module.scss';
import { getBlankNumericInputState} from './generic-components/NumericInput';
import { clockStore } from './stores/clock.store';
import { NumericInputComponent } from './generic-components/NumericInput.Component';
import { numberAtomicValidators } from './generic-components/AtomicValidators';

const App: Component = () => {

  const [storeState, setStoreState] = createStore({
    form: {
      input1: getBlankNumericInputState(
        numberAtomicValidators.integer(),
        numberAtomicValidators.positive(),
        numberAtomicValidators.lessThan(100),
        numberAtomicValidators.between(20, 5000)
      )
    }
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
          store={storeState}
          setStore={setStoreState}
          getInput={(s) => s.form.input1}
        />
      </div>
      <pre>
      {
        JSON.stringify(storeState, null, 2)
      }
      </pre>
    </div>
  );
};

export default App;
