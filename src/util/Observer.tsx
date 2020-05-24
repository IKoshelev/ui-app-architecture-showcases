import React from "react";
import { startNewRenderingFrame, endRenderingFrame, app } from "./Entity";

// this is veru basic, but it works
let observerIdCounter = 1;
export class Observer extends React.Component<{
    render: () => React.ReactNode
}, {
    observerId: number
}> {

    state = {
        observerId: (observerIdCounter += 1)
    }

    componentWillUnmount() {
        delete app.componentDependencyListeneres[this.state.observerId];
    }

    render() {
        startNewRenderingFrame();

        const children = this.props.render();

        const dependencies = endRenderingFrame();
        console.log('Captured deps', Array.from(dependencies.values()));

        app.componentDependencyListeneres[this.state.observerId] = (mutatedId) => {
            if (dependencies.has(mutatedId)) {
                setTimeout(() => this.forceUpdate());
            }
        }

        return children;
    }
}