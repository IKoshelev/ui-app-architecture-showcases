type Key = string | number | symbol;

export const entireObjectAccessSymbol = Symbol('Entire-object-symbol');  //todo refine to mean key addition/deletion

type EntireObjectSymbol = typeof entireObjectAccessSymbol;

type ObservailityCallbacks = {
    notifyReadAccess(object: object, key: Key | EntireObjectSymbol): void,
    notifyWriteAccess(object: object, key: Key): void
};

export const proxyRegistry = new WeakMap<object, object>();

function makeObservableProxy<T extends object>(state: T, observabilityCallbacks: ObservailityCallbacks): T {

    if(proxyRegistry.has(state)){
        return proxyRegistry.get(state) as T;
    }

    const proxy = new Proxy(state as any, {
        get: function (oTarget, sKey) {
            observabilityCallbacks.notifyReadAccess(oTarget, sKey);
            const result = oTarget[sKey];
            if (typeof result === 'object') {
                return makeObservableProxy(result, observabilityCallbacks);
            }
            return result;
        },
        set: function (oTarget, sKey, vValue) {
            if(!(sKey in oTarget)) {
                observabilityCallbacks.notifyWriteAccess(oTarget, entireObjectAccessSymbol);
            } 
            observabilityCallbacks.notifyWriteAccess(oTarget, sKey);
            const result = oTarget[sKey] = vValue;
            if (typeof result === 'object') {
                return makeObservableProxy(result, observabilityCallbacks);
            }
            return true;
        },
        deleteProperty: function (oTarget, sKey) {
            if(sKey in oTarget) {
                observabilityCallbacks.notifyWriteAccess(oTarget, entireObjectAccessSymbol);
            } 
            observabilityCallbacks.notifyWriteAccess(oTarget, sKey);
            return delete oTarget[sKey];
        },
        ownKeys: function (oTarget) {
            observabilityCallbacks.notifyReadAccess(oTarget, entireObjectAccessSymbol);
            return Object.getOwnPropertyNames(oTarget);
        },
        has: function (oTarget, sKey) {
            observabilityCallbacks.notifyReadAccess(oTarget, sKey);
            return sKey in oTarget || oTarget.hasItem(sKey);
        },
        defineProperty: function (oTarget, sKey, oDesc) {
            if(!(sKey in oTarget)) {
                observabilityCallbacks.notifyWriteAccess(oTarget, entireObjectAccessSymbol);
            } 
            observabilityCallbacks.notifyWriteAccess(oTarget, sKey);
            Object.defineProperty(oTarget, sKey, oDesc);
            return true;
        },
    }) as unknown as T;

    proxyRegistry.set(state, proxy);
    return proxy;
}

// todo implemet all of:
// getPrototypeOf? (target: T): object | null;
// setPrototypeOf? (target: T, v: any): boolean;
// isExtensible? (target: T): boolean;
// preventExtensions? (target: T): boolean;
// getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor | undefined;
// has? (target: T, p: PropertyKey): boolean;
// get? (target: T, p: PropertyKey, receiver: any): any;
// set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
// deleteProperty? (target: T, p: PropertyKey): boolean;
// defineProperty? (target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean;
// ownKeys? (target: T): PropertyKey[];
// apply? (target: T, thisArg: any, argArray?: any): any;
// construct? (target: T, argArray: any, newTarget?: any): object;

export function makeApp<T extends object>(initialState: T) {

    let observabilityCallbacks: ObservailityCallbacks = {} as any; 

    let app = {
        root: makeObservableProxy(initialState, observabilityCallbacks),
        dependencyMap_Object_Key_ObserverIds: new WeakMap<
            object,
            Map<
                Key | EntireObjectSymbol,
                Set<number>> //todo add mid-step to cleanup ids for which ther is no more renderers
        >(),
        dependencyMap_ObserverId_Callback: new Map<number, () => void>()
    };

    observabilityCallbacks.notifyReadAccess = (obj: object, key: Key | EntireObjectSymbol) => {
        trackInCurrentObserverFrame(obj, key);
    }

    observabilityCallbacks.notifyWriteAccess = (object: object, key: Key) => {

        if(!app.dependencyMap_Object_Key_ObserverIds.has(object)) {
            return;
        }

        const map = app.dependencyMap_Object_Key_ObserverIds.get(object)!;

        if(!map.has(key)) {
            return;
        }

        const dependantIds = map.get(key)!;

        dependantIds.forEach(x => {
            if(app.dependencyMap_ObserverId_Callback.has(x)) {
                const callback = app.dependencyMap_ObserverId_Callback.get(x)!;
                setTimeout(callback);
            }
        });
    }

    return app as Readonly<typeof app>;
}

const obeserverFrameDependencyStack: Map<object, Set<Key | EntireObjectSymbol>>[] = [];
function trackInCurrentObserverFrame(obj: object, key: Key | EntireObjectSymbol) {

    if (obeserverFrameDependencyStack.length === 0) {
        return;
    }
    const currentFreameDependencyMap = obeserverFrameDependencyStack[obeserverFrameDependencyStack.length - 1];

    if (currentFreameDependencyMap.has(obj) === false) {
        currentFreameDependencyMap.set(obj, new Set<Key | EntireObjectSymbol>([key]));
    } else {
        currentFreameDependencyMap.get(obj)?.add(key);
    }
}

export function startNewRenderingFrame() {
    obeserverFrameDependencyStack.push(new Map<object, Set<Key | EntireObjectSymbol>>());
}

export function endRenderingFrame() {
    const frame = obeserverFrameDependencyStack.pop();
    if (!frame) {
        throw new Error();
    }
    return frame;
}