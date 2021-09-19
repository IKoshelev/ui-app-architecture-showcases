import { writable, get } from "svelte/store";
import { makeApplyDiff } from "../util/genericReducers";
import { produce } from "immer";

const defaultState1 = {
    a: 1,
    b: 2
};

function createStore1() {
    const { subscribe, set, update } = writable(defaultState1);

    return {
        subscribe,
        incr1: () => update(x => {x.a++; return x}),
        incr2: () => update(x => {x.b++; return x}),
    }
}

export const store1 = createStore1();

const defaultState2 = {
    a: {val: 1},
    b: {val: 2}
};

function createStore2() {
    const { subscribe, set, update } = writable(defaultState2);

    return {
        subscribe,
        incr1: () => update(x => {x.a.val++; return x}),
        incr2: () => update(x => {x.b.val++; return x}),
    }
}

export const store2 = createStore2();

function createStoreImmut(){
    const { subscribe, set, update } = writable(defaultState2);

    return {
        subscribe,
        incr1: () => update(x => produce(x, draft => {draft.a.val++})),
        incr2: () => update(x => produce(x, draft => {draft.b.val++})),
    }
}

export const storeImmut = createStoreImmut();