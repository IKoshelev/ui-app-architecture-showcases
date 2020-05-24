import { forEach } from 'lodash';

export type EntityRef<T extends string> = {
    __type__: T;
    __id__: number;
}

export type Entity<T extends string> = {
    __ref__: EntityRef<T>
}

export function getRefWithoutID<T extends string>(__type__: T): EntityRef<T> {
    return {
        __type__,
        __id__: 0
    }
}

type ImmutablePrimitive = undefined | null | boolean | string | number | Function;

export type Immutable<T> =
    T extends ImmutablePrimitive ? T :
    T extends Array<infer U> ? ImmutableArray<U> :
    T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
    T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;

export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

//todo garbage-collect unused references :-)
export const app = {
    entites: {} as { [type: string]: { [id: number]: any } },   // todo this would probably be maps
    root: undefined as (EntityRef<'TODO_LIST'> | undefined),
    componentDependencyListeneres: {} as { [componentId: number]: (mutatedEntity: number) => void },
    onStateChanged: () => { }
};

(window as any).getAppStateJSON = function (): string {
    return JSON.stringify({
        entities: app.entites,
        root: app.root
    }, null, 2);
};

(window as any).setAppStateJSON = function (state: string): void {

    const js = JSON.parse(state);
    app.entites = js.entities;
    app.root = js.root;
    app.onStateChanged();
};

let idCounter = 1;
export function createEntityState<T extends Entity<string>>(entity: T): T['__ref__'] {
    const id = (idCounter += 1);
    entity.__ref__.__id__ = id;
    setEntitySate(entity);
    return entity.__ref__;
}


const renderingFramesStack: Set<number>[] = [];
function trackInCurrentFrame(id: number) {
    if (renderingFramesStack.length === 0) {
        return;
    }
    renderingFramesStack[renderingFramesStack.length - 1].add(id);
}
export function startNewRenderingFrame() {
    renderingFramesStack.push(new Set<number>());
}
export function endRenderingFrame() {
    const frame = renderingFramesStack.pop();
    if (!frame) {
        throw new Error();
    }
    return frame;
}

export function getEntitySate<T extends Entity<string>>(ref: T['__ref__']): Immutable<T> {
    trackInCurrentFrame(ref.__id__);
    return getEntitySateNoTrack(ref);
}

export function getEntitySateNoTrack<T extends Entity<string>>(ref: T['__ref__']): Immutable<T> {
    const ent = app.entites[ref.__type__][ref.__id__];
    if (!ent) {
        throw new Error();
    }
    return ent;
}

function setEntitySate<T extends Entity<string>>(entity: T) {
    const ref = entity.__ref__;
    app.entites[ref.__type__] = app.entites[ref.__type__] ?? {};
    return app.entites[ref.__type__][ref.__id__] = entity;
}

//todo introduce counter for nested dispatches?
export function dispatch<T extends Entity<string>>(ref: T['__ref__'], action: (state: Immutable<T>) => undefined | Partial<T>) {
    const prevState = getEntitySate(ref);
    const newStateDiff = action(prevState);

    if (newStateDiff) {
        setEntitySate({
            ...prevState,
            ...newStateDiff
        });

        forEach(app.componentDependencyListeneres, (fn) => {
            fn(ref.__id__);
        });
    }
}