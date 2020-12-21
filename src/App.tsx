
import React, { useState } from "react";
import { makeApp } from "./util/observable-proxy";
import './index.css';
import { observer2 } from './util/observer';

type Todo = {
    id: number,
    text: string,
    done: boolean
};

type Filter = "ALL" | "DONE" | "NOT_DONE";

type State = {
    todos: Todo[]
    filter: Filter
}

export const app = makeApp({} as State);

app.state.todos = [];
app.state.filter = "ALL";

(window as any).app = app;

export const TodoCmp = React.memo(observer2(({ todo }: {
    todo: Todo
}) => {
    return <>
        <input
            type="text"
            onChange={({ target: { value } }) => todo.text = value}
            value={todo.text}
        />
        <input
            type="checkbox"
            onChange={({ target: { checked } }) => todo.done = checked}
            checked={todo.done}
        />
    </>
}));

export const TodoAdderCmp = React.memo(observer2(({ todoList }: {
    todoList: Todo[]
}) => {

    const [text, setText] = useState("");

    return <div>
        <input
            type="text"
            onChange={({ target: { value } }) => setText(value)}
            value={text}
        />
        <button onClick={() => {
            const id = Math.max(0, ...todoList.map(x => x.id)) + 1;
            todoList.push({
                id,
                text,
                done: false
            });
            setText("");
        }}>
            Add
        </button>
    </div>
}));

export const StateSaveLoadCmp = React.memo(observer2(({ appState }: { appState: State }) => {

    const [savedState, setSavedState] = useState("");

    return <div>
        <button
            onClick={() => {
                const json = JSON.stringify(appState, undefined, 4);
                setSavedState(json);
            }}
        >Save state</button>
        <button
            onClick={() => {
                const state = JSON.parse(savedState);
                Object.assign(appState, state);
            }}
        >Load state</button>
        <div style={{ whiteSpace: "pre" }}>
            {savedState}
        </div>
    </div>;
}));

export const TodoListCmp = React.memo(observer2(({ appState }: { appState: State }) => {
    return <div>
        <div>
            {
                appState.todos.filter(x =>
                    appState.filter === 'DONE' ? x.done === true :
                        appState.filter === 'NOT_DONE' ? x.done === false :
                            true
                ).map(x => (
                    <div key={x.id}>
                        <TodoCmp todo={x} />
                        <button onClick={() => { appState.todos.splice(appState.todos.indexOf(x), 1) }}>
                            X
                        </button>
                    </div>))
            }
        </div>
        <div>
            {
                (["ALL", "DONE", "NOT_DONE"] as const).map(x => (
                    <button
                        key={x}
                        onClick={() => appState.filter = x}
                        style={{
                            border: appState.filter === x ? "2px solid black" : ""
                        }}
                    >
                        {x}
                    </button>
                ))
            }
        </div>
        <TodoAdderCmp todoList={appState.todos} />
        <StateSaveLoadCmp appState={appState} />
    </div>
}));