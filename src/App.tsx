import { Component, createMemo, For } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

import styles from './App.module.scss'; 
import { clockStore } from './stores/clock.store';
import { InputComponent } from './generic-components/Input.component';
import { getInputState, InputState } from './generic-components/input-models/UserInput.pure';
import { getNumericInputVM, numberValidatorFns } from './generic-components/input-models/NumericUserInput.vm';
import { getDeeperSubStore, getSubStoreFromStore } from './util/subStore';
import { getUserInputVM } from './generic-components/input-models/UserInput.vm';
import { SelectDropdown } from './generic-components/SelectDropdown.component';
import { SelectMultiple } from './generic-components/SelectMultiple.component';

type ItemWithId = {
  id: string,
  description: string
}

const items: ItemWithId[] = [{
  id: "1",
  description: "apple"
},{
  id: "2",
  description: "orange"
},{
  id: "3",
  description: "banana"
}]

const [storeState, setStoreState] = createStore({
  form: {
    numberInput: getInputState<number | undefined, string>(undefined),
    arrayOfNumberInputs: [] as InputState<number | undefined, string>[],
    wholeItemInput: getInputState<ItemWithId | undefined, ItemWithId>(undefined),
    itemDescriptionInput: getInputState<string | undefined, ItemWithId>(undefined),
    stringInput: getInputState<string | undefined, string>(undefined),
    multipleOptionsInput: getInputState<string[], ItemWithId[]>([]),
    multipleStringInput: getInputState<string[], string[]>([]),
  }
});

const subStore1 = getSubStoreFromStore(
  storeState, 
  setStoreState, 
  x => x.form);

  const subStore2 = getDeeperSubStore(...subStore1, x => x.numberInput);

export function appVm(state: typeof storeState, setState: typeof setStoreState) {

  console.log("recreating entire vm");
  return {
    // todo add vm memoization with weak map? 
    numberInput: getNumericInputVM(
      ...getSubStoreFromStore(state, setState, x => x.form.numberInput),
      [
        numberValidatorFns.integer(),
        numberValidatorFns.between(10,20)
      ]
    ),
    arrayOfNumberInputs: () => state.form.arrayOfNumberInputs.map((x, i) => {
      console.log("recreating array vms");
      return getNumericInputVM(
        ...getSubStoreFromStore(state, setState, x => x.form.arrayOfNumberInputs[i])
      )
    }),
    // in a prod project, following vms would have specialized 
    // factory functions for brevity
    wholeItemInput: getUserInputVM<ItemWithId | undefined, ItemWithId, string>(
      ...getSubStoreFromStore(state, setState, x => x.form.wholeItemInput),
      (m) => m?.description ?? "",
      (v) => ({ status: "parsed", parsed: v})
    ),
    itemDescriptionInput: getUserInputVM<string | undefined, ItemWithId, string>(
      ...getSubStoreFromStore(state, setState, x => x.form.itemDescriptionInput),
      (m) => m ?? "",
      (v) => ({ status: "parsed", parsed: v.id})
    ),
    stringInput: getUserInputVM<string | undefined, string, string>(
      ...getSubStoreFromStore(state, setState, x => x.form.stringInput),
      (m) => m ?? "",
      (v) => ({ status: "parsed", parsed: v})
    ),
    multipleOptionsInput:  getUserInputVM<string[], ItemWithId[], any>(
      ...getSubStoreFromStore(state, setState, x => x.form.multipleOptionsInput),
      (m) => m ?? "",
      (v) => ({ status: "parsed", parsed: v.map(x => x.id)})
    ),
    multipleStringInput: getUserInputVM<string[], string[], any>(
      ...getSubStoreFromStore(state, setState, x => x.form.multipleStringInput),
      (m) => m ?? "",
      (v) => ({ status: "parsed", parsed: v})
    ),
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
        <InputComponent
          vm={vm().numberInput}
        />
      </div>
      <div>
        <SelectDropdown
          vm={vm().wholeItemInput}
          getItemId={(i) => i.id}
          getItemDescription={(i) => i.description}
          getModelId={(i) => i?.id ?? ""}
          availableItems={items}
          hasEmptyOption={true}
        />
      </div>
      <div>
        <SelectDropdown
          vm={vm().itemDescriptionInput}
          getItemId={(i) => i.id}
          getItemDescription={(i) => i.description}
          getModelId={(i) => i ?? ""}
          availableItems={items}
          hasEmptyOption={true}
        />
      </div>
      <div>
        <SelectDropdown
          vm={vm().stringInput}
          availableItems={items.map(x => x.description)}
          hasEmptyOption={true}
        />
      </div>
      <div>
        <SelectMultiple
          vm={vm().multipleOptionsInput}
          getItemId={(i) => i.id}
          getItemDescription={(i) => i.description}
          getModelId={(i) => i ?? ""}
          availableItems={items}
        />
      </div>
      <div>
        <SelectMultiple
          vm={vm().multipleStringInput}
          availableItems={items.map(x => x.description)}
        />
      </div>
      <For each={vm().arrayOfNumberInputs()}>{(inputVM, i) =>
        <div>
          <InputComponent
            vm={inputVM}
          />
        </div>}
      </For>
      <button
        onClick={() => setStoreState(produce(draft => {
          draft.form.arrayOfNumberInputs.push(
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
