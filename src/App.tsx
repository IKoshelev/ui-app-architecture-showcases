import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable, reaction } from "mobx"
import { observer } from "mobx-react"

// Model the application state.
class Timer {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this);
        reaction(
          () => this.secondsPassed,
          (seconds) => console.log(seconds)
        );
    }

    increase() {
        this.secondsPassed += 1
    }

    get secondeDoubled(){
      return this.secondsPassed * 2;
    }

    reset() {
        this.secondsPassed = 0
    }
}

export const myTimer = new Timer()

// Build a "user interface" that uses the observable state.
export const TimerView = observer(({ timer }: { timer: Timer }) => (
    <button onClick={() => timer.reset()}>Seconds passed: {timer.secondsPassed}</button>
))

//ReactDOM.render(<TimerView timer={myTimer} />, document.body)

// Update the 'Seconds passed: X' text every second.
setInterval(() => {
    myTimer.increase()
}, 1000)