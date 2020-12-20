import React from "react";
import { startNewRenderingFrame, endRenderingFrame, makeApp } from "./observable-proxy";

type App =  ReturnType<typeof makeApp>;

export const AppContext = React.createContext<{
    app?: App
}>({});


// this is veru basic, but it works
let observerIdCounter = 1;

//todo make observer that works with functional components
export class Observer extends React.Component<{
    render: () => React.ReactNode
}, {
    observerId: number
}> {

    static contextType = AppContext;

    state = {
        observerId: (observerIdCounter += 1)
    }

    componentWillUnmount() {
        const app = this.context.app as App;
        if(app.dependencyMap_ObserverId_Callback.has(this.state.observerId)) {
            app.dependencyMap_ObserverId_Callback.delete(this.state.observerId);
        }
    }

    render() {
        startNewRenderingFrame();

        const children = this.props.render();

        const dependencies = endRenderingFrame();
        //console.log('Captured deps', Array.from(dependencies.values()));

        const app = this.context.app as App;
        //console.log(app);
        //todo move into separate function
        for(const [obj, keys] of dependencies) {

            if(app.dependencyMap_Object_Key_ObserverIds.has(obj) === false) {
                app.dependencyMap_Object_Key_ObserverIds.set(obj, new Map());
            }
            
            const map = app.dependencyMap_Object_Key_ObserverIds.get(obj)!;

            for(const key of keys) {
                if(map.has(key) === false) {
                    map.set(key, new Set());
                }
                const set = map.get(key)!;
                set.add(this.state.observerId);
            }
        }

        app.dependencyMap_ObserverId_Callback.set(this.state.observerId, () => this.forceUpdate());

        return children;
    }
}