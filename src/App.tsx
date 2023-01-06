import { Component, createMemo, For } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import styles from './App.module.scss'; import { clockStore } from './stores/clock.store';
import { NumericInputComponent } from './generic-components/NumericInput.Component';
import { getInputState, InputState } from './generic-components/UserInput.pure';
import { getNumericInputVM } from './generic-components/NumericInput.vm';
import { getDeeperSubStore, getSubStoreFromStore } from './util/subStore';

const [storeState, setStoreState] = createStore({
  form: {
    input1: getInputState<number | undefined, string>(undefined),
    inputsArr: [] as InputState<number | undefined, string>[]
  }
});

const subStore1 = getSubStoreFromStore(
  storeState, 
  setStoreState, 
  x => x.form);

  const subStore2 = getDeeperSubStore(...subStore1, x => x.input1);

export function appVm(state: typeof storeState, setState: typeof setStoreState) {

  console.log("recreating entire vm");
  return {
    // todo add vm memoization with weak map? 
    input1: getNumericInputVM(
      ...getSubStoreFromStore(state, setState, x => x.form.input1)
    ),
    inputsArr: () => state.form.inputsArr.map((x, i) => {
      console.log("recreating array vms");
      return getNumericInputVM(
        ...getSubStoreFromStore(state, setState, x => x.form.inputsArr[i])
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
      Substore: 
      <pre>
        {
          JSON.stringify(subStore2[0](), null, 2)
        }
      </pre>
      <button
        onClick={() => subStore2[1](x => x.committedValue = 112358)}
      >
        Set value to 112358
      </button>
    </div>
  );
};

export default App;
