import { observable, action } from "mobx";

export const ticker1second = observable({
    lastTickDate: new Date()
});

setInterval(action(function tick() {
    ticker1second.lastTickDate = new Date();
}), 1000);