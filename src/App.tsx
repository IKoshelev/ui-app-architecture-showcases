import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  RecoilState,
} from 'recoil';

import './App.css';

let uniqueId = 0;
function getNextUniqueId(){
  return ++uniqueId;
}

type Todo = {
  id: number,
  text: string,
  done: boolean
}

type TodoFilter = 'ALL' | 'DONE' | 'NOT_DONE';

const todosListAtom = atom({
  key: 'todos_state', // unique ID (with respect to other atoms/selectors)
  default: [] as RecoilState<Todo>[], // default value (aka initial value)
});

const todosFilterAtom = atom({
  key: 'todos_filter', 
  default: 'ALL',
});

const todosFilteredSelector = selector({
  key: 'todos_filtered_view',
  get: ({get}) => {
    const filter = get(todosFilterAtom);

    if(filter === 'ALL') {
      return todosListAtom;
    } else {
      const todos = get(todosListAtom);
      const desiredState = 
        filter === 'DONE' ? true : 
        filter === 'NOT_DONE' ? false :
        (() => {throw new Error(`Unknown filter state ${filter}`)})();

      return todos.filter(x => get(x).done === desiredState);
    }
  }
});

export const App = () => {
  return <RecoilRoot>
    <div id='app-root'>

      <div className='main-logo'>
        Welcome to Crazy Ivan Motors
    </div>

      <div className='screens'>

      </div>
    </div>
  </RecoilRoot>
};


export const TodoCmp: React.FC<{
  todoAtom: RecoilState<Todo>
}> = ({todoAtom}) => {
  
  const [todosList, updateTodosList] = useRecoilState(todosListAtom);
  const [todo, updateTodo] = useRecoilState(todoAtom);

  return <div>
    <input type="text" 
          value={todo.text}
          onChange={(e) => updateTodo({
            ...todo,
            text: e.target.value
          })}
    />
    <input type="checkbox"
        checked={todo.done}
        onChange={(e) =>  updateTodo({
          ...todo,
          done: e.target.checked
        })}
    />
    <div
      onClick={() => updateTodosList(todosList.filter(x => x !== todoAtom) )}
    >
      X
    </div>
  </div>;
};

export const TodoList = () => {
  

  const todosFiltered = useRecoilValue(todosFilteredSelector);

  return <div>
    <div>
      {todosFiltered.map(todoAtom => { 
        return <TodoCmp key={useRecoilValue(todoAtom).id} todoAtom={todoAtom} />
      })}
    </div>
    <button onClick={() => {
      const [todosList, updateTodosList] = useRecoilState(todosListAtom);
      const id = getNextUniqueId();
      const newTodo = atom<Todo>({
        key: `todo_${id}`,
        default: {
          id,
          text: 'something to do',
          done: false
        }
      });

      updateTodosList([
        ...todosList,
        newTodo
      ]);
    }}>
      Add
    </button>
  </div>
}

