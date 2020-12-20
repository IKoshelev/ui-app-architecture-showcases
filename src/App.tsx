
import { makeApp } from "./util/observable-proxy";

type App = {
    message: string,
    counter: number
}


export const app = makeApp({
    message: ' start adding arbitrary sub-objects and observe reactions',
    counter: 1
} as App);

