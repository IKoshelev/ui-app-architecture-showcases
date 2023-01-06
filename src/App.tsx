import { Component, createMemo, For } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import styles from './App.module.scss'; import { clockStore } from './stores/clock.store';
import { NumericInputComponent } from './generic-components/NumericInput.Component';
import { getInputState, InputState } from './generic-components/UserInput.pure';
import { getNumericInputVM } from './generic-components/NumericInput.vm';
import { getSubStoreWProduce } from './util/subStore';

const [storeState, setStoreState] = createStore({
  form: {
    input1: getInputState<number | undefined, string>(undefined),
    inputsArr: [] as InputState<number | undefined, string>[]
  }
});

export function appVm(state: typeof storeState, setState: typeof setStoreState) {

  console.log("recreating entire vm");
  return {
    // todo add vm memoization with weak map? 
    input1: getNumericInputVM(
      ...getSubStoreWProduce(state, setState, x => x.form.input1)
    ),
    inputsArr: () => state.form.inputsArr.map((x, i) => {
      console.log("recreating array vms");
      return getNumericInputVM(
        ...getSubStoreWProduce(state, setState, x => x.form.inputsArr[i])
      )
    })
  };
}

const App: Component = () => {

  const vm = createMemo(() => {
    return appVm(storeState, setStoreState);
  })

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        The current time is: {clockStore.state.currentDate?.toString() ?? ''}.
        <button onClick={clockStore.commands.start}>start</button>
        <button onClick={clockStore.commands.stop}>stop</button>
      </header>
      <div>
        <NumericInputComponent
          vm={vm().input1}
        />
      </div>
      <For each={vm().inputsArr()}>{(inputVM, i) =>
        <div>
          <NumericInputComponent
            vm={inputVM}
          />
        </div>}
      </For>
      <button
        onClick={() => setStoreState(produce(draft => {
          draft.form.inputsArr.push(
            getInputState<number | undefined, string>(undefined)
          );
        }))}
      >Add numeric input</button>
      <pre>
        {
          JSON.stringify(storeState, null, 2)
        }
      </pre>
    </div>
  );
};

export default App;
