export type EntityId = {
    __type__: string;
    __id__: number;
}

type EntityIdFor<T extends EntityId> = {
    __type__: T['__type__'];
    __id__: number;
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
    root: undefined as ({
        __id__: number,
        __type__: 'TODO_LIST'
    } | undefined),
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
export function createEntityState<T extends EntityId>(entity: T): EntityIdFor<T> {
    const id = (idCounter += 1);
    (entity as any).__id__ = id;
    setEntitySate(entity);
    return {
        __id__: id,
        __type__: entity.__type__
    }
}

export function getEntitySate<T extends EntityId>(entity: EntityIdFor<T>): Immutable<T> {
    const ent = app.entites[entity.__type__][entity.__id__];
    if (!ent) {
        throw new Error();
    }
    return ent;
}

function setEntitySate(entity: EntityId) {
    app.entites[entity.__type__] = app.entites[entity.__type__] ?? {};
    return app.entites[entity.__type__][entity.__id__] = entity;
}

//todo introduce counter for nested dispatches?
export function dispatch<T extends EntityId>(entity: EntityIdFor<T>, action: (state: Immutable<T>) => undefined | Partial<T>) {
    const prevState = getEntitySate(entity);
    const newStateDiff = action(prevState);

    if (newStateDiff) {
        setEntitySate({
            ...prevState,
            ...newStateDiff
        });
        app.onStateChanged?.();

    }
}