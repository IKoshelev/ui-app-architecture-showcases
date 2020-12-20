import React, { useContext, useEffect, useState } from "react";
import { startNewRenderingFrame, endRenderingFrame, makeApp } from "./observable-proxy";

type App = ReturnType<typeof makeApp>;

export const AppContext = React.createContext<{
    app?: App
}>({});


// this is veru basic, but it works
let observerIdCounter = 1;

// Todo imprvoe signature, make observer that can work with class components 
export function observer2<T>(WrappedComponent: T): T {
    return function () {

        const [observerId, _] = useState(() => (observerIdCounter += 1));
        const app = useContext(AppContext).app!;
        const [x, update] = useState(0);
        function forceUpdate() {
            update(x + 1);
        }

        useEffect(() => () => {
            if (app.dependencyMap_ObserverId_Callback.has(observerId)) {
                app.dependencyMap_ObserverId_Callback.delete(observerId);
            }
        },
            []);

        console.log(`observer rendering start ${observerId}`);

        startNewRenderingFrame();

        const WrappedComponentAny = WrappedComponent as any; // todo type this better
        const children = WrappedComponentAny(...arguments);

        const dependencies = endRenderingFrame();
        
        //todo move into separate function
        for (const [obj, keys] of dependencies) {

            if (app.dependencyMap_Object_Key_ObserverIds.has(obj) === false) {
                app.dependencyMap_Object_Key_ObserverIds.set(obj, new Map());
            }

            const map = app.dependencyMap_Object_Key_ObserverIds.get(obj)!;

            for (const key of keys) {
                if (map.has(key) === false) {
                    map.set(key, new Set());
                }
                const set = map.get(key)!;
                set.add(observerId);
            }
        }

        app.dependencyMap_ObserverId_Callback.set(observerId, () =>{
            console.log(`Triggering rerender of observerId ${observerId}`);
            forceUpdate();
        });

        console.log(`observer rendering end ${observerId}`);
        return children;

    } as unknown as T;
}